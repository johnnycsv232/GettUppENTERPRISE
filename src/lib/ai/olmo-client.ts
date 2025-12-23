/**
 * Olmo 7B Client (Self-Hosted RAG Fallback)
 * God Mode 2.0 - Offline/Private AI
 *
 * Connects to a local/self-hosted LLM service (like Ollama or Jan.ai)
 * running Olmo 7B or similar open models.
 */

export interface CompletionOptions {
	prompt: string;
	maxTokens?: number;
	temperature?: number;
}

const LOCAL_LLM_ENDPOINT =
	process.env.LOCAL_LLM_URL || "http://127.0.0.1:11434/api/generate";

export async function completeWithOlmo(
	options: CompletionOptions,
): Promise<string> {
	try {
		const response = await fetch(LOCAL_LLM_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: "olmo:7b", // or "llama3"
				prompt: options.prompt,
				stream: false,
				options: {
					num_predict: options.maxTokens || 512,
					temperature: options.temperature || 0.7,
				},
			}),
		});

		if (!response.ok) {
			throw new Error(`Self-hosted LLM error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.warn(
			"⚠️ Local Olmo/LLM unreachable. Falling back to simple logic.",
			error,
		);
		return "AI offline. Please connect to internet or start local inference server.";
	}
}
