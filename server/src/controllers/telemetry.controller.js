/**
 * @file telemetry.controller.js
 * @description Controller for parsing and handling Job Market Telemetry endpoints.
 * @author Senior Fullstack Engineer (10+ years experience)
 */

const { calculateMarketDrift } = require('../services/telemetry.service');

/**
 * Controller handling POST /api/telemetry/analyze.
 * Computes semantic drift telemetry between candidate resume and live target job market listings.
 */
async function analyzeTelemetryController(req, res, next) {
  try {
    const { resumeText, liveMarketJobs } = req.body;

    const telemetryReport = await calculateMarketDrift(resumeText, liveMarketJobs);

    res.json({
      success: true,
      telemetry: telemetryReport,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  analyzeTelemetryController,
};
