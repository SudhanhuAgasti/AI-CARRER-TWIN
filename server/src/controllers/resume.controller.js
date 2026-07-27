const { extractText } = require('../services/parser.service');
const { extractStructuredResume } = require('../services/extraction.service');
const { computeAtsScore } = require('../services/ats.service');
const { computeMatchScore } = require('../services/match.service');
const { morphResume } = require('../services/resumeMorpher.service');
const { saveResume, saveAtsReport } = require('../services/db.service');
const { storeUserFile } = require('../utils/fileStorage');

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

    // Save original file to local disk (partitioned under uploads/<userId>/resumes/)
    let savedLocalPath = null;
    const userId = req.user?.id || req.user?._id;
    if (userId) {
      try {
        savedLocalPath = await storeUserFile(userId, req.file.buffer, req.file.originalname, 'resumes');
      } catch (storageErr) {
        console.error('[Resume Controller] Local file storage failed:', storageErr.message);
      }
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
      resumeId = await saveResume(structuredResume, rawText, savedLocalPath);
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

/**
 * Controller handling POST /api/resume/morph.
 * Tailors structured resume content against a specific job description.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.NextFunction} next 
 */
async function morphResumeController(req, res, next) {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData) {
      const err = new Error('structuredResume or resumeData object is required');
      err.status = 400;
      throw err;
    }

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      const err = new Error('jobDescription text string is required');
      err.status = 400;
      throw err;
    }

    const morphedOutput = await morphResume(resumeData, jobDescription);

    res.json({
      success: true,
      morphedResume: morphedOutput,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeResume, morphResumeController };

