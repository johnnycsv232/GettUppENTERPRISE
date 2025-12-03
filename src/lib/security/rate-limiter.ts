/**
 * @file rate-limiter.ts
 * @description Rate limiting for API endpoints
 * @module lib/security/rate-limiter
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
}

// In-memory store (replace with Redis/Vercel KV in production)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Default rate limit: 100 requests per minute
 */
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
};

/**
 * Check if request is within rate limit
 * @param identifier - IP address or user ID
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  // If no record or window expired, create new record
  if (!record || now > record.resetAt) {
    const resetAt = now + config.windowMs;
    requestCounts.set(identifier, { count: 1, resetAt });
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
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  api: { maxRequests: 100, windowMs: 60 * 1000 },      // 100/min
  auth: { maxRequests: 10, windowMs: 60 * 1000 },     // 10/min (strict for auth)
  webhooks: { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000/min (high for webhooks)
  agents: { maxRequests: 50, windowMs: 60 * 1000 },   // 50/min
};

/**
 * Cleanup old entries (call periodically)
 */
export function cleanupRateLimiter(): void {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetAt) {
      requestCounts.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimiter, 5 * 60 * 1000);
}
