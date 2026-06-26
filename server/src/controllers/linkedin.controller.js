const LinkedinReport = require('../models/linkedinReport.model');
const Resume = require('../models/resume.model');
const { extractText } = require('../services/parser.service');
const { analyzeLinkedinProfile } = require('../services/linkedin.service');

/**
 * Controller handling LinkedIn Profile evaluation.
 * Accepts pasted text or uploaded PDF file exports.
 */
async function analyzeLinkedin(req, res, next) {
  try {
    const { resumeId, targetRole, profileText } = req.body;

    if (!resumeId) {
      const err = new Error('resumeId is required to associate the LinkedIn report.');
      err.status = 400;
      throw err;
    }

    // Verify associated resume exists
    const resume = await Resume.findById(resumeId).exec();
    if (!resume) {
      const err = new Error('Associated resume not found.');
      err.status = 404;
      throw err;
    }

    let rawProfileText = '';
    if (req.file) {
      console.log(`[LinkedIn Controller] Parsing uploaded file: ${req.file.originalname}`);
      rawProfileText = await extractText(req.file.buffer, req.file.mimetype);
    } else if (profileText && typeof profileText === 'string') {
      rawProfileText = profileText.trim();
    }

    if (!rawProfileText || rawProfileText.length < 20) {
      const err = new Error('Please provide profile text or upload a valid LinkedIn PDF profile export.');
      err.status = 400;
      throw err;
    }

    const role = targetRole || 'Software Engineer';
    console.log(`[LinkedIn Controller] Starting Gemini profiling for target role: ${role}`);

    const analysis = await analyzeLinkedinProfile(rawProfileText, role);

    // Save report to database (update if exists, otherwise create new)
    const report = await LinkedinReport.findOneAndUpdate(
      { resumeId },
      {
        resumeId,
        overallScore: analysis.overallScore,
        sectionsCheck: analysis.sectionsCheck,
        headlineCheck: analysis.headlineCheck,
        summaryCheck: analysis.summaryCheck,
        recommendations: analysis.recommendations,
      },
      { new: true, upsert: true }
    ).exec();

    res.json({
      reportId: report._id.toString(),
      resumeId: report.resumeId,
      overallScore: report.overallScore,
      sectionsCheck: report.sectionsCheck,
      headlineCheck: report.headlineCheck,
      summaryCheck: report.summaryCheck,
      recommendations: report.recommendations,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves LinkedIn report associated with a resume.
 */
async function getLinkedinReport(req, res, next) {
  try {
    const report = await LinkedinReport.findOne({ resumeId: req.params.resumeId }).exec();
    if (!report) {
      const err = new Error('LinkedIn report not found for this resume.');
      err.status = 404;
      throw err;
    }
    res.json(report);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  analyzeLinkedin,
  getLinkedinReport,
};
