/**
 * Centralized API Error Handling Middleware
 * Developer: Disha (Backend Developer)
 * Sprint: Day 5 & 6 — Integration, Security & Production Hardening
 */

export function errorHandler(err, req, res, next) {
  // Handle malformed JSON body from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON_BODY',
        message: 'Malformed JSON payload received in request body.'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Handle CORS policy rejection
  if (err.message && err.message.includes('not permitted by CORS policy')) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CORS_FORBIDDEN',
        message: err.message
      },
      timestamp: new Date().toISOString()
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || (statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR');
  const message = err.message || 'An unexpected error occurred';

  // Avoid noisy console output during unit testing
  if (statusCode >= 500 && process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${errorCode} (${statusCode}): ${message}`);
    if (err.stack && process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: err.details || null
    },
    timestamp: new Date().toISOString()
  });
}
