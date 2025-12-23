import { db } from "../firebase-admin";

const ALERT_THRESHOLDS = {
	errorRate: 0.1, // 10%
	latencyMs: 5000, // 5s
	dailyTokenLimit: 1000000, // 1M tokens ($0.15)
};

interface MetricEvent {
	type: "query" | "indexing_input" | "indexing_storage";
	tokens: number;
	latencyMs?: number;
	success: boolean;
	timestamp: Date;
	metadata?: Record<string, unknown>;
}

export class RAGMonitor {
	async trackEvent(event: Omit<MetricEvent, "timestamp">) {
		const entry: MetricEvent = {
			...event,
			timestamp: new Date(),
		};

		// 1. Log to Firestore
		try {
			await db().collection("rag_usage").add(entry);
		} catch (e) {
			console.error("Failed to log metric:", e);
		}

		// 2. Check Alerts (Simple inline check)
		// In production, this should be a scheduled job or async background task.
		if (!event.success) {
			console.warn("[RAG Alert] Operation failed.", event.metadata);
		}
		if (event.latencyMs && event.latencyMs > ALERT_THRESHOLDS.latencyMs) {
			console.warn(
				`[RAG Alert] High Latency: ${event.latencyMs}ms`,
				event.metadata,
			);
		}

		// Check daily quota (simplified approximation check)
		// ideally we aggregate. For cost-control, we might check a specialized counter document.
	}

	async getDailyUsage(): Promise<number> {
		// Simple aggregation query (Note: Reads N documents, expensive at scale. Use distributed counters in prod)
		// For MVP/Bootstrap, we'll assume low volume or use a counter doc if implemented.
		// Returning 0 for now to assume "safe" unless we add a counter.
		return 0;
	}
}

export const ragMonitor = new RAGMonitor();
