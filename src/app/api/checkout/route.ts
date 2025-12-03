/**
 * @file route.ts
 * @description Checkout API - Creates Stripe checkout sessions
 * @module api/checkout
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, TierKey } from '@/lib/stripe';
import { z } from 'zod';

const CheckoutSchema = z.object({
  tier: z.enum(['pilot', 't1', 't2', 't3']),
  email: z.string().email().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { tier, email, successUrl, cancelUrl } = CheckoutSchema.parse(body);

    const session = await createCheckoutSession(
      tier as TierKey,
      successUrl,
      cancelUrl,
      email
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
