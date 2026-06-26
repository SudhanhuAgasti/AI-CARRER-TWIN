const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');

const LINKEDIN_EVALUATION_SCHEMA = {
  type: 'object',
  properties: {
    overallScore: { type: 'number', description: 'Overall score from 0 to 100 assessing how complete, optimized and professional the profile is.' },
    sectionsCheck: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          section: { type: 'string', description: 'Section name (e.g. Headline, About, Experience, Skills)' },
          present: { type: 'boolean', description: 'True if section is present and contains content.' },
          qualityScore: { type: 'number', description: 'Score out of 10 for the content quality and SEO optimization.' },
          feedback: { type: 'string', description: 'Detailed feedback on how to improve this section.' }
        },
        required: ['section', 'present', 'qualityScore', 'feedback']
      }
    },
    headlineCheck: {
      type: 'object',
      properties: {
        currentHeadline: { type: 'string', description: 'The current headline found in the profile.' },
        strength: { type: 'string', description: 'Evaluation of headline strength (e.g. Weak, Good, Strong).' },
        suggestions: { type: 'array', items: { type: 'string' }, description: '2-3 concrete suggestions for headlines optimized for the target role.' }
      },
      required: ['currentHeadline', 'strength', 'suggestions']
    },
    summaryCheck: {
      type: 'object',
      properties: {
        qualityScore: { type: 'number', description: 'Score out of 10.' },
        analysis: { type: 'string', description: 'Detailed analysis of the About/Summary section.' },
        missingKeywords: { type: 'array', items: { type: 'string' }, description: 'Target industry or role-specific keywords that should be added.' }
      },
      required: ['qualityScore', 'analysis', 'missingKeywords']
    },
    recommendations: {
      type: 'array',
      items: { type: 'string' },
      description: '3-5 key actionable recommendation bullet points.'
    }
  },
  required: ['overallScore', 'sectionsCheck', 'headlineCheck', 'summaryCheck', 'recommendations']
};

/**
 * Analyzes unstructured LinkedIn profile text against target role requirements.
 * 
 * @param {string} profileText - Plain text parsed from LinkedIn profile PDF or pasted directly
 * @param {string} targetRole - Target role (e.g. Frontend Engineer, SDE-2)
 * @returns {Promise<Object>} Structured LinkedIn analysis report
 */
async function analyzeLinkedinProfile(profileText, targetRole) {
  if (!profileText || profileText.trim().length === 0) {
    throw new Error('Profile text content cannot be empty.');
  }

  const systemInstruction = `You are a professional LinkedIn Profile Evaluator and Tech Recruiter.
Analyze the candidate's LinkedIn profile details and evaluate its completeness, keyword density, SEO index optimization for search visibility, headline strength, and summary impact.
Target Career Role: ${targetRole || 'Software Engineer'}`;

  const prompt = `Review the LinkedIn profile content below:
"""
${profileText}
"""
Provide structured, thorough feedback and scoring matching the requested JSON schema constraints.`;

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: LINKEDIN_EVALUATION_SCHEMA,
        temperature: 0.2,
      },
    })
  );

  return JSON.parse(response.text);
}

module.exports = {
  analyzeLinkedinProfile,
  LINKEDIN_EVALUATION_SCHEMA,
};
