function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  
  // Only log stack traces for actual server errors (500s) to keep logs clean of expected client errors (400, 404)
  if (status >= 500) {
    console.error('[Internal Error]:', err);
  } else {
    console.warn(`[Client Error] ${err.name || 'Error'} (${status}): ${err.message}`, err.details || '');
  }

  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    details: err.details || null,
  });
}

module.exports = { errorHandler };
