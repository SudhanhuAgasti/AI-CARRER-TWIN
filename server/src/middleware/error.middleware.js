function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Internal server error';

  // Detect Gemini API Quota Exceeded / Rate Limit errors
  if (message.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
    status = 429;
    try {
      // Check if message is a stringified JSON containing the Gemini API error
      const startIdx = message.indexOf('{');
      if (startIdx !== -1) {
        const jsonStr = message.substring(startIdx);
        const parsed = JSON.parse(jsonStr);
        if (parsed.error && (parsed.error.status === 'RESOURCE_EXHAUSTED' || parsed.error.code === 429)) {
          message = 'Gemini API Quota Exceeded. The free tier of Gemini 3.5 Flash has a limit of 20 requests per day. Please check your Settings page to add your own Gemini API Key or wait for the quota reset.';
        }
      }
    } catch (e) {
      // Fallback clean message
      message = 'Gemini API Quota Exceeded. You have exceeded your API usage limit. Please add a valid Gemini API Key in the Settings page or wait for the quota reset.';
    }
  }

  // Only log stack traces for actual server errors (500s) to keep logs clean of expected client errors (400, 404)
  if (status >= 500) {
    console.error('[Internal Error]:', err);
  } else {
    console.warn(`[Client Error] ${err.name || 'Error'} (${status}): ${message}`, err.details || '');
  }

  res.status(status).json({
    success: false,
    message: message,
    details: err.details || null,
  });
}

module.exports = { errorHandler };
