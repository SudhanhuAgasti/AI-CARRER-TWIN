/**
 * @file copilot.controller.js
 * @description Controller handling AI Career Advancement and Negotiation Copilot endpoints.
 * @author Senior Fullstack Engineer (8+ years experience)
 */

const { generateElevatorPitch } = require('../services/elevatorPitch.service');
const { generateColdOutreach } = require('../services/outreachGenerator.service');

/**
 * Controller handling POST /api/copilot/elevator-pitch.
 * Generates structured 30s, 60s, and 2m spoken intro scripts for candidates.
 */
async function generateElevatorPitchController(req, res, next) {
  try {
    const { resumeData, targetRole, experienceLevel } = req.body;

    if (!resumeData || typeof resumeData !== 'object') {
      const err = new Error('structuredResume or resumeData object is required.');
      err.status = 400;
      throw err;
    }

    const pitchData = await generateElevatorPitch(
      resumeData,
      targetRole || 'Software Engineer',
      experienceLevel || 'senior'
    );

    res.json({
      success: true,
      elevatorPitch: pitchData,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller handling POST /api/copilot/outreach.
 * Generates personalized LinkedIn InMail and Cold Email messages for hiring managers.
 */
async function generateOutreachController(req, res, next) {
  try {
    const { candidateData, targetCompany, targetManagerRole } = req.body;

    if (!candidateData || typeof candidateData !== 'object') {
      const err = new Error('candidateData object is required.');
      err.status = 400;
      throw err;
    }

    const outreachData = await generateColdOutreach(
      candidateData,
      targetCompany || 'Target Company',
      targetManagerRole || 'Engineering Manager'
    );

    res.json({
      success: true,
      outreach: outreachData,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generateElevatorPitchController,
  generateOutreachController,
};

