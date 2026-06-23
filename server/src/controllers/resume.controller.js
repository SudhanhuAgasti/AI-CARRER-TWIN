const { extractText } = require('../services/parser.service');
const { extractStructuredResume } = require('../services/extraction.service');
const { computeAtsScore } = require('../services/ats.service');
const { computeMatchScore } = require('../services/match.service');
const { saveResume, saveAtsReport } = require('../services/db.service');

/**
 * Controller handling POST /api/resume/analyze.
 * Flow: Text Extraction (OCR for images) -> Structured AI Extraction -> ATS Check Scorer -> Embedding Match -> DB Store
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.NextFunction} next 
 */
async function analyzeResume(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error('Resume file is required (field name: file). Supported: PDF, DOCX, PNG, JPEG');
      err.status = 400;
      throw err;
    }

    const jobDescription = req.body.jobDescription || '';

    // 1. Extract raw text from PDF/DOCX or Image (via OCR)
    const rawText = await extractText(req.file.buffer, req.file.mimetype);

    if (!rawText || rawText.trim().length < 50) {
      const err = new Error('Could not extract readable text from this file');
      err.status = 422;
      throw err;
    }

    // 2. Structured extraction via Gemini (skills, experience, education, contact info)
    const structuredResume = await extractStructuredResume(rawText);

    // 3. Deterministic ATS rules evaluation (formatting, sections, keyword presence)
    const atsResult = computeAtsScore(rawText, structuredResume, jobDescription);

    // 4. Semantic match score comparison vs job description (embeddings)
    let matchResult = null;
    if (jobDescription.trim().length > 20) {
      matchResult = await computeMatchScore(rawText, jobDescription);
    }

    // 5. Database Persistence Layer (Gracefully falls back if database is not connected/active)
    let resumeId = null;
    let reportId = null;
    try {
      resumeId = await saveResume(structuredResume, rawText);
      if (resumeId) {
        reportId = await saveAtsReport(resumeId, atsResult, jobDescription, matchResult);
      }
    } catch (dbErr) {
      console.warn('Database persistence failed, proceeding without database:', dbErr.message);
    }

    res.json({
      ids: {
        resumeId,
        reportId,
      },
      structuredResume,
      ats: atsResult,
      match: matchResult,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeResume };
