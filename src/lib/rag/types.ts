import { z } from "zod";

// --- Interfaces ---

/** Source document attribution */
export interface DocumentSource {
	documentId: string;
	filename: string;
	sourceUrl?: string;
	snippet: string;
	relevanceScore: number;
}

/** Query result returned from RAG system */
export interface QueryResult {
	answer: string;
	sources: DocumentSource[];
	confidence: number;
	cached: boolean;
	responseTimeMs: number;
	error?: boolean; // Added based on context usage in Phase 11
}

/** Indexed document metadata */
export interface DocumentIndex {
	id: string;
	path: string; // "sourceUrl" in spec, but "path" is more generic for local files
	filename: string;
	/** Original MIME type used when uploading to Gemini */
	mimeType: string;
	contentHash: string;
	indexedAt: Date;
	tokenCount: number;
	tags?: string[];
}

/** Cache entry for FAQ responses */
export interface CacheEntry {
	queryHash: string;
	result: QueryResult;
	hitCount: number;
	createdAt: Date;
	expiresAt: Date;
}

// --- Zod Schemas ---

export const QueryRequestSchema = z.object({
	query: z.string().min(3).max(500),
	limit: z.number().int().min(1).max(10).optional().default(3),
});

export const DocumentMetadataSchema = z.object({
	filename: z.string(),
	contentType: z.string(),
	size: z.number().int().nonnegative(),
});

export const IndexRequestSchema = z.object({
	documentId: z.string().uuid().or(z.string()),
});

// Infer Zod types
export type QueryRequest = z.infer<typeof QueryRequestSchema>;
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;
export type IndexRequest = z.infer<typeof IndexRequestSchema>;
