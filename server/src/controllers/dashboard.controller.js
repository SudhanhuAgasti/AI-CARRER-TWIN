const Resume = require('../models/resume.model');
const { compileReadinessDashboard, getCachedDashboard } = require('../services/dashboard.service');

/**
 * Controller handling Unified Readiness Dashboard request.
 * Fetches cached diagnostics if available to prevent expensive Gemini API calls.
 */
async function getDashboard(req, res, next) {
  try {
    const { resumeId } = req.params;
    const { githubUsername } = req.query;

    if (!resumeId) {
      const err = new Error('resumeId parameter is required.');
      err.status = 400;
      throw err;
    }

    // Guard: Verify that the associated resume exists
    const resume = await Resume.findById(resumeId).exec();
    if (!resume) {
      const err = new Error('Associated resume not found.');
      err.status = 404;
      throw err;
    }

    // Try to serve from database cache
    console.log(`[Dashboard Controller] Checking cache for resume: ${resumeId}`);
    let dashboard = await getCachedDashboard(resumeId);

    if (dashboard) {
      console.log(`[Dashboard Controller] Cache hit for resume: ${resumeId}`);
      return res.json({
        ...dashboard.toObject(),
        cached: true,
      });
    }

    // Cache miss: compile dashboard for the first time
    console.log(`[Dashboard Controller] Cache miss. Compiling dashboard using LLM synthesis...`);
    dashboard = await compileReadinessDashboard(resumeId, githubUsername);

    res.json({
      ...dashboard.toObject(),
      cached: false,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Force re-compiles the readiness dashboard using Gemini LLM synthesis.
 */
async function recompileDashboard(req, res, next) {
  try {
    const { resumeId } = req.params;
    const { githubUsername } = req.query;

    if (!resumeId) {
      const err = new Error('resumeId parameter is required.');
      err.status = 400;
      throw err;
    }

    // Guard: Verify that the associated resume exists
    const resume = await Resume.findById(resumeId).exec();
    if (!resume) {
      const err = new Error('Associated resume not found.');
      err.status = 404;
      throw err;
    }

    console.log(`[Dashboard Controller] Force recompiling dashboard using LLM synthesis for resume: ${resumeId}`);
    const dashboard = await compileReadinessDashboard(resumeId, githubUsername);

    res.json({
      ...dashboard.toObject(),
      cached: false,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  recompileDashboard,
};
