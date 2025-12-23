import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { processDocument } from "@/lib/rag/document-indexer";
import { secureCompare } from "@/lib/security/auth-api";

export async function POST(req: NextRequest) {
	try {
		// Security Check (Agent Secret or Admin)
		const secret = req.headers.get("x-agent-secret") || "";
		const expectedSecret = process.env.AGENT_SECRET_KEY || "";
		const isAuthorized =
			expectedSecret && secureCompare(secret, expectedSecret);

		// Allow dev mode bypass or simple secret
		if (!isAuthorized && process.env.NODE_ENV !== "development") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const docsDir = path.join(process.cwd(), "docs");
		console.log(`[RAG Indexer] Scanning ${docsDir}`);

		const results = [];
		const files = await fs.readdir(docsDir);

		for (const file of files) {
			// Index .md files
			if (file.endsWith(".md")) {
				try {
					const content = await fs.readFile(path.join(docsDir, file), "utf-8");
					const result = await processDocument(file, content, "text/markdown");
					results.push({
						file,
						status: result ? "indexed" : "skipped",
						result,
					});
				} catch (e: unknown) {
					results.push({
						file,
						status: "error",
						error: e instanceof Error ? e.message : "Disk error",
					});
				}
			}
		}

		return NextResponse.json({
			success: true,
			count: results.length,
			details: results,
		});
	} catch (e: unknown) {
		console.error("[RAG Indexer] Error:", e);
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : "Indexer error" },
			{ status: 500 },
		);
	}
}
