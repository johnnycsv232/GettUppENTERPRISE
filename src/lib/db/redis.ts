import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Redis client for rate limiting
export const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL || "",
	token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
	redis: redis,
	limiter: Ratelimit.slidingWindow(10, "10 s"),
	analytics: true,
	prefix: "@upstash/ratelimit",
});

/**
 * Health check for Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
	try {
		const start = Date.now();
		await redis.set("health-check", "ok", { ex: 60 });
		const val = await redis.get("health-check");
		const end = Date.now();

		if (val === "ok") {
			console.log(`✅ Upstash Redis reachable (Latency: ${end - start}ms)`);
			return true;
		}
		return false;
	} catch (error) {
		console.error("❌ Upstash Redis health check failed:", error);
		return false;
	}
}
