import fc from "fast-check";
import { db } from "../../firebase-admin";
import { ragMonitor } from "../monitor";

// Mock DB
jest.mock("../../firebase-admin", () => ({
	db: jest.fn().mockReturnValue({
		collection: jest.fn().mockReturnValue({
			add: jest.fn(),
		}),
	}),
}));

describe("RAG Monitoring Properties", () => {
	it("Property 10.1: Usage Monitoring Accuracy - tracks events correctly", async () => {
		await fc.assert(
			fc.asyncProperty(
				fc.integer({ min: 0, max: 10000 }), // tokens
				fc.integer({ min: 0, max: 10000 }), // latency
				async (tokens, latency) => {
					const mockAdd = jest.fn();
					(db as jest.Mock).mockReturnValue({
						collection: jest.fn().mockReturnValue({
							add: mockAdd,
						}),
					});

					await ragMonitor.trackEvent({
						type: "query",
						tokens,
						latencyMs: latency,
						success: true,
					});

					expect(mockAdd).toHaveBeenCalledWith(
						expect.objectContaining({
							type: "query",
							tokens,
							latencyMs: latency,
						}),
					);
					mockAdd.mockClear();
				},
			),
		);
	});

	it("Property 10.2: Alert System - detects failures", async () => {
		const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

		await ragMonitor.trackEvent({
			type: "query",
			tokens: 100,
			success: false, // Should trigger alert
			metadata: { error: "Simulated failure" },
		});

		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining("Alert"),
			expect.anything(),
		);
		consoleSpy.mockRestore();
	});
});
