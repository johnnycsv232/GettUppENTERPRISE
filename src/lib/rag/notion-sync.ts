
import { Client } from "@notionhq/client";
import {
	BlockObjectResponse,
	PageObjectResponse,
	RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { processDocument } from "./document-indexer";

type NotionId = string;

type SyncAllOptions = {
	/**
	 * Max number of pages to sync from Notion search results.
	 * This is a safety guard to prevent accidental massive crawls.
	 */
	maxPages?: number;
	/**
	 * Notion API page size (1..100). Defaults to 50.
	 */
	pageSize?: number;
	/**
	 * If true, discovers pages but does not index them.
	 */
	dryRun?: boolean;
};

type SyncAllResult = {
	pagesDiscovered: number;
	pagesAttempted: number;
	pagesSucceeded: number;
	pagesFailed: number;
	failedPageIds: string[];
};

type SyncDatabaseResult = SyncAllResult & {
	databaseId: string;
};

export class NotionSync {
	private client: Client;

	constructor() {
		// Use NOTION_TOKEN as defined in .env.local
		const token = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
		if (!token) {
			console.warn("NOTION_TOKEN not set. Notion sync will fail.");
		}
		this.client = new Client({
			auth: token,
		});
	}

	/**
	 * Syncs a specific Notion page to the RAG index.
	 * @param pageId The UUID of the Notion page
	 */
	async syncPage(pageId: string) {
		try {
			console.log(`[NotionSync] Syncing page: ${pageId}`);

			// 1. Fetch Page Metadata
			const page = (await this.client.pages.retrieve({
				page_id: pageId,
			})) as PageObjectResponse;
			const title = this.extractTitle(page);
			console.log(`[NotionSync] Found page: ${title}`);

			// 2. Fetch Page Content (Blocks)
			const blocks = await this.fetchAllBlockChildren(pageId);

			// 3. Convert to Text/Markdown
			const content = await this.blocksToMarkdown(blocks);

			// 4. Index
			const filename = `notion_${pageId}.md`; // Virtual filename

			// Add metadata header to content for better RAG context
			const fullContent = `# ${title}\n\nSource: ${page.url}\n\n${content}`;

			const result = await processDocument(
				filename,
				fullContent,
				"text/markdown",
			);

			if (result) {
				console.log(`[NotionSync] Successfully indexed: ${title}`);
			}
			return result;
		} catch (error) {
			console.error(`[NotionSync] Failed to sync page ${pageId}:`, error);
			throw error;
		}
	}

	/**
	 * Discovers all pages the integration can access via Notion "search" and syncs them.
	 *
	 * NOTE:
	 * - This does NOT grant workspace-wide access; it only syncs content that has been shared with the integration.
	 * - Use maxPages as a safety guard.
	 */
	async syncAllAccessiblePages(
		options: SyncAllOptions = {},
	): Promise<SyncAllResult> {
		const maxPages = options.maxPages ?? 200;
		const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 50));
		const dryRun = Boolean(options.dryRun);

		const pageIds = await this.discoverAccessiblePageIds({
			pageSize,
			maxPages,
		});

		const failedPageIds: string[] = [];
		let succeeded = 0;
		let attempted = 0;

		console.log(
			`[NotionSync] Discovered ${pageIds.length} accessible pages (maxPages=${maxPages}, pageSize=${pageSize}, dryRun=${dryRun})`,
		);

		for (const pageId of pageIds) {
			attempted += 1;
			if (dryRun) continue;
			try {
				await this.syncPage(pageId);
				succeeded += 1;
			} catch {
				failedPageIds.push(pageId);
			}
		}

		return {
			pagesDiscovered: pageIds.length,
			pagesAttempted: attempted,
			pagesSucceeded: succeeded,
			pagesFailed: failedPageIds.length,
			failedPageIds,
		};
	}

	/**
	 * Syncs all pages in a specific Notion database (query + pagination).
	 *
	 * This is the most reliable way to ingest operational truth (CRMs, trackers, Evidence Locker),
	 * versus relying on fuzzy search.
	 */
	async syncDatabase(
		databaseId: string,
		options: SyncAllOptions = {},
	): Promise<SyncDatabaseResult> {
		const maxPages = options.maxPages ?? 500;
		const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 50));
		const dryRun = Boolean(options.dryRun);

		const pageIds = await this.discoverDatabasePageIds(databaseId, {
			pageSize,
			maxPages,
		});

		const failedPageIds: string[] = [];
		let succeeded = 0;
		let attempted = 0;

		console.log(
			`[NotionSync] Discovered ${pageIds.length} database pages (databaseId=${databaseId}, maxPages=${maxPages}, pageSize=${pageSize}, dryRun=${dryRun})`,
		);

		for (const pageId of pageIds) {
			attempted += 1;
			if (dryRun) continue;
			try {
				await this.syncPage(pageId);
				succeeded += 1;
			} catch {
				failedPageIds.push(pageId);
			}
		}

		return {
			databaseId,
			pagesDiscovered: pageIds.length,
			pagesAttempted: attempted,
			pagesSucceeded: succeeded,
			pagesFailed: failedPageIds.length,
			failedPageIds,
		};
	}

	private extractTitle(page: PageObjectResponse): string {
		if ("properties" in page) {
			const props = page.properties;
			// Notion page titles are stored in the single property with type === "title".
			const titleProp =
				(Object.values(props).find(
					(p: unknown) => (p as { type?: string })?.type === "title",
				) as { type: "title"; title: RichTextItemResponse[] } | undefined) ??
				// fallback: common keys used in many templates
				// biome-ignore lint/suspicious/noExplicitAny: Notion client compatibility
				(props as any).Name ??
				// biome-ignore lint/suspicious/noExplicitAny: Notion client compatibility
				(props as any).title;

			if (
				titleProp &&
				titleProp.type === "title" &&
				Array.isArray(titleProp.title)
			) {
				return titleProp.title
					.map((t: RichTextItemResponse) => t.plain_text)
					.join("");
			}
		}
		return "Untitled Notion Page";
	}

	private async discoverDatabasePageIds(
		databaseId: string,
		args: { pageSize: number; maxPages: number },
	): Promise<NotionId[]> {
		const ids = new Set<NotionId>();
		let cursor: string | undefined = undefined;

		while (ids.size < args.maxPages) {
			const resp = (await this.withNotionRetry(() =>
				// biome-ignore lint/suspicious/noExplicitAny: Notion client compatibility
				(this.client.databases as any).query({
					database_id: databaseId,
					start_cursor: cursor,
					page_size: args.pageSize,
				}),
			)) as any;

			for (const result of resp.results ?? []) {
				if (result?.object === "page" && typeof result.id === "string") {
					ids.add(result.id);
					if (ids.size >= args.maxPages) break;
				}
			}

			if (!resp.has_more || !resp.next_cursor) break;
			cursor = resp.next_cursor;
		}

		return Array.from(ids);
	}

	private async discoverAccessiblePageIds(args: {
		pageSize: number;
		maxPages: number;
	}): Promise<NotionId[]> {
		const ids = new Set<NotionId>();
		let cursor: string | undefined = undefined;

		while (ids.size < args.maxPages) {
			const resp = (await this.withNotionRetry(() =>
				// biome-ignore lint/suspicious/noExplicitAny: Notion client compatibility
				(this.client as any).search({
					start_cursor: cursor,
					page_size: args.pageSize,
					filter: { property: "object", value: "page" },
					sort: { direction: "descending", timestamp: "last_edited_time" },
				}),
			)) as any;

			for (const result of resp.results ?? []) {
				if (result?.object === "page" && typeof result.id === "string") {
					ids.add(result.id);
					if (ids.size >= args.maxPages) break;
				}
			}

			if (!resp.has_more || !resp.next_cursor) break;
			cursor = resp.next_cursor;
		}

		return Array.from(ids);
	}

	private async fetchAllBlockChildren(
		blockId: string,
	): Promise<BlockObjectResponse[]> {
		const blocks: BlockObjectResponse[] = [];
		let cursor: string | undefined = undefined;

		while (true) {
			const resp = (await this.withNotionRetry(() =>
				// biome-ignore lint/suspicious/noExplicitAny: Notion client compatibility
				(this.client.blocks.children as any).list({
					block_id: blockId,
					start_cursor: cursor,
					page_size: 100,
				}),
			)) as any;

			// biome-ignore lint/suspicious/noExplicitAny: Notion block structure
			for (const r of resp.results ?? []) {
				// biome-ignore lint/suspicious/noExplicitAny: Notion client compatibility
				if (r && typeof r === "object" && (r as any).object === "block") {
					blocks.push(r as BlockObjectResponse);
				}
			}

			if (!resp.has_more || !resp.next_cursor) break;
			cursor = resp.next_cursor;
		}

		return blocks;
	}

	private async blocksToMarkdown(
		blocks: BlockObjectResponse[],
		depth: number = 0,
	): Promise<string> {
		const lines: string[] = [];
		const indent = "  ".repeat(depth);

		for (const block of blocks) {
			const type = block.type;

			// biome-ignore lint/suspicious/noExplicitAny: Notion property access
			const contentBlock = (block as any)[type];

			const text = contentBlock?.rich_text
				? this.richTextToMd(contentBlock.rich_text)
				: "";

			let line = "";
			switch (type) {
				case "paragraph":
					line = `${indent}${text}`;
					break;
				case "heading_1":
					line = `${indent}# ${text}`;
					break;
				case "heading_2":
					line = `${indent}## ${text}`;
					break;
				case "heading_3":
					line = `${indent}### ${text}`;
					break;
				case "bulleted_list_item":
					line = `${indent}- ${text}`;
					break;
				case "numbered_list_item":
					line = `${indent}1. ${text}`;
					break;
				case "to_do": {
					const checked = contentBlock?.checked ? "[x]" : "[ ]";
					line = `${indent}- ${checked} ${text}`;
					break;
				}
				case "toggle":
					line = `${indent}${text}`;
					break;
				case "quote":
					line = `${indent}> ${text}`;
					break;
				case "code":
					line = `${indent}\`\`\`\n${text}\n${indent}\`\`\``;
					break;
				default:
					// Ignore unsupported blocks for now
					line = "";
			}

			if (line.trim()) lines.push(line);

			// Recursively include children blocks if present
			if ("has_children" in block && block.has_children) {
				const children = await this.fetchAllBlockChildren(block.id);
				const childMd = await this.blocksToMarkdown(children, depth + 1);
				if (childMd.trim()) lines.push(childMd);
			}
		}

		return lines.join("\n\n");
	}

	private richTextToMd(richText: RichTextItemResponse[]): string {
		if (!richText) return "";
		return richText
			.map((t) => {
				let text = t.plain_text;
				if (t.annotations.bold) text = `**${text}**`;
				if (t.annotations.italic) text = `*${text}*`;
				if (t.annotations.code) text = `\`${text}\``;
				if (t.href) text = `[${text}](${t.href})`;
				return text;
			})
			.join("");
	}

	private async withNotionRetry<T>(fn: () => Promise<T>): Promise<T> {
		const maxAttempts = 5;
		let attempt = 0;
		let delayMs = 500;

		while (true) {
			try {
				return await fn();
			} catch (e: unknown) {
				attempt += 1;
				const error = e as { status?: number; statusCode?: number };
				const status = error?.status ?? error?.statusCode;
				const shouldRetry =
					attempt < maxAttempts &&
					(status === 429 || status === 500 || (status && status >= 500));
				if (!shouldRetry) throw e;
				await new Promise((r) => setTimeout(r, delayMs));
				delayMs *= 2;
			}
		}
	}
}

export const notionSync = new NotionSync();
