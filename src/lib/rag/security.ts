/**
 * Sanitizes input text for indexing, removing sensitive patterns.
 * @param input Raw text
 * @returns Sanitized text
 */
export function sanitizeForIndex(input: string): string {
	// Placeholder implementation - Phase 3 will add robust regex
	// Basic PII stripping (simulated)
	return input
		.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]")
		.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]");
}

/**
 * Checks if text contains PII.
 * @param input Text to check
 * @returns True if PII detected
 */
export function containsPII(input: string): boolean {
	// Placeholder - Phase 3 will expand this
	const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/;
	const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
	return ssnRegex.test(input) || emailRegex.test(input);
}
