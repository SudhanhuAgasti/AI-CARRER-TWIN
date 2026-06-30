const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generates vector embedding from text using Gemini.
 * Employs retry with backoff to prevent transient network blocks.
 * 
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
async function getEmbedding(text) {
  const response = await retryWithBackoff(() =>
    ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text.slice(0, 8000),
    })
  );
  return response.embeddings[0].values;
}

async function computeMatchScore(resumeText, jobDescription) {
  const [resumeEmbedding, jdEmbedding] = await Promise.all([
    getEmbedding(resumeText),
    getEmbedding(jobDescription),
  ]);

  const similarity = cosineSimilarity(resumeEmbedding, jdEmbedding);

  return {
    similarityScore: Math.round(similarity * 100),
    interpretation:
      similarity > 0.8 ? 'Strong match' : similarity > 0.6 ? 'Moderate match' : 'Weak match',
  };
}

module.exports = { computeMatchScore, cosineSimilarity, getEmbedding };