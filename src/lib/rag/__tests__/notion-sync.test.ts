import fc from "fast-check";
import { processDocument } from "../document-indexer";
import { notionSync } from "../notion-sync";

// Mock dependencies
jest.mock("@notionhq/client", () => {
	return {
		Client: jest.fn().mockImplementation(() => ({
			search: jest.fn().mockResolvedValue({
				results: [],
				has_more: false,
				next_cursor: null,
			}),
			pages: {
				retrieve: jest.fn().mockResolvedValue({
					id: "page-123",
					url: "https://notion.so/page-123",
					properties: {
						Name: {
							title: [{ plain_text: "Test Page" }],
						},
					},
				}),
			},
			blocks: {
				children: {
					list: jest.fn().mockResolvedValue({
						results: [
							{
								object: "block",
								id: "block-1",
								type: "paragraph",
								paragraph: {
									rich_text: [{ plain_text: "Content", annotations: {} }],
								},
							},
						],
						has_more: false,
						next_cursor: null,
					}),
				},
			},
		})),
	};
});

jest.mock("../document-indexer", () => ({
	processDocument: jest.fn().mockResolvedValue({
		id: "doc-123",
		filename: "notion_page-123.md",
	}),
}));

describe("Notion Sync Properties", () => {
	it("Property 9.1: Service Integration Correctness - syncs page to indexer", async () => {
		// We verify that for any valid pageId, the system calls processDocument with expected structure
		await fc.assert(
			fc.asyncProperty(fc.uuid(), async (pageId) => {
				await notionSync.syncPage(pageId);

				expect(processDocument).toHaveBeenCalledWith(
					expect.stringContaining(pageId), // Filename should contain ID
					expect.stringContaining("Source: https://notion.so/page-123"), // Content should contain source attribution
					"text/markdown",
				);

				// Reset mocks between runs if needed, but fast-check runs might be parallel?
				// Jest mocks accumulate calls. We just check "toHaveBeenCalledWith" for the current call or generally.
				// In fc runner, easier to just check mostly correctness or clear mocks.
				(processDocument as jest.Mock).mockClear();
			}),
			{ numRuns: 10 }, // Unit test level check, don't need 100 for this mock interaction
		);
	});

	it("syncAllAccessiblePages indexes all discovered pages", async () => {
		(processDocument as jest.Mock).mockClear();

		// Configure the existing mocked client instance used by notionSync
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { Client } = require("@notionhq/client");
		const client = (Client as jest.Mock).mock.results?.[0]?.value;
		expect(client).toBeTruthy();
		client.search.mockResolvedValueOnce({
			results: [
				{ object: "page", id: "page-a" },
				{ object: "page", id: "page-b" },
			],
			has_more: false,
			next_cursor: null,
		});

		const result = await notionSync.syncAllAccessiblePages({
			maxPages: 10,
			pageSize: 2,
		});

		expect(result.pagesDiscovered).toBe(2);
		expect(processDocument).toHaveBeenCalledTimes(2);
		expect(processDocument).toHaveBeenCalledWith(
			expect.stringContaining("page-a"),
			expect.any(String),
			"text/markdown",
		);
		expect(processDocument).toHaveBeenCalledWith(
			expect.stringContaining("page-b"),
			expect.any(String),
			"text/markdown",
		);
	});
});
