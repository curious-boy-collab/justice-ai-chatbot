export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR');
  const message = err.message || 'An unexpected error occurred';

  console.error(`[Error] ${errorCode} (${statusCode}): ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
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
