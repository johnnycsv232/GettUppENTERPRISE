import { createHash } from "crypto";
import { z } from "zod"; // Used for validation
import { db } from "../firebase-admin";
import { queryGeminiWithDocs } from "./gemini-client";
import { ragMonitor } from "./monitor";
import { CacheEntry, DocumentIndex, QueryResult } from "./types";

// Generate a cache key from the query string
export function generateQueryHash(query: string): string {
	const normalized = query.trim().toLowerCase();
	return createHash("sha256").update(normalized).digest("hex");
}

/**
 * Main RAG Query Engine.
 */
export class QueryEngine {
	private useCache: boolean;

	constructor(options: { useCache?: boolean } = {}) {
		this.useCache = options.useCache !== false;
	}

	/**
	 * Process a natural language query.
	 */
	async process(
		query: string,
		options: { limit?: number } = {},
	): Promise<QueryResult> {
		const startTime = Date.now();
		const queryHash = generateQueryHash(query);
		const limit = Math.min(10, Math.max(1, options.limit ?? 3));

		// 1. Check Cache
		if (this.useCache) {
			const cached = await this.getFromCache(queryHash);
			if (cached) {
				return {
					...cached.result,
					cached: true,
					responseTimeMs: Date.now() - startTime,
				};
			}
		}

		const result = await queryGeminiWithDocs(query);

		// 4. Cache Result
		if (this.useCache && !result.error && result.confidence > 0.7) {
			await this.saveToCache(queryHash, result);
		}

		const responseTimeMs = Date.now() - startTime;

		// Track Metric
		ragMonitor.trackEvent({
			type: "query",
			tokens: result.answer.length / 4, // Approx
			latencyMs: responseTimeMs,
			success: !result.error,
			metadata: { queryHash, cached: result.cached },
		});

		return {
			...result,
			responseTimeMs,
		};
	}

	private async getFromCache(hash: string): Promise<CacheEntry | null> {
		try {
			const doc = await db().collection("rag_cache").doc(hash).get();
			if (doc.exists) return doc.data() as CacheEntry;
		} catch (e) {
			console.warn("Cache read failed", e);
		}
		return null;
	}

	private async saveToCache(hash: string, result: QueryResult): Promise<void> {
		const entry: CacheEntry = {
			queryHash: hash,
			result,
			hitCount: 1,
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h TTL
		};
		try {
			await db().collection("rag_cache").doc(hash).set(entry);
		} catch (e) {
			console.warn("Cache write failed", e);
		}
	}

	private async getRecentIndexedDocuments(
		limit: number,
	): Promise<DocumentIndex[]> {
		try {
			const snap = await db()
				.collection("rag_index")
				.orderBy("indexedAt", "desc")
				.limit(limit)
				.get();

			return snap.docs.map((d) => d.data() as DocumentIndex);
		} catch (e) {
			console.warn("RAG index read failed", e);
			return [];
		}
	}
}

// Export singleton/instance
export const queryEngine = new QueryEngine();
