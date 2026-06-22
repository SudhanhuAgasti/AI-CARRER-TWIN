const { extractText } = require('../services/parser.service');
const { extractStructuredResume } = require('../services/extraction.service');
const { computeAtsScore } = require('../services/ats.service');
const { computeMatchScore } = require('../services/match.service');

async function analyzeResume(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error('Resume file is required (field name: file)');
      err.status = 400;
      throw err;
    }

    const jobDescription = req.body.jobDescription || '';

    // 1. Extract raw text from PDF/DOCX
    const rawText = await extractText(req.file.buffer, req.file.mimetype);

    if (!rawText || rawText.trim().length < 50) {
      const err = new Error('Could not extract readable text from this file');
      err.status = 422;
      throw err;
    }

    // 2. Structured extraction via OpenAI (skills, experience, education, contact)
    const structuredResume = await extractStructuredResume(rawText);

    // 3. Deterministic ATS rules score (formatting, sections, keyword presence)
    const atsResult = computeAtsScore(rawText, structuredResume, jobDescription);

    // 4. Semantic match score vs job description (embeddings, optional)
    let matchResult = null;
    if (jobDescription.trim().length > 20) {
      matchResult = await computeMatchScore(rawText, jobDescription);
    }

    res.json({
      structuredResume,
      ats: atsResult,
      match: matchResult,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeResume };
