import { createHash } from "crypto";
import { z } from "zod";
import { db } from "../firebase-admin";
import { uploadToGemini } from "./gemini-client";
import { ragMonitor } from "./monitor";
import { DocumentIndex } from "./types";

// Security Filters
const CONFIDENTIAL_REGEX = /\[CONFIDENTIAL\]/i;
const SYSTEM_FILE_EXTENSIONS = [".env", ".local", ".key", ".pem", ".secret"];

/**
 * Checks if a document passes security filters.
 * @param filename Filename
 * @param content Document content
 * @returns True if indexable
 */
export function isIndexable(filename: string, content: string): boolean {
	if (CONFIDENTIAL_REGEX.test(content)) return false;
	if (
		SYSTEM_FILE_EXTENSIONS.some(
			(ext) => filename.endsWith(ext) || filename.includes(ext),
		)
	)
		return false;
	// Specific exclusions
	if (filename.includes("node_modules")) return false;
	return true;
}

/**
 * Generates SHA-256 hash of content.
 * @param content Document content
 * @returns Hex string hash
 */
export function generateContentHash(content: string): string {
	return createHash("sha256").update(content).digest("hex");
}

/**
 * Processes a document for indexing.
 * @param filename File name
 * @param content Text content
 * @param contentType MIME type
 * @returns Indexing result
 */
export async function processDocument(
	filename: string,
	content: string,
	contentType: string = "text/plain",
): Promise<DocumentIndex | null> {
	if (!isIndexable(filename, content)) {
		console.log(`Skipping restricted file: ${filename}`);
		return null;
	}

	const hash = generateContentHash(content);

	// Check if hash exists (deduplication)
	try {
		const existingDocs = await db()
			.collection("rag_index")
			.where("contentHash", "==", hash)
			.limit(1)
			.get();
		if (!existingDocs.empty) {
			const docData = existingDocs.docs[0].data() as DocumentIndex;
			console.log(`Document already indexed: ${filename}`);
			return docData;
		}
	} catch (e) {
		console.warn("Index check failed", e);
	}

	// Upload to Gemini
	// We need a Buffer for uploadToGemini.
	const buffer = Buffer.from(content);
	const uri = await uploadToGemini(buffer, contentType, filename);

	// Create Metadata
	const indexEntry: DocumentIndex = {
		id: createHash("md5").update(filename).digest("hex"), // ID based on filename for uniqueness
		path: uri, // Storing URI as path for now
		filename,
		mimeType: contentType,
		contentHash: hash,
		indexedAt: new Date(),
		tokenCount: content.length / 4, // Approx estimation
	};

	// Store in Firestore
	try {
		await db().collection("rag_index").doc(indexEntry.id).set(indexEntry);
	} catch (e) {
		console.error("Failed to save index metadata", e);
		// We might still return entry as Gemini upload succeeded
	}

	// Track Metric
	ragMonitor.trackEvent({
		type: "indexing_input",
		tokens: indexEntry.tokenCount,
		success: true,
		metadata: { filename: indexEntry.filename },
	});

	return indexEntry;
}
