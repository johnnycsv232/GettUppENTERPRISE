/**
 * @file rate-limiter.ts
 * @description Rate limiting for API endpoints with Redis/Upstash support
 * @module lib/security/rate-limiter
 *
 * IMPORTANT: In serverless environments (Vercel, Netlify), in-memory state is
 * ephemeral and resets on each function cold start. This module supports:
 *
 * 1. **Production (Upstash Redis)**: Persistent, distributed rate limiting
 *    Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars
 *
 * 2. **Development fallback**: In-memory rate limiting (not production-safe)
 *    Used when Redis env vars are not configured
 */

import { Redis } from "@upstash/redis";

interface RateLimitConfig {
	maxRequests: number;
	windowMs: number;
}

interface RateLimitResult {
	success: boolean;
	remaining: number;
	resetAt: Date;
}

// Lazy-initialize Redis client (only when env vars exist)
let redis: Redis | null = null;

function getRedis(): Redis | null {
	if (redis) return redis;

	const url = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;

	if (url && token) {
		redis = new Redis({ url, token });
		return redis;
	}

	return null;
}

// In-memory fallback store (for development only)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Default rate limit: 100 requests per minute
 */
const DEFAULT_CONFIG: RateLimitConfig = {
	maxRequests: 100,
	windowMs: 60 * 1000, // 1 minute
};

/**
 * Check if request is within rate limit using Redis (production)
 * Falls back to in-memory for development
 * @param identifier - IP address or user ID
 * @param config - Rate limit configuration
 */
export async function checkRateLimitAsync(
	identifier: string,
	config: RateLimitConfig = DEFAULT_CONFIG,
): Promise<RateLimitResult> {
	const redisClient = getRedis();

	if (redisClient) {
		return checkRateLimitRedis(redisClient, identifier, config);
	}

	// Fallback to in-memory (development only)
	console.warn(
		"[Rate Limiter] Using in-memory fallback - not safe for production serverless",
	);
	return checkRateLimitMemory(identifier, config);
}

/**
 * Synchronous rate limit check (uses memory, for backwards compatibility)
 * WARNING: Not effective in serverless - use checkRateLimitAsync when possible
 */
export function checkRateLimit(
	identifier: string,
	config: RateLimitConfig = DEFAULT_CONFIG,
): RateLimitResult {
	// Check if Redis is available - log warning if in production without it
	if (!getRedis() && process.env.NODE_ENV === "production") {
		console.warn(
			"[Rate Limiter] Redis not configured - rate limiting ineffective in serverless",
		);
	}

	return checkRateLimitMemory(identifier, config);
}

/**
 * Redis-based rate limiting (production)
 * Uses atomic INCR with TTL for distributed rate limiting
 */
async function checkRateLimitRedis(
	client: Redis,
	identifier: string,
	config: RateLimitConfig,
): Promise<RateLimitResult> {
	const key = `rate_limit:${identifier}`;
	const windowSeconds = Math.ceil(config.windowMs / 1000);
	const now = Date.now();

	try {
		// Atomic increment with TTL
		const count = await client.incr(key);

		// Set expiry only on first request (count === 1)
		if (count === 1) {
			await client.expire(key, windowSeconds);
		}

		// Get TTL for reset time
		const ttl = await client.ttl(key);
		const resetAt = new Date(now + (ttl > 0 ? ttl * 1000 : config.windowMs));

		if (count > config.maxRequests) {
			return {
				success: false,
				remaining: 0,
				resetAt,
			};
		}

		return {
			success: true,
			remaining: config.maxRequests - count,
			resetAt,
		};
	} catch (error) {
		console.error("[Rate Limiter] Redis error, falling back to allow:", error);
		// On Redis error, allow request but log for monitoring
		return {
			success: true,
			remaining: config.maxRequests,
			resetAt: new Date(now + config.windowMs),
		};
	}
}

/**
 * In-memory rate limiting (development fallback)
 * WARNING: Not effective in serverless environments
 */
function checkRateLimitMemory(
	identifier: string,
	config: RateLimitConfig,
): RateLimitResult {
	const now = Date.now();
	const record = memoryStore.get(identifier);

	// If no record or window expired, create new record
	if (!record || now > record.resetAt) {
		const resetAt = now + config.windowMs;
		memoryStore.set(identifier, { count: 1, resetAt });
		return {
			success: true,
			remaining: config.maxRequests - 1,
			resetAt: new Date(resetAt),
		};
	}

	// Increment count
	record.count += 1;

	// Check if over limit
	if (record.count > config.maxRequests) {
		return {
			success: false,
			remaining: 0,
			resetAt: new Date(record.resetAt),
		};
	}

	return {
		success: true,
		remaining: config.maxRequests - record.count,
		resetAt: new Date(record.resetAt),
	};
}

/**
 * Get client IP from request headers
 */
export function getClientIp(headers: Headers): string {
	return (
		headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		headers.get("x-real-ip") ||
		headers.get("cf-connecting-ip") || // Cloudflare
		"unknown"
	);
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
	api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100/min
	auth: { maxRequests: 10, windowMs: 60 * 1000 }, // 10/min (strict for auth)
	leads: { maxRequests: 5, windowMs: 60 * 1000 }, // 5/min (prevent spam)
	checkout: { maxRequests: 10, windowMs: 60 * 1000 }, // 10/min
	webhooks: { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000/min (high for Stripe)
	agents: { maxRequests: 50, windowMs: 60 * 1000 }, // 50/min
};

/**
 * Cleanup old entries in memory store (for development)
 */
export function cleanupRateLimiter(): void {
	const now = Date.now();
	for (const [key, record] of memoryStore.entries()) {
		if (now > record.resetAt) {
			memoryStore.delete(key);
		}
	}
}

// Cleanup every 5 minutes (development only)
if (
	typeof setInterval !== "undefined" &&
	process.env.NODE_ENV !== "production"
) {
	setInterval(cleanupRateLimiter, 5 * 60 * 1000);
}
