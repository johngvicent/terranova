/**
 * Simple in-memory rate limiter.
 * For production at scale, replace with Upstash Redis (@upstash/ratelimit).
 *
 * Usage:
 *   const limiter = createRateLimiter({ maxRequests: 10, windowMs: 60_000 });
 *   if (!limiter.check(ip)) return Response.json({ error: "Too many requests" }, { status: 429 });
 */

const stores = new Map();

export function createRateLimiter({ maxRequests = 10, windowMs = 60_000 } = {}) {
  // Each limiter gets its own store so different routes can have different limits
  const store = new Map();
  stores.set(Symbol(), store);

  return {
    check(key) {
      const now = Date.now();
      const record = store.get(key);

      if (!record || now - record.start > windowMs) {
        store.set(key, { start: now, count: 1 });
        return true;
      }

      if (record.count >= maxRequests) {
        return false;
      }

      record.count++;
      return true;
    },
  };
}

// Pre-configured limiters
export const formLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 5 submissions per 15 min
});

export const webhookLimiter = createRateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 100 per minute
});

export const apiLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000, // 30 per minute
});
