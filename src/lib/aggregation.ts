/**
 * @file aggregation.ts
 * @description Distributed counter aggregation for O(1) dashboard queries
 * @module lib/aggregation
 *
 * Instead of reading all documents to calculate metrics (O(n) reads),
 * we maintain pre-computed counters that update atomically when data changes.
 * This reduces dashboard load from potentially thousands of reads to just 1.
 */

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";

/** Tier pricing for MRR calculations */
const TIER_PRICES: Record<string, number> = {
	t1: 445,
	t2: 695,
	vip: 995,
	pilot: 0, // One-time, not MRR
};

/**
 * Stats document structure stored at stats/dashboard
 */
export interface DashboardStats {
	activeClients: number;
	totalLeads: number;
	pilotsThisMonth: number;
	mrr: number;
	mrrByTier: Record<string, number>;
	lastUpdated: Date;
	// Month tracking for pilot resets
	currentMonth: string;
}

/**
 * Get or initialize the dashboard stats document
 */
export async function getDashboardStats(): Promise<DashboardStats> {
	const db = adminDb();
	const statsRef = db.collection("stats").doc("dashboard");
	const doc = await statsRef.get();

	const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

	if (!doc.exists) {
		// Initialize with zeros - will be populated by recalculateStats()
		const initialStats: DashboardStats = {
			activeClients: 0,
			totalLeads: 0,
			pilotsThisMonth: 0,
			mrr: 0,
			mrrByTier: { t1: 0, t2: 0, vip: 0 },
			lastUpdated: new Date(),
			currentMonth,
		};
		await statsRef.set(initialStats);
		return initialStats;
	}

	const data = doc.data() as DashboardStats;

	// Reset monthly counters if month changed
	if (data.currentMonth !== currentMonth) {
		await statsRef.update({
			pilotsThisMonth: 0,
			currentMonth,
			lastUpdated: new Date(),
		});
		data.pilotsThisMonth = 0;
		data.currentMonth = currentMonth;
	}

	return data;
}

/**
 * Increment active client count and MRR when a new subscription becomes active
 */
export async function onClientActivated(tier: string): Promise<void> {
	const db = adminDb();
	const statsRef = db.collection("stats").doc("dashboard");
	const tierPrice = TIER_PRICES[tier] || 0;

	await statsRef.update({
		activeClients: FieldValue.increment(1),
		mrr: FieldValue.increment(tierPrice),
		[`mrrByTier.${tier}`]: FieldValue.increment(tierPrice),
		lastUpdated: new Date(),
	});
}

/**
 * Decrement active client count and MRR when a subscription is cancelled
 */
export async function onClientChurned(tier: string): Promise<void> {
	const db = adminDb();
	const statsRef = db.collection("stats").doc("dashboard");
	const tierPrice = TIER_PRICES[tier] || 0;

	await statsRef.update({
		activeClients: FieldValue.increment(-1),
		mrr: FieldValue.increment(-tierPrice),
		[`mrrByTier.${tier}`]: FieldValue.increment(-tierPrice),
		lastUpdated: new Date(),
	});
}

/**
 * Update MRR when a client changes tier
 */
export async function onClientTierChanged(
	oldTier: string,
	newTier: string,
): Promise<void> {
	const db = adminDb();
	const statsRef = db.collection("stats").doc("dashboard");
	const oldPrice = TIER_PRICES[oldTier] || 0;
	const newPrice = TIER_PRICES[newTier] || 0;
	const delta = newPrice - oldPrice;

	await statsRef.update({
		mrr: FieldValue.increment(delta),
		[`mrrByTier.${oldTier}`]: FieldValue.increment(-oldPrice),
		[`mrrByTier.${newTier}`]: FieldValue.increment(newPrice),
		lastUpdated: new Date(),
	});
}

/**
 * Increment lead count when a new lead is added
 */
export async function onLeadAdded(isPilot: boolean = false): Promise<void> {
	const db = adminDb();
	const statsRef = db.collection("stats").doc("dashboard");

	const updates: Record<string, unknown> = {
		totalLeads: FieldValue.increment(1),
		lastUpdated: new Date(),
	};

	if (isPilot) {
		updates.pilotsThisMonth = FieldValue.increment(1);
	}

	await statsRef.update(updates);
}

/**
 * Full recalculation of stats from source data
 * Call this once during migration or for periodic consistency checks
 * WARNING: This is O(n) - only use for initialization or debugging
 */
export async function recalculateAllStats(): Promise<DashboardStats> {
	const db = adminDb();
	const currentMonth = new Date().toISOString().slice(0, 7);
	const startOfMonth = new Date();
	startOfMonth.setDate(1);
	startOfMonth.setHours(0, 0, 0, 0);

	// Get active clients
	const clientsSnapshot = await db
		.collection("clients")
		.where("subscriptionStatus", "==", "active")
		.get();

	let mrr = 0;
	const mrrByTier: Record<string, number> = { t1: 0, t2: 0, vip: 0 };

	clientsSnapshot.forEach((doc) => {
		const tier = doc.data().tier as string;
		const price = TIER_PRICES[tier] || 0;
		mrr += price;
		if (mrrByTier[tier] !== undefined) {
			mrrByTier[tier] += price;
		}
	});

	// Get total leads
	const totalLeadsResult = await db.collection("leads").count().get();
	const totalLeads = totalLeadsResult.data().count;

	// Get pilots this month
	const pilotsSnapshot = await db
		.collection("leads")
		.where("status", "==", "pilot")
		.where("createdAt", ">=", startOfMonth)
		.get();

	const stats: DashboardStats = {
		activeClients: clientsSnapshot.size,
		totalLeads,
		pilotsThisMonth: pilotsSnapshot.size,
		mrr,
		mrrByTier,
		lastUpdated: new Date(),
		currentMonth,
	};

	// Write to stats document
	await db.collection("stats").doc("dashboard").set(stats);

	return stats;
}
