/**
 * @file route.ts
 * @description Stripe Webhook Handler - Processes successful payments and subscription updates
 * @module app/api/webhooks/stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/security/rate-limiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Rate limiting for webhooks
  const clientIp = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`webhook:${clientIp}`, RATE_LIMITS.webhooks);
  
  if (!rateLimit.success) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const firestore = db();

  try {
    switch (event.type) {
      // 1. Checkout Completed -> Create Payment Record & Update Client
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Log payment
        await firestore.collection('payments').add({
          stripeSessionId: session.id,
          amount: session.amount_total, // in cents
          currency: session.currency,
          status: 'completed',
          customerEmail: session.customer_details?.email,
          metadata: session.metadata, // contains tier info
          createdAt: new Date(),
        });

        // If subscription, create/update client record
        if (session.mode === 'subscription') {
           // Logic to sync Stripe customer to Firestore 'clients' collection
           // This connects the revenue to the CRM
           const customerId = session.customer as string;
           const email = session.customer_details?.email;
           const tier = session.metadata?.tier || 'unknown';

           // Upsert client based on stripeCustomerId
           const clientsRef = firestore.collection('clients');
           const q = clientsRef.where('stripeCustomerId', '==', customerId).limit(1);
           const snapshot = await q.get();

           if (snapshot.empty) {
             await clientsRef.add({
               stripeCustomerId: customerId,
               email: email,
               name: session.customer_details?.name || 'New Client',
               tier: tier,
               subscriptionStatus: 'active',
               createdAt: new Date(),
               totalShoots: 0
             });
           } else {
             await snapshot.docs[0].ref.update({
               tier: tier,
               subscriptionStatus: 'active',
               updatedAt: new Date()
             });
           }
        } else if (session.metadata?.tier === 'pilot') {
           // Handle Pilot purchase - Create a 'lead' or 'pilot' record
           await firestore.collection('leads').add({
             email: session.customer_details?.email,
             name: session.customer_details?.name,
             status: 'pilot',
             source: 'website_checkout',
             createdAt: new Date(),
             notes: 'Purchased Pilot Night via Stripe'
           });
        }
        
        console.log(`✅ Checkout completed: ${session.id}`);
        break;
      }

      // ============================================
      // Subscription updated - Sync status
      // ============================================
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const clientsSnapshot = await firestore.collection('clients')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!clientsSnapshot.empty) {
          const clientDoc = clientsSnapshot.docs[0];
          const newStatus = subscription.status === 'active' ? 'active' : 
                           subscription.status === 'paused' ? 'paused' : 'paused';
          
          await clientDoc.ref.update({
            subscriptionStatus: newStatus,
            updatedAt: new Date(),
          });
          
          console.log(`✅ Subscription updated for customer ${customerId}: ${newStatus}`);
        }
        break;
      }

      // ============================================
      // Subscription deleted - Mark as churned
      // ============================================
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const clientsSnapshot = await firestore.collection('clients')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!clientsSnapshot.empty) {
          const clientDoc = clientsSnapshot.docs[0];
          await clientDoc.ref.update({
            subscriptionStatus: 'churned',
            updatedAt: new Date(),
          });
          
          console.log(`⚠️ Subscription cancelled for customer ${customerId}`);
        }
        break;
      }

      // ============================================
      // Payment failed - Flag for follow-up
      // ============================================
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Log failed payment
        await firestore.collection('payments').add({
          stripeInvoiceId: invoice.id,
          stripeCustomerId: customerId,
          amount: invoice.amount_due,
          currency: invoice.currency,
          status: 'failed',
          createdAt: new Date(),
        });

        // Update client record
        const clientsSnapshot = await firestore.collection('clients')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!clientsSnapshot.empty) {
          const clientDoc = clientsSnapshot.docs[0];
          await clientDoc.ref.update({
            subscriptionStatus: 'paused',
            updatedAt: new Date(),
            'metadata.paymentFailedAt': new Date(),
          });
        }

        console.error(`❌ Payment failed for customer ${customerId}`);
        break;
      }

      // ============================================
      // Unhandled event type
      // ============================================
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Processing failed' }, 
      { status: 500 }
    );
  }
}
