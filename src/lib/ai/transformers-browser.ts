/**
 * Transformers.js Browser ML Integration
 * God Mode 2.0 - Zero-cost browser-based ML
 *
 * Runs ML models directly in the browser using WebAssembly.
 * No server required, 100% privacy-preserving.
 */

import { env, pipeline } from "@xenova/transformers";

// Configure Transformers.js for browser environment
if (typeof window !== "undefined") {
	// Use CDN for model weights
	env.allowRemoteModels = true;
	env.allowLocalModels = false;
}

export type ImageClassificationResult = {
	label: string;
	score: number;
};

export type ObjectDetectionResult = {
	label: string;
	score: number;
	box: {
		xmin: number;
		ymin: number;
		xmax: number;
		ymax: number;
	};
};

/**
 * Browser ML Pipeline Manager
 * Handles model loading and caching
 */
class TransformersBrowser {
	private pipelines: Map<string, unknown> = new Map();
	private loadingPromises: Map<string, Promise<unknown>> = new Map();

	/**
	 * Get or create a pipeline
	 * Caches pipelines to avoid re-downloading
	 */
	async getPipeline(
		task: string,
		model: string,
		options?: Record<string, unknown>,
	): Promise<unknown> {
		const key = `${task}:${model}`;

		// Return cached pipeline if exists
		if (this.pipelines.has(key)) {
			return this.pipelines.get(key)!;
		}

		// Return in-progress loading promise if exists
		if (this.loadingPromises.has(key)) {
			return this.loadingPromises.get(key)!;
		}

		// Start loading pipeline
		const loadingPromise = pipeline(
			task as Parameters<typeof pipeline>[0],
			model,
			options,
		);
		this.loadingPromises.set(key, loadingPromise);

		try {
			const pipe = await loadingPromise;
			this.pipelines.set(key, pipe);
			this.loadingPromises.delete(key);
			return pipe;
		} catch (error) {
			this.loadingPromises.delete(key);
			throw error;
		}
	}

	/**
	 * Preload commonly used models
	 * Call this on app initialization for better UX
	 */
	async preloadModels(): Promise<void> {
		console.log("🔄 Preloading ML models...");

		const modelsToPreload = [
			{ task: "image-classification", model: "Xenova/vit-base-patch16-224" },
			{ task: "object-detection", model: "Xenova/detr-resnet-50" },
		];

		await Promise.all(
			modelsToPreload.map(({ task, model }) =>
				this.getPipeline(task, model, { quantized: true }),
			),
		);

		console.log("✅ Models preloaded successfully");
	}

	/**
	 * Clear cached models to free memory
	 */
	clearCache(): void {
		this.pipelines.clear();
		this.loadingPromises.clear();
		console.log("🗑️ Model cache cleared");
	}
}

// Singleton instance
const transformersBrowser = new TransformersBrowser();

/**
 * Image Classification
 * Classify image content
 */
export async function classifyImage(
	imageUrl: string,
	options?: { topk?: number },
): Promise<ImageClassificationResult[]> {
	const classifier = await transformersBrowser.getPipeline(
		"image-classification",
		"Xenova/vit-base-patch16-224",
		{ quantized: true },
	);

	const result = await (
		classifier as (
			input: string,
			options?: Record<string, unknown>,
		) => Promise<ImageClassificationResult[]>
	)(imageUrl, {
		topk: options?.topk || 5,
	});

	return result as ImageClassificationResult[];
}

/**
 * Object Detection
 * Detect objects and people in images
 */
export async function detectObjects(
	imageUrl: string,
	options?: { threshold?: number },
): Promise<ObjectDetectionResult[]> {
	const detector = await transformersBrowser.getPipeline(
		"object-detection",
		"Xenova/detr-resnet-50",
		{ quantized: true },
	);

	const result = await (
		detector as (
			input: string,
			options?: Record<string, unknown>,
		) => Promise<ObjectDetectionResult[]>
	)(imageUrl, {
		threshold: options?.threshold || 0.5,
	});

	return result as ObjectDetectionResult[];
}

/**
 * Count faces in image
 * Specifically detects people (proxying for faces)
 */
export async function countFaces(imageUrl: string): Promise<number> {
	const objects = await detectObjects(imageUrl, { threshold: 0.5 });
	const people = objects.filter((obj) => obj.label === "person");
	return people.length;
}

/**
 * Batch process multiple images
 * Useful for processing entire photo shoots
 */
export async function batchClassify(
	imageUrls: string[],
	onProgress?: (current: number, total: number) => void,
): Promise<ImageClassificationResult[][]> {
	const results: ImageClassificationResult[][] = [];

	for (let i = 0; i < imageUrls.length; i++) {
		const result = await classifyImage(imageUrls[i]);
		results.push(result);

		if (onProgress) {
			onProgress(i + 1, imageUrls.length);
		}
	}

	return results;
}

/**
 * Preload models for better initial performance
 */
export async function preloadModels(): Promise<void> {
	await transformersBrowser.preloadModels();
}

/**
 * Clear model cache to free memory
 */
export function clearModelCache(): void {
	transformersBrowser.clearCache();
}

/**
 * Check if browser supports WebAssembly (required for Transformers.js)
 */
export function isBrowserSupported(): boolean {
	try {
		if (
			typeof WebAssembly === "object" &&
			typeof WebAssembly.instantiate === "function"
		) {
			// Test instantiation
			const wasmModule = new WebAssembly.Module(
				Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00),
			);
			if (wasmModule instanceof WebAssembly.Module) {
				return (
					new WebAssembly.Instance(wasmModule) instanceof WebAssembly.Instance
				);
			}
		}
	} catch {
		return false;
	}
	return false;
}

/**
 * Get estimated model size for user feedback
 */
export function getModelSizes(): Record<string, string> {
	return {
		"vit-base-patch16-224": "~90MB (quantized)",
		"detr-resnet-50": "~160MB (quantized)",
	};
}

/**
 * Hook for React components
 * Example usage:
 *
 * const { classify, isLoading, error } = useImageClassification();
 * const result = await classify(imageUrl);
 */
export function useImageClassification() {
	// This would be a React hook in a real implementation
	// For now, just export the function
	return {
		classify: classifyImage,
		detectObjects,
		countFaces,
	};
}
