/**
 * @file route.ts
 * @description Stripe webhook handler for payment and subscription events
 * @module api/webhooks/stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

// CRITICAL: Must be Node.js runtime (not Edge) for Firebase Admin
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for payments and subscriptions
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const db = adminDb();

  try {
    switch (event.type) {
      // ============================================
      // Checkout completed - Create payment record
      // ============================================
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Create payment record
        await db.collection('payments').add({
          stripeSessionId: session.id,
          stripeCustomerId: session.customer as string,
          amount: session.amount_total,
          currency: session.currency,
          status: 'completed',
          tier: session.metadata?.tier || 'unknown',
          customerEmail: session.customer_email,
          createdAt: new Date(),
        });

        // If this is a new customer, create client record
        if (session.customer_email && session.metadata?.tier) {
          const existingClient = await db.collection('clients')
            .where('email', '==', session.customer_email)
            .limit(1)
            .get();

          if (existingClient.empty) {
            await db.collection('clients').add({
              email: session.customer_email,
              name: session.customer_details?.name || 'Unknown',
              stripeCustomerId: session.customer as string,
              tier: session.metadata.tier,
              subscriptionId: session.subscription as string || '',
              subscriptionStatus: 'active',
              totalShoots: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
              metadata: {},
            });
          }
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

        const clientsSnapshot = await db.collection('clients')
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

        const clientsSnapshot = await db.collection('clients')
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
        await db.collection('payments').add({
          stripeInvoiceId: invoice.id,
          stripeCustomerId: customerId,
          amount: invoice.amount_due,
          currency: invoice.currency,
          status: 'failed',
          createdAt: new Date(),
        });

        // Update client record
        const clientsSnapshot = await db.collection('clients')
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
