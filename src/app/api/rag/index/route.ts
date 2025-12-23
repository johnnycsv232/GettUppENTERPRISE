import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processDocument } from "@/lib/rag/document-indexer";
import { verifyAdmin, withAuth } from "@/lib/security/auth-api";

const IndexRequestSchema = z.object({
	filename: z.string(),
	content: z.string(),
	contentType: z.string().optional(),
});

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
			const { filename, content, contentType } = IndexRequestSchema.parse(body);

			const result = await processDocument(filename, content, contentType);

			if (!result) {
				return NextResponse.json(
					{ error: "Document rejected by security filters" },
					{ status: 400 },
				);
			}

			return NextResponse.json({ success: true, index: result });
		} catch (error: unknown) {
			console.error("RAG Index Error:", error);
			if (error instanceof z.ZodError) {
				return NextResponse.json({ error: error.issues }, { status: 400 });
			}
			return NextResponse.json(
				{ error: "Internal RAG Index Error" },
				{ status: 500 },
			);
		}
	});
}
