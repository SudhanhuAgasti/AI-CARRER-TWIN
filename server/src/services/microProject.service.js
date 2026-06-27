const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');

const MICRO_PROJECT_SCHEMA = {
  type: 'object',
  properties: {
    projectName: { type: 'string', description: 'A catchy, professional title for the micro-project' },
    targetSkill: { type: 'string', description: 'The specific skill gap this project bridges' },
    projectBrief: { type: 'string', description: 'Real-world problem statement and engineering objective' },
    architectureSpecs: { 
      type: 'array', 
      items: { type: 'string' },
      description: 'Architectural rules, design patterns, and system components required'
    },
    folderStructure: { type: 'string', description: 'Clean directory tree representation for the repository' },
    prewrittenTestCases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          testName: { type: 'string' },
          description: { type: 'string' },
          expectedBehavior: { type: 'string' }
        },
        required: ['testName', 'description', 'expectedBehavior']
      },
      description: 'Automated test suite specifications the candidate must pass to prove mastery'
    },
    githubBoilerplateInstructions: {
      type: 'string',
      description: 'Markdown formatted instructions to initialize and push this project to GitHub'
    }
  },
  required: ['projectName', 'targetSkill', 'projectBrief', 'architectureSpecs', 'folderStructure', 'prewrittenTestCases', 'githubBoilerplateInstructions']
};

/**
 * Generates a production-grade micro-project specification tailored to a specific skill gap and target role.
 *
 * @param {string} skillGap - Target missing skill (e.g., Kafka, Redis, Docker, Microservices)
 * @param {string} targetRole - Candidate target job role (e.g., Senior Fullstack Engineer)
 * @returns {Promise<Object>} Micro-project specification JSON
 */
async function generateMicroProject(skillGap, targetRole = 'Software Engineer') {
  if (!skillGap || typeof skillGap !== 'string' || skillGap.trim().length === 0) {
    throw new Error('A valid skill gap string is required to generate a micro-project.');
  }

  const prompt = `Generate a hands-on, production-ready micro-project repository specification for a developer applying for a ${targetRole} position.
Target Skill Gap to Master: ${skillGap}.

Requirements:
- Create a realistic industry problem statement.
- Provide a clean folder structure and clear architecture specifications.
- List 3-4 automated test case specifications that verify the solution works.
- Provide step-by-step GitHub repository setup instructions.`;

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a Lead Staff Engineer and Senior Technical Mentor. You design hands-on micro-projects that mimic real-world production challenges to help developers build verified proof-of-work repositories.',
        responseMimeType: 'application/json',
        responseSchema: MICRO_PROJECT_SCHEMA,
        temperature: 0.3,
      },
    })
  );

  return JSON.parse(response.text);
}

module.exports = { generateMicroProject, MICRO_PROJECT_SCHEMA };
