import { GoogleGenAI } from "@google/genai";
import { QueryResult } from "./types";
import { retryWithBackoff } from "./utils";

// Configs
const MODEL_NAME = "gemini-2.0-flash";
const STORE_DISPLAY_NAME = "GettUpp Enterprise Docs";
let storeName: string | null = null;

// Initialize Client Lazily
let genAIInstance: GoogleGenAI | null = null;
function getGenAI() {
	if (genAIInstance) return genAIInstance;
	const key = process.env.GEMINI_API_KEY;
	if (!key) {
		console.warn("GEMINI_API_KEY is not set. RAG features will fail.");
	}
	genAIInstance = new GoogleGenAI({ apiKey: key || "" });
	return genAIInstance;
}

/**
 * Gets or creates the File Search Store.
 */
async function getOrCreateStore() {
	if (storeName) return storeName;

	try {
		const stores = await getGenAI().fileSearchStores.list();

		// biome-ignore lint/suspicious/noExplicitAny: SDK store response
		const existing = (stores as any).fileSearchStores?.find(
			(s: any) => s.displayName === STORE_DISPLAY_NAME,
		);
		if (existing) {
			storeName = existing.name || null;
			return storeName;
		}

		const store = await getGenAI().fileSearchStores.create({
			config: { displayName: STORE_DISPLAY_NAME },
		});
		storeName = store.name;
		return storeName;
	} catch (error) {
		console.error("Failed to manage FileSearchStore:", error);
		throw error;
	}
}

/**
 * Uploads a file to Gemini File Search Store.
 * @param buffer File buffer
 * @param mimeType MIME type of the file
 * @param displayName Display name for the file
 */
export async function uploadToGemini(
	buffer: Buffer,
	mimeType: string,
	displayName: string,
): Promise<string> {
	if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

	const fs = await import("fs/promises");
	const path = await import("path");
	const os = await import("os");

	const tempDir = os.tmpdir();
	const tempPath = path.join(tempDir, `rag-${Date.now()}-${displayName}`);

	try {
		await fs.writeFile(tempPath, buffer);

		const store = await getOrCreateStore();

		// biome-ignore lint/suspicious/noExplicitAny: SDK method call
		const operation = await (getGenAI().fileSearchStores as any).upload({
			fileSearchStoreName: store,
			file: tempPath,
			config: { displayName },
		});

		let op = operation;
		while (!op.done) {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			// biome-ignore lint/suspicious/noExplicitAny: SDK operation polling
			op = await getGenAI().operations.get({ operation: op as any });
		}

		return op.response?.name || displayName;
	} finally {
		// Cleanup
		try {
			const fs = await import("fs/promises");
			await fs.unlink(tempPath);
		} catch {
			// Ignore cleanup errors
		}
	}
}

/**
 * Queries Gemini using the managed File Search store.
 */
export async function queryGeminiWithDocs(
	query: string,
): Promise<QueryResult> {
	const startTime = Date.now();
	if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

	try {
		const store = await getOrCreateStore();

		const result = await retryWithBackoff(async () => {
			return await getGenAI().models.generateContent({
				model: MODEL_NAME,
				contents: [{ role: "user", parts: [{ text: query }] }],
				config: {
					tools: [
						{
							// biome-ignore lint/suspicious/noExplicitAny: SDK tool config
							fileSearch: {
								fileSearchStoreNames: [store],
							},
						},
					],
				},
			} as any);
		});

		const response = result;

		// biome-ignore lint/suspicious/noExplicitAny: SDK response
		const text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text ||
			(response as any).text ||
			"No response generated.";

		return {
			answer: text,
			sources: [],
			confidence: 1.0,
			cached: false,
			responseTimeMs: Date.now() - startTime,
		};
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Error processing query with Gemini File Search.";
		console.error("Gemini File Search Error:", error);
		return {
			answer: errorMessage,
			sources: [],
			confidence: 0,
			cached: false,
			responseTimeMs: Date.now() - startTime,
			error: true,
		};
	}
}
