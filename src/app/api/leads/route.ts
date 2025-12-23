/**
 * @file api/leads/route.ts
 * @description Lead capture API for pilot intake form
 * @module app/api/leads
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { onLeadAdded } from "@/lib/aggregation";
import { adminDb } from "@/lib/firebase-admin";
import { withAuth } from "@/lib/security/auth-api";
import {
	checkRateLimit,
	getClientIp,
	RATE_LIMITS,
} from "@/lib/security/rate-limiter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Zod schema for lead validation
 */
const leadSchema = z.object({
	venueName: z.string().min(2, "Venue name must be at least 2 characters"),
	location: z.string().min(1, "Location is required"),
	contactName: z.string().min(2, "Contact name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Phone number must be at least 10 digits"),
	preferredDate: z.string().optional(),
	eventType: z.enum(["friday", "saturday", "special"]).optional(),
	goals: z
		.string()
		.min(10, "Please describe your goals in at least 10 characters")
		.optional(),
	source: z
		.enum(["instagram_dm", "website_form", "referral", "qr"])
		.default("website_form"),
	status: z.string().default("new"),
});

type LeadInput = z.infer<typeof leadSchema>;

/**
 * POST /api/leads
 * Create a new lead from pilot intake form
 */
export async function POST(request: NextRequest) {
	// Rate limiting for lead submissions
	const clientIp = getClientIp(request.headers);
	const rateLimit = checkRateLimit(`leads:${clientIp}`, {
		maxRequests: 5,
		windowMs: 60 * 1000,
	}); // 5 per minute

	if (!rateLimit.success) {
		return NextResponse.json(
			{ error: "Too many submissions. Please wait before trying again." },
			{ status: 429 },
		);
	}

	try {
		const body = await request.json();
		const validatedData = leadSchema.parse(body);

		// Generate a unique lead ID
		const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

		// Save to Firestore
		const db = adminDb();
		await db
			.collection("leads")
			.doc(leadId)
			.set({
				...validatedData,
				id: leadId,
				createdAt: new Date(),
				lastContactAt: new Date(),
				nextActionAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
			});

		// Update aggregation counters
		await onLeadAdded(false); // false = not a pilot (regular lead)

		console.log("📥 New lead saved:", {
			id: leadId,
			venueName: validatedData.venueName,
			email: validatedData.email,
			source: validatedData.source,
		});

		return NextResponse.json({
			success: true,
			leadId,
			message: "Lead captured successfully",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: error.issues.map((issue) => ({
						field: issue.path.join("."),
						message: issue.message,
					})),
				},
				{ status: 400 },
			);
		}

		console.error("Lead capture error:", error);
		return NextResponse.json(
			{ error: "Failed to capture lead" },
			{ status: 500 },
		);
	}
}

/**
 * GET /api/leads
 * List all leads (admin only)
 */
export async function GET(request: NextRequest) {
	return withAuth(request, async () => {
		try {
			// Fetch from Firestore
			const db = adminDb();
			const snapshot = await db
				.collection("leads")
				.orderBy("createdAt", "desc")
				.limit(50)
				.get();

			const leads = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				// Convert Firestore timestamps to ISO strings
				createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
				lastContactAt:
					doc.data().lastContactAt?.toDate?.()?.toISOString() || null,
				nextActionAt:
					doc.data().nextActionAt?.toDate?.()?.toISOString() || null,
			}));

			return NextResponse.json({ leads, count: leads.length });
		} catch (error) {
			console.error("Leads fetch error:", error);
			return NextResponse.json(
				{ error: "Failed to fetch leads" },
				{ status: 500 },
			);
		}
	});
}
