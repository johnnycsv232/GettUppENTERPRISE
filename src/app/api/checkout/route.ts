/**
 * @file route.ts
 * @description Stripe Checkout API Route - Handles both one-time and subscription checkouts
 * @module app/api/checkout
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
import { getStripe, STRIPE_PRODUCTS, TIER_PRICES } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
	tier: z.enum(["pilot", "t1", "t2", "vip"]),
	returnUrl: z.string().url(),
	email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
	// Rate limiting
	const clientIp = getClientIp(request.headers);
	const rateLimit = checkRateLimit(`checkout:${clientIp}`, {
		maxRequests: 10,
		windowMs: 60 * 1000,
	});

	if (!rateLimit.success) {
		return NextResponse.json(
			{ error: "Too many requests. Please wait before trying again." },
			{ status: 429 },
		);
	}

	try {
		const body = await request.json();
		const { tier, returnUrl, email } = checkoutSchema.parse(body);

		// Determine if this is a subscription or one-time payment
		const isSubscription = tier !== "pilot";

		// Get the correct price ID
		const priceId =
			STRIPE_PRODUCTS[tier.toUpperCase() as keyof typeof STRIPE_PRODUCTS];

		const lineItem: Record<string, unknown> = {
			quantity: 1,
		};

		// Check if we have a valid price ID (starts with price_)
		if (!priceId || !priceId.startsWith("price_")) {
			// Fallback to ad-hoc price data
			lineItem.price_data = {
				currency: "usd",
				product_data: {
					name: `GettUpp ${tier.toUpperCase()} Package`,
					description:
						tier === "pilot"
							? "One-time Pilot Night"
							: "Monthly Content Retainer",
				},
				unit_amount: TIER_PRICES[tier],
				...(isSubscription && { recurring: { interval: "month" } }),
			};
		} else {
			// Use the real Price ID from Stripe
			lineItem.price = priceId;
		}

		const stripe = getStripe();
		const session = await stripe.checkout.sessions.create({
			mode: isSubscription ? "subscription" : "payment",
			line_items: [lineItem],
			success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${returnUrl}?canceled=true`,
			customer_email: email,
			automatic_tax: { enabled: false }, // MN advertising exemption
			metadata: {
				tier,
				type: isSubscription ? "subscription" : "one-time",
			},
		});

		return NextResponse.json({ sessionUrl: session.url });
	} catch (error) {
		console.error("Checkout error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request data", details: error.issues },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to create checkout session" },
			{ status: 500 },
		);
	}
}
