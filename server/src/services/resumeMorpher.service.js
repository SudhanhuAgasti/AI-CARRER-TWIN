const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');

const MORPHED_RESUME_SCHEMA = {
  type: 'object',
  properties: {
    tailoredSummary: { 
      type: 'string', 
      description: 'A compelling professional summary tailored specifically to the target job description while remaining 100% truthful.' 
    },
    tailoredSkills: { 
      type: 'array', 
      items: { type: 'string' },
      description: 'Re-ordered and highlighted list of skills prioritized based on relevance to the target job description.'
    },
    tailoredExperience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          company: { type: 'string' },
          tailoredBullets: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Action-oriented, impact-driven bullet points aligning candidate real experience to the job description requirements.'
          },
          alignmentNotes: { 
            type: 'string',
            description: 'Brief explanation of how these achievements match key requirements in the job description.' 
          }
        },
        required: ['title', 'company', 'tailoredBullets', 'alignmentNotes']
      }
    },
    atsKeywordMatchHighlights: {
      type: 'array',
      items: { type: 'string' },
      description: 'Key terms and competencies successfully highlighted from the job description.'
    },
    atsAlignmentTips: {
      type: 'array',
      items: { type: 'string' },
      description: 'Actionable advice for the candidate to maximize their ATS pass rate for this role.'
    }
  },
  required: ['tailoredSummary', 'tailoredSkills', 'tailoredExperience', 'atsKeywordMatchHighlights', 'atsAlignmentTips']
};

/**
 * Tailors a candidate's resume data against a specific Job Description (JD).
 * Rewrites bullet points for maximum impact and ATS alignment without inventing facts.
 *
 * @param {Object} resumeData - Structured resume object containing skills, experience, and education
 * @param {string} jobDescription - Target job description text
 * @returns {Promise<Object>} Tailored resume breakdown and ATS alignment tips
 */
async function morphResume(resumeData, jobDescription) {
  if (!resumeData || typeof resumeData !== 'object') {
    throw new Error('Invalid resume data provided to Resume Morpher service.');
  }

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
    throw new Error('Target job description is required for resume tailoring.');
  }

  const promptContent = `
TARGET JOB DESCRIPTION:
---
${jobDescription}
---

CANDIDATE SOURCE RESUME DATA:
---
${JSON.stringify(resumeData, null, 2)}
---

Task: Re-align and tailor the candidate's professional summary, skills list, and experience bullet points to match the target job description.
CRITICAL MANDATE: Maintain 100% factual truthfulness. Do NOT invent new tools, metrics, job titles, or experience that are not in the candidate source resume data.
`;

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptContent,
      config: {
        systemInstruction:
          'You are an expert tech resume strategist and ATS optimization engine. Your goal is to rewrite and restructure candidate resume content to maximize relevance for target job descriptions using strong action verbs and quantified impact. Never fabricate experience or claim skills the candidate does not possess.',
        responseMimeType: 'application/json',
        responseSchema: MORPHED_RESUME_SCHEMA,
        temperature: 0.2,
      },
    })
  );

  return JSON.parse(response.text);
}

module.exports = { morphResume, MORPHED_RESUME_SCHEMA };
