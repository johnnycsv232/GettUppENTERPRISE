/**
 * Retries a function with exponential backoff.
 * @param fn Function to retry
 * @param maxAttempts Maximum number of attempts
 * @param baseDelayMs Base delay in milliseconds
 * @returns Result of the function
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	maxAttempts = 3,
	baseDelayMs = 1000,
): Promise<T> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			if (attempt === maxAttempts) break;

			const delay = baseDelayMs * Math.pow(2, attempt - 1);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}
