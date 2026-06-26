const { compileReadinessDashboard } = require('../services/dashboard.service');

/**
 * Controller handling Unified Readiness Dashboard request.
 * Compiles all diagnostic scores and builds a live prioritized action checklist.
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

    console.log(`[Dashboard Controller] Compiling dashboard for resume: ${resumeId}`);
    const dashboard = await compileReadinessDashboard(resumeId, githubUsername);

    res.json(dashboard);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
};
