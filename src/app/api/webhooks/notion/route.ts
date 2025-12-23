import { NextRequest, NextResponse } from "next/server";
import { notionSync } from "@/lib/rag/notion-sync";
import { secureCompare } from "@/lib/security/auth-api";

export async function POST(req: NextRequest) {
	try {
		const secret = req.headers.get("x-agent-secret");
		const expectedSecret = process.env.AGENT_SECRET_KEY;

		if (!expectedSecret || !secret || !secureCompare(secret, expectedSecret)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const {
			pageId,
			syncAll,
			maxPages,
			pageSize,
			dryRun,
			databaseId,
			databaseIds,
		} = body;

		if (typeof databaseId === "string") {
			const result = await notionSync.syncDatabase(databaseId, {
				maxPages: typeof maxPages === "number" ? maxPages : undefined,
				pageSize: typeof pageSize === "number" ? pageSize : undefined,
				dryRun: Boolean(dryRun),
			});
			return NextResponse.json({ success: true, result });
		}

		if (
			Array.isArray(databaseIds) &&
			databaseIds.every((x) => typeof x === "string")
		) {
			const results = [];
			for (const dbId of databaseIds) {
				// sequential by default to reduce Notion 429s
				const result = await notionSync.syncDatabase(dbId, {
					maxPages: typeof maxPages === "number" ? maxPages : undefined,
					pageSize: typeof pageSize === "number" ? pageSize : undefined,
					dryRun: Boolean(dryRun),
				});
				results.push(result);
			}
			return NextResponse.json({ success: true, results });
		}

		if (syncAll === true) {
			const result = await notionSync.syncAllAccessiblePages({
				maxPages: typeof maxPages === "number" ? maxPages : undefined,
				pageSize: typeof pageSize === "number" ? pageSize : undefined,
				dryRun: Boolean(dryRun),
			});
			return NextResponse.json({ success: true, result });
		}

		if (!pageId) {
			return NextResponse.json(
				{
					error:
						"Missing pageId (or set syncAll=true, or provide databaseId/databaseIds)",
				},
				{ status: 400 },
			);
		}

		const result = await notionSync.syncPage(pageId);
		return NextResponse.json({ success: true, result });
	} catch (e: unknown) {
		console.error("[NotionWebhook] Error:", e);
		return NextResponse.json(
			{
				error: "Sync failed",
				details: e instanceof Error ? e.message : "Undefined error",
			},
			{ status: 500 },
		);
	}
}
