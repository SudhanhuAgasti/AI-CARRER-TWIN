const ai = require('../config/gemini');
const { retryWithBackoff } = require('../utils/retry');
const AtsReport = require('../models/atsReport.model');
const GithubReport = require('../models/githubReport.model');
const InterviewSession = require('../models/interviewSession.model');
const LinkedinReport = require('../models/linkedinReport.model');
const ReadinessDashboard = require('../models/readinessDashboard.model');

const DASHBOARD_SYNTHESIS_SCHEMA = {
  type: 'object',
  properties: {
    liveActionList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          priority: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Priority level based on potential impact.' },
          task: { type: 'string', description: 'Actionable checkbox item (e.g., "Add Redis caching projects to GitHub").' },
          category: { type: 'string', description: 'Category: Resume, GitHub, Interview, LinkedIn, or Skills.' },
          description: { type: 'string', description: 'Detailed guidance on how the candidate can achieve this improvement.' }
        },
        required: ['priority', 'task', 'category', 'description']
      }
    }
  },
  required: ['liveActionList']
};

/**
 * Compiles a unified readiness score and aggregates all diagnostic metrics.
 * Uses Gemini LLM to synthesize a consolidated list of actions.
 * 
 * @param {string} resumeId - Reference Resume ID
 * @param {string|null} githubUsername - Optional GitHub username to match
 * @returns {Promise<Object>} Compiled Readiness Dashboard details
 */
async function compileReadinessDashboard(resumeId, githubUsername = null) {
  // 1. Retrieve all related diagnostics
  const [atsReport, linkedinReport, latestInterview] = await Promise.all([
    AtsReport.findOne({ resumeId }).sort({ createdAt: -1 }).exec(),
    LinkedinReport.findOne({ resumeId }).sort({ createdAt: -1 }).exec(),
    InterviewSession.findOne({ resumeId, status: 'completed' }).sort({ createdAt: -1 }).exec(),
  ]);

  // Retrieve github report based on username, or fall back to the most recent report in database
  let githubReport = null;
  if (githubUsername) {
    githubReport = await GithubReport.findOne({ username: githubUsername.toLowerCase() }).sort({ createdAt: -1 }).exec();
  } else {
    githubReport = await GithubReport.findOne().sort({ createdAt: -1 }).exec();
  }

  // 2. Extract scores (default to 0 or null if not yet run/present)
  const atsScore = atsReport ? atsReport.overallScore : 0;
  const matchScore = atsReport ? (atsReport.similarityScore ? Math.round(atsReport.similarityScore * 100) : 0) : 0;
  const githubScore = githubReport ? githubReport.heuristics.overallScore : 0;
  const interviewScore = latestInterview ? (latestInterview.finalFeedback.overallScore || 0) : 0;
  const linkedinScore = linkedinReport ? linkedinReport.overallScore : 0;

  // 3. Compute weighted average
  // Weights: ATS (25%), Match (20%), GitHub (15%), Interview (25%), LinkedIn (15%)
  const weightedScore = Math.round(
    (atsScore * 0.25) +
    (matchScore * 0.20) +
    (githubScore * 0.15) +
    (interviewScore * 0.25) +
    (linkedinScore * 0.15)
  );

  // 4. Build text summaries of reports for LLM context synthesis
  let resumeGaps = 'No ATS analysis available.';
  if (atsReport) {
    const failedChecks = atsReport.checklistResults.filter(c => !c.passed).map(c => c.name).join(', ');
    resumeGaps = `ATS Score: ${atsScore}/100. Failed checks: [${failedChecks || 'none'}]. Match Score: ${matchScore}/100.`;
  }

  let githubGaps = 'No GitHub report available.';
  if (githubReport) {
    const failedChecks = githubReport.heuristics.checks.filter(c => !c.passed).map(c => c.name).join(', ');
    githubGaps = `GitHub Score: ${githubScore}/100. Areas for improvement: [${failedChecks || 'none'}].`;
  }

  let interviewGaps = 'No Interview history completed.';
  if (latestInterview && latestInterview.finalFeedback) {
    const improvements = (latestInterview.finalFeedback.improvements || []).join(', ');
    interviewGaps = `Interview Score: ${interviewScore}/100. Feedback: "${latestInterview.finalFeedback.generalFeedback}". Needed Improvements: [${improvements}].`;
  }

  let linkedinGaps = 'No LinkedIn report available.';
  if (linkedinReport) {
    const recommendations = (linkedinReport.recommendations || []).join(', ');
    linkedinGaps = `LinkedIn Score: ${linkedinScore}/100. Recommendations: [${recommendations}].`;
  }

  // 5. Synthesize Unified Action List
  const systemInstruction = `You are a Principal Engineering Career Coach.
Your task is to analyze evaluation reports across multiple dimensions (ATS Resume check, GitHub heuristics, mock interviews, LinkedIn profiles) and construct a prioritized, highly actionable list of steps (max 6 items) to help the candidate become 100% job-ready.
Group suggestions logically under Resume, GitHub, Interview, LinkedIn, or Skills.`;

  const prompt = `Review the compiled gaps across all evaluation modules:
- Resume & Match: ${resumeGaps}
- GitHub Heuristics: ${githubGaps}
- Mock Interview: ${interviewGaps}
- LinkedIn Profile: ${linkedinGaps}

Generate a structured live action checklist prioritizing high-impact fixes.`;

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: DASHBOARD_SYNTHESIS_SCHEMA,
        temperature: 0.3,
      },
    })
  );

  const synthesized = JSON.parse(response.text);

  // 6. Save or update Dashboard entry in Mongoose
  const dashboardDoc = await ReadinessDashboard.findOneAndUpdate(
    { resumeId },
    {
      resumeId,
      unifiedScore: weightedScore,
      breakdown: {
        atsScore,
        matchScore,
        githubScore,
        interviewScore,
        linkedinScore,
      },
      liveActionList: synthesized.liveActionList,
    },
    { new: true, upsert: true }
  ).exec();

  return dashboardDoc;
}

module.exports = {
  compileReadinessDashboard,
  DASHBOARD_SYNTHESIS_SCHEMA,
};
