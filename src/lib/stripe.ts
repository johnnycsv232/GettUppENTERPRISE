/**
 * @file stripe.ts
 * @description Stripe integration for GettUpp subscriptions and payments
 * @module lib/stripe
 */

import Stripe from "stripe";

// Initialize Stripe client (lazy initialization to avoid build errors)
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
	if (!stripeInstance) {
		const apiKey = process.env.STRIPE_SECRET_KEY;
		if (!apiKey) {
			throw new Error("STRIPE_SECRET_KEY is not configured");
		}
		stripeInstance = new Stripe(apiKey, {
			typescript: true,
		});
	}
	return stripeInstance;
}

// Legacy export for compatibility (will throw if accessed during build)
export const stripe = new Proxy({} as Stripe, {
	get(_, prop) {
		return getStripe()[prop as keyof Stripe];
	},
});

// ============================================
// Product/Price Configuration
// ============================================

/**
 * Stripe Price IDs from your Stripe Dashboard
 * These are the actual price IDs for GettUpp products
 */
export const STRIPE_PRODUCTS = {
	PILOT: process.env.STRIPE_PRICE_PILOT || "price_1SY1yqGfFr3wuAHAqmytgSsj", // $345
	T1: process.env.STRIPE_PRICE_T1 || "price_1SY1yqGfFr3wuAHAQhUzUNr9", // $445
	T2: process.env.STRIPE_PRICE_T2 || "price_1SY1yrGfFr3wuAHAoc46u4WB", // $695
	VIP: process.env.STRIPE_PRICE_VIP || "price_1SY1yrGfFr3wuAHA7cULY8Ef", // $995
} as const;

/**
 * Tier prices in cents (Stripe uses smallest currency unit)
 */
export const TIER_PRICES = {
	pilot: 34500, // $345
	t1: 44500, // $445/mo
	t2: 69500, // $695/mo
	vip: 99500, // $995/mo
} as const;

/**
 * Tier display names
 */
export const TIER_NAMES = {
	pilot: "Pilot Package",
	t1: "Tier 1 Monthly",
	t2: "Tier 2 Monthly",
	vip: "VIP Monthly",
} as const;

export type TierKey = keyof typeof TIER_PRICES;

// ============================================
// Subscription Functions
// ============================================

/**
 * Create a new subscription for a customer
 * @param customerId - Stripe customer ID
 * @param priceId - Stripe price ID
 * @returns Stripe subscription object
 */
export async function createSubscription(
	customerId: string,
	priceId: string,
): Promise<Stripe.Subscription> {
	return getStripe().subscriptions.create({
		customer: customerId,
		items: [{ price: priceId }],
		automatic_tax: { enabled: false }, // MN advertising services tax exemption
		payment_behavior: "error_if_incomplete",
		expand: ["latest_invoice.payment_intent"],
	});
}

/**
 * Cancel a subscription
 * @param subscriptionId - Stripe subscription ID
 * @param immediately - Cancel now or at period end
 */
export async function cancelSubscription(
	subscriptionId: string,
	immediately: boolean = false,
): Promise<Stripe.Subscription> {
	if (immediately) {
		return getStripe().subscriptions.cancel(subscriptionId);
	}
	return getStripe().subscriptions.update(subscriptionId, {
		cancel_at_period_end: true,
	});
}

/**
 * Pause a subscription (useful for seasonal clients)
 * @param subscriptionId - Stripe subscription ID
 */
export async function pauseSubscription(
	subscriptionId: string,
): Promise<Stripe.Subscription> {
	return getStripe().subscriptions.update(subscriptionId, {
		pause_collection: {
			behavior: "void",
		},
	});
}

/**
 * Resume a paused subscription
 * @param subscriptionId - Stripe subscription ID
 */
export async function resumeSubscription(
	subscriptionId: string,
): Promise<Stripe.Subscription> {
	return getStripe().subscriptions.update(subscriptionId, {
		pause_collection: "",
	});
}

// ============================================
// Checkout Functions
// ============================================

/**
 * Create a Stripe Checkout session for one-time purchase (Pilot)
 * @param tier - Product tier
 * @param successUrl - Redirect URL on success
 * @param cancelUrl - Redirect URL on cancel
 * @param customerEmail - Optional customer email for prefill
 */
export async function createCheckoutSession(
	tier: TierKey,
	successUrl: string,
	cancelUrl: string,
	customerEmail?: string,
): Promise<Stripe.Checkout.Session> {
	const isSubscription = tier !== "pilot";

	return getStripe().checkout.sessions.create({
		mode: isSubscription ? "subscription" : "payment",
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: TIER_NAMES[tier],
						description: `GettUpp ${tier.toUpperCase()} - Professional content creation`,
					},
					unit_amount: TIER_PRICES[tier],
					...(isSubscription && { recurring: { interval: "month" } }),
				},
				quantity: 1,
			},
		],
		automatic_tax: { enabled: false }, // MN advertising exemption
		customer_email: customerEmail,
		success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: cancelUrl,
		metadata: {
			tier,
		},
	});
}

/**
 * Create a payment link for easy sharing
 * @param tier - Product tier
 */
export async function createPaymentLink(
	tier: TierKey,
): Promise<Stripe.PaymentLink> {
	// First create a price
	const price = await getStripe().prices.create({
		currency: "usd",
		unit_amount: TIER_PRICES[tier],
		product_data: {
			name: TIER_NAMES[tier],
		},
	});

	return getStripe().paymentLinks.create({
		line_items: [{ price: price.id, quantity: 1 }],
		automatic_tax: { enabled: false },
	});
}

// ============================================
// Customer Functions
// ============================================

/**
 * Create a new Stripe customer
 * @param email - Customer email
 * @param name - Customer name
 * @param metadata - Additional metadata
 */
export async function createCustomer(
	email: string,
	name: string,
	metadata?: Record<string, string>,
): Promise<Stripe.Customer> {
	return getStripe().customers.create({
		email,
		name,
		metadata,
	});
}

/**
 * Get customer by ID
 * @param customerId - Stripe customer ID
 */
export async function getCustomer(
	customerId: string,
): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
	return getStripe().customers.retrieve(customerId);
}

/**
 * Update customer details
 * @param customerId - Stripe customer ID
 * @param updates - Fields to update
 */
export async function updateCustomer(
	customerId: string,
	updates: Stripe.CustomerUpdateParams,
): Promise<Stripe.Customer> {
	return getStripe().customers.update(customerId, updates);
}

// ============================================
// Webhook Helpers
// ============================================

/**
 * Verify Stripe webhook signature
 * @param payload - Raw request body
 * @param signature - Stripe signature header
 * @returns Parsed event or null if invalid
 */
export function verifyWebhookSignature(
	payload: string | Buffer,
	signature: string,
): Stripe.Event | null {
	try {
		return getStripe().webhooks.constructEvent(
			payload,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!,
		);
	} catch (err) {
		console.error("Webhook signature verification failed:", err);
		return null;
	}
}
