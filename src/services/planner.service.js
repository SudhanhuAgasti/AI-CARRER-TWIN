const ai = require('../config/gemini');
const { extractSkillGaps } = require('./taxonomy.service');
const { retryWithBackoff } = require('../utils/retry');

const ROADMAP_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    estimatedWeeks: { type: 'number' },
    weeks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          weekNumber: { type: 'number' },
          theme: { type: 'string' },
          topics: { type: 'array', items: { type: 'string' } },
          estimatedHours: { type: 'number' },
          practicalTask: { type: 'string' },
          learningResources: { type: 'array', items: { type: 'string' } }
        },
        required: ['weekNumber', 'theme', 'topics', 'practicalTask'],
      },
    },
  },
  required: ['summary', 'estimatedWeeks', 'weeks'],
};

/**
 * Executes the state-driven LangGraph-style pipeline nodes.
 * @param {Object} inputState 
 * @returns {Promise<Object>} Final state containing the roadmap
 */
async function generateRoadmap(inputState) {
  const { resumeSkills, targetRole, availableHoursPerDay = 2 } = inputState;

  // Node 1: Gap Analysis Node
  const gapsInfo = extractSkillGaps(resumeSkills, targetRole);
  const skillGaps = gapsInfo.totalGaps;

  if (skillGaps.length === 0) {
    return {
      targetRole: gapsInfo.roleTitle,
      skillGaps: [],
      roadmap: {
        summary: `Congratulations! Your current profile matches the taxonomy requirements for ${gapsInfo.roleTitle}. No core or preferred gaps detected.`,
        estimatedWeeks: 0,
        weeks: []
      }
    };
  }

  // Node 2: Curriculum Planner Node (LLM node)
  const systemInstruction = `You are a Senior Technical Curriculum Planner. 
Your goal is to generate a highly detailed, week-by-week learning roadmap for a developer to bridge specific skill gaps.
You must fit the planning constraint: the candidate has exactly ${availableHoursPerDay} hours per day to study.
Focus the roadmap modules strictly on the missing gaps listed: ${skillGaps.join(', ')}.
Each week must have a clear practical task/project milestone and reference study concepts. Do not invent details outside of requested gaps unless necessary as prerequisite foundational knowledge.`;

  const prompt = `Generate a learning curriculum for the target role: ${gapsInfo.roleTitle}.
My current gaps are: ${skillGaps.join(', ')}.
My available time is: ${availableHoursPerDay} hours per day (${availableHoursPerDay * 7} hours per week).`;

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: ROADMAP_SCHEMA,
        temperature: 0.2,
      },
    })
  );

  const roadmap = JSON.parse(response.text);

  // Node 3: Validation Node (Heuristics check on the LLM output)
  const validationErrors = [];
  const hoursPerWeek = availableHoursPerDay * 7;
  
  for (const week of roadmap.weeks) {
    if (week.estimatedHours > hoursPerWeek) {
      validationErrors.push(`Week ${week.weekNumber} estimated hours (${week.estimatedHours}h) exceeds user's weekly limit of ${hoursPerWeek}h.`);
    }
  }

  return {
    targetRole: gapsInfo.roleTitle,
    requiredGaps: gapsInfo.requiredGaps,
    preferredGaps: gapsInfo.preferredGaps,
    skillGaps,
    roadmap,
    validationErrors: validationErrors.length > 0 ? validationErrors : null,
  };
}

module.exports = {
  generateRoadmap,
  ROADMAP_SCHEMA,
};
