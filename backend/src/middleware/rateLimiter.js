/**
 * In-Memory Sliding Window Rate Limiting Middleware
 * Developer: Disha (Backend Developer)
 * Sprint: Day 5 & 6 — Integration, Security & Production Hardening
 */

import { config } from '../config/env.js';

export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || config.rateLimitWindowMs || 60 * 1000; // 1 minute default
  const maxRequests = options.maxRequests || config.rateLimitMaxRequests || 120; // 120 requests/min default
  const message = options.message || 'Too many requests from this IP, please try again later.';
  const skipInTest = options.skipInTest ?? true;

  // Key: client IP -> Array of timestamps [t1, t2, ...]
  const ipRequests = new Map();

  // Periodic garbage collection every 2 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of ipRequests.entries()) {
      const validTimestamps = timestamps.filter((time) => now - time < windowMs);
      if (validTimestamps.length === 0) {
        ipRequests.delete(ip);
      } else {
        ipRequests.set(ip, validTimestamps);
      }
    }
  }, 2 * 60 * 1000);

  // Unref interval so it does not keep Node process alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return function rateLimiterMiddleware(req, res, next) {
    // Skip if running under test suite unless explicitly configured to test rate limiting
    if (skipInTest && config.nodeEnv === 'test' && !req.headers['x-test-rate-limit']) {
      return next();
    }

    // Resolve client IP (supporting reverse proxies)
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const timestamps = ipRequests.get(clientIp) || [];

    // Filter out timestamps outside current sliding window
    const windowStart = now - windowMs;
    const activeTimestamps = timestamps.filter((time) => time > windowStart);

    // Check limit
    if (activeTimestamps.length >= maxRequests) {
      const retryAfterSeconds = Math.ceil((activeTimestamps[0] + windowMs - now) / 1000);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil((windowStart + windowMs) / 1000));
      res.setHeader('Retry-After', retryAfterSeconds);

      return res.status(429).json({
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message,
          retryAfterSeconds
        },
        timestamp: new Date().toISOString()
      });
    }

    // Record request timestamp
    activeTimestamps.push(now);
    ipRequests.set(clientIp, activeTimestamps);

    const remaining = Math.max(0, maxRequests - activeTimestamps.length);
    const resetTime = Math.ceil((windowStart + windowMs) / 1000);

    // Set standard rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime);

    next();
  };
}

export const globalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 120
});

export const chatRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 45,
  message: 'Chat query limit reached. Please wait a moment before asking further questions.'
});
