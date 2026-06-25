const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');

const REPO_ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    techStack: {
      type: 'array',
      items: { type: 'string' },
      description: 'Specific frameworks, libraries, database engines, or infrastructure elements detected (e.g., Express, React, PostgreSQL, Docker).',
    },
    architecturePatterns: {
      type: 'array',
      items: { type: 'string' },
      description: 'Architectural paradigms detected in the project (e.g., MVC, Microservices, Clean Architecture, Serverless, Monolith).',
    },
    summary: {
      type: 'string',
      description: 'A 2-3 sentence technical summary explaining the main goal, complexity, and capabilities of the project.',
    },
  },
  required: ['techStack', 'architecturePatterns', 'summary'],
};

/**
 * Uses Gemini LLM to summarize a repository based on metadata and README content.
 * 
 * @param {Object} repo - Repository basic details (name, description, languages)
 * @param {string|null} readmeText - Raw README content of the repo
 * @returns {Promise<Object>} Analyzed project details
 */
async function summarizeRepository(repo, readmeText) {
  const languagesList = Object.keys(repo.languages || []).join(', ');
  const description = repo.description || 'No description provided';
  
  // Truncate README content to prevent context window overflow (e.g. ~6000 chars)
  const readmeSnippet = readmeText ? readmeText.slice(0, 6000) : 'No README file available.';

  const systemInstruction = `You are a Principal Software Architect.
Your task is to analyze a developer's GitHub repository based on its name, description, primary languages, and README file content.
Extract the technical stack, identify design and architecture patterns (e.g., MVC, Layered, Clean Architecture, Client-Server), and generate a clean, professional technical summary.
Do not invent details. If an architectural pattern is not clearly identifiable, leave the array empty.`;

  const prompt = `Repository Name: ${repo.name}
Description: ${description}
Primary Languages: ${languagesList}

README Content Snippet:
"""
${readmeSnippet}
"""`;

  try {
    const response = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: REPO_ANALYSIS_SCHEMA,
          temperature: 0.1,
        },
      })
    );

    const parsedResult = JSON.parse(response.text);

    return {
      name: repo.name,
      description: repo.description,
      languages: Object.keys(repo.languages || {}),
      techStack: parsedResult.techStack,
      architecturePatterns: parsedResult.architecturePatterns,
      summary: parsedResult.summary,
    };
  } catch (error) {
    console.error(`[GitHub Summarizer] LLM summary failed for repo '${repo.name}':`, error.message);
    
    // Graceful degradation fallback
    return {
      name: repo.name,
      description: repo.description,
      languages: Object.keys(repo.languages || {}),
      techStack: [],
      architecturePatterns: [],
      summary: 'Automated summarization failed due to processing error.',
    };
  }
}

module.exports = { summarizeRepository };
