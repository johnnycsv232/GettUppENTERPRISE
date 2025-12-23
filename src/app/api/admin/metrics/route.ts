/**
 * @file api/admin/metrics/route.ts
 * @description Admin dashboard metrics API - Uses aggregation for O(1) reads
 * @module app/api/admin/metrics
 *
 * PERFORMANCE: This endpoint reads from pre-computed aggregation counters
 * instead of scanning all documents. This reduces Firestore reads from
 * potentially thousands to just 1-11 reads (1 stats doc + up to 10 activity items).
 */

import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats, recalculateAllStats } from "@/lib/aggregation";
import { adminDb } from "@/lib/firebase-admin";
import { withAuth } from "@/lib/security/auth-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DashboardMetrics {
	mrr: number;
	activeClients: number;
	pilotsThisMonth: number;
	conversionRate: number;
	recentActivity?: ActivityItem[];
	mrrByTier?: Record<string, number>;
	totalLeads?: number;
}

interface ActivityItem {
	type: "pilot" | "payment" | "delivery";
	venue: string;
	action: string;
	timestamp: string;
}

/**
 * GET /api/admin/metrics
 * Fetch dashboard metrics from pre-computed aggregation counters
 * Cost: ~11 Firestore reads (1 stats + 10 activity items)
 */
export async function GET(request: NextRequest) {
	return withAuth(request, async () => {
		try {
			const db = adminDb();

			// Read from aggregation document - O(1) instead of O(n)
			// This is just 1 read instead of reading all clients + all leads
			const stats = await getDashboardStats();

			// Get recent payments for activity feed (limited to 10)
			// This is the only collection scan, but it's indexed and limited
			const paymentsSnapshot = await db
				.collection("payments")
				.orderBy("createdAt", "desc")
				.limit(10)
				.get();

			const recentActivity: ActivityItem[] = paymentsSnapshot.docs.map(
				(doc) => {
					const data = doc.data();
					return {
						type: data.status === "completed" ? "payment" : "pilot",
						venue: data.customerEmail || "Unknown",
						action:
							data.status === "completed"
								? `Payment received: $${(data.amount / 100).toFixed(0)}`
								: "Payment processing",
						timestamp:
							data.createdAt?.toDate?.()?.toISOString() ||
							new Date().toISOString(),
					};
				},
			);

			// Calculate conversion rate from pre-computed stats
			const conversionRate =
				stats.totalLeads > 0
					? Math.round((stats.activeClients / stats.totalLeads) * 100)
					: 0;

			const metrics: DashboardMetrics = {
				mrr: stats.mrr,
				activeClients: stats.activeClients,
				pilotsThisMonth: stats.pilotsThisMonth,
				conversionRate,
				recentActivity,
				mrrByTier: stats.mrrByTier,
				totalLeads: stats.totalLeads,
			};

			return NextResponse.json(metrics);
		} catch (error) {
			console.error("Metrics fetch error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch metrics" },
				{ status: 500 },
			);
		}
	});
}

/**
 * POST /api/admin/metrics
 * Recalculate all stats from source data (admin utility)
 * WARNING: This is O(n) - only use for initialization or debugging
 */
export async function POST(request: NextRequest) {
	return withAuth(request, async () => {
		try {
			const stats = await recalculateAllStats();
			return NextResponse.json({
				success: true,
				message: "Stats recalculated from source data",
				stats,
			});
		} catch (error) {
			console.error("Stats recalculation error:", error);
			return NextResponse.json(
				{ error: "Failed to recalculate stats" },
				{ status: 500 },
			);
		}
	});
}
