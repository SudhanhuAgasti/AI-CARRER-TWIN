/**
 * Executes an asynchronous function with automatic retries and exponential backoff.
 * Highly recommended for third-party network integrations (like LLM API calls).
 * 
 * DESIGN RATIONALE:
 * - Differentiates between transient errors (503 Service Unavailable, 429 Too Many Requests) and permanent errors (400 Bad Request, Authentication failed).
 * - Implements exponential backoff: delay doubles with every attempt (e.g., 500ms -> 1000ms -> 2000ms) to let downstream APIs recover.
 * 
 * @template T
 * @param {() => Promise<T>} fn - The async function to execute.
 * @param {number} maxRetries - Maximum retry attempts (default: 3).
 * @param {number} delay - Initial wait delay in milliseconds (default: 500ms).
 * @returns {Promise<T>}
 */
async function retryWithBackoff(fn, maxRetries = 3, delay = 500) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      // Determine if error is a transient API error (e.g., status 503, 429, or network timeout)
      const isTransient = 
        error.status === 503 || 
        error.status === 429 || 
        error.message?.includes('503') || 
        error.message?.includes('429') ||
        error.message?.includes('UNAVAILABLE') ||
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT';

      if (!isTransient || attempt >= maxRetries) {
        // If it is a bad request or we reached maximum retry limits, throw the error
        console.error(`[Retry Engine] Execution failed permanently on attempt ${attempt}. Error:`, error.message);
        throw error;
      }

      console.warn(`[Retry Engine] Transient error encountered (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms... Error: ${error.message}`);
      
      // Wait for the specified delay before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Double the wait time for the next attempt
    }
  }
}

module.exports = {
  retryWithBackoff,
};
