import { config } from '../config/env.js';

/**
 * Request timeout middleware
 * Protects against stalled upstream API calls or unhandled hanging promises
 */
export function createTimeoutMiddleware(timeoutMs = config.requestTimeoutMs || 20000) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: {
            code: 'REQUEST_TIMEOUT',
            message: `Request timed out after ${timeoutMs}ms. Please try again.`
          },
          timestamp: new Date().toISOString()
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
  };
}
