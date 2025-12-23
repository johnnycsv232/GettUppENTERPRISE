import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, withAuth } from "@/lib/security/auth-api";

export async function GET(req: NextRequest) {
	return withAuth(req, async (uid) => {
		const isAdmin = await verifyAdmin(uid);
		if (!isAdmin) {
			return NextResponse.json(
				{ error: "Forbidden: Admin access required" },
				{ status: 403 },
			);
		}

		// Mock status for now - Phase 10 implements real metrics stub
		return NextResponse.json({
			status: "operational",
			gemini: "connected",
			cache: "active",
			timestamp: new Date().toISOString(),
		});
	});
}
