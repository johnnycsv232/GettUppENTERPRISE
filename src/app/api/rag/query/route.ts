import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryEngine } from "@/lib/rag/query-engine";
import { QueryRequestSchema } from "@/lib/rag/types";
import { verifyAdmin, withAuth } from "@/lib/security/auth-api";

export async function POST(req: NextRequest) {
	return withAuth(req, async (uid) => {
		const isAdmin = await verifyAdmin(uid);
		if (!isAdmin) {
			return NextResponse.json(
				{ error: "Forbidden: Admin access required" },
				{ status: 403 },
			);
		}

		try {
			const body = await req.json();
			const { query, limit } = QueryRequestSchema.parse(body);

			const result = await queryEngine.process(query, { limit });
			return NextResponse.json(result);
		} catch (error: unknown) {
			console.error("RAG Query Error:", error);
			if (error instanceof z.ZodError) {
				return NextResponse.json({ error: error.issues }, { status: 400 });
			}
			return NextResponse.json(
				{ error: "Internal RAG Query Error" },
				{ status: 500 },
			);
		}
	});
}
