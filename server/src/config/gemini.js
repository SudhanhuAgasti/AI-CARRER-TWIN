const { GoogleGenAI } = require('@google/genai');
const { AsyncLocalStorage } = require('async_hooks');

const geminiApiKeyStore = new AsyncLocalStorage();

// Standard fallback instance using the default environment variable
let defaultAi = null;
try {
  if (process.env.GEMINI_API_KEY) {
    defaultAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (err) {
  console.warn('[Gemini Init] Failed to initialize default GoogleGenAI instance:', err.message);
}

/**
 * Proxy handler that resolves the correct GoogleGenAI instance at invocation time
 * by checking if a user-supplied API key is present in the AsyncLocalStorage store.
 * 
 * Also intercepts the 'models' namespace to transparently map deprecated 'gemini-2.5-flash'
 * calls to the supported 'gemini-1.5-flash' model to prevent 404 API deprecation errors.
 */
const aiProxy = new Proxy({}, {
  get(target, prop) {
    // Resolve the active GoogleGenAI instance for the current execution context
    const customKey = geminiApiKeyStore.getStore();
    let activeInstance = defaultAi;

    if (customKey) {
      try {
        activeInstance = new GoogleGenAI({ apiKey: customKey });
      } catch (err) {
        console.error('[Gemini Proxy] Failed to construct dynamic client with custom key:', err.message);
      }
    }

    if (!activeInstance) {
      throw new Error(
        'Gemini API key is not configured. Please supply a valid GEMINI_API_KEY in the environment or paste one in the settings panel.'
      );
    }

    if (prop === 'models') {
      const originalModels = Reflect.get(activeInstance, prop);
      return new Proxy(originalModels, {
        get(modelsTarget, modelsProp) {
          const val = Reflect.get(modelsTarget, modelsProp);
          if (typeof val === 'function') {
            return function(options, ...args) {
              // Intercept options object to map deprecated model names
              if (options && typeof options === 'object' && options.model === 'gemini-2.5-flash') {
                options.model = 'gemini-1.5-flash';
              }
              return val.call(modelsTarget, options, ...args);
            };
          }
          return val;
        }
      });
    }

    return Reflect.get(activeInstance, prop);
  }
});

module.exports = aiProxy;
module.exports.geminiApiKeyStore = geminiApiKeyStore;
