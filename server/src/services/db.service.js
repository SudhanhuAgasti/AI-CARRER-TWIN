const Resume = require('../models/resume.model');
const AtsReport = require('../models/atsReport.model');
const Roadmap = require('../models/roadmap.model');
const GithubReport = require('../models/githubReport.model');
const { connectionState } = require('../config/db');

/**
 * Persists a parsed structured resume into MongoDB using Resume Mongoose Model.
 * Handles fallbacks gracefully if the database is not configured.
 * 
 * @param {Object} structured - Extracted structured resume fields.
 * @param {string} rawText - Unstructured raw text from PDF/Word/Image.
 * @returns {Promise<string|null>} Created resume ObjectId string (or null if DB not active)
 */
async function saveResume(structured, rawText, filePath = null) {
  try {
    if (!connectionState.isConnected) {
      console.warn('[DB Service] Mongoose connection not active. Skipping resume save.');
      return null;
    }

    const resumeDoc = new Resume({
      name: structured.name,
      email: structured.email,
      phone: structured.phone,
      totalYearsExperience: structured.totalYearsExperience,
      skills: structured.skills,
      experience: structured.experience,
      education: structured.education,
      certifications: structured.certifications,
      rawText: rawText,
      filePath: filePath,
    });

    const saved = await resumeDoc.save();
    return saved._id.toString();
  } catch (error) {
    console.error('[DB Service] Error saving resume to MongoDB:', error.message);
    throw error;
  }
}

/**
 * Persists an ATS evaluation report into MongoDB.
 * 
 * @param {string} resumeId - Resume ObjectId reference
 * @param {Object} atsResult - Deterministic score and checks output
 * @param {string} jobDescription - Optional JD comparison text
 * @param {Object} matchResult - Optional semantic match score result
 * @returns {Promise<string|null>} Created report ObjectId string
 */
async function saveAtsReport(resumeId, atsResult, jobDescription = null, matchResult = null) {
  try {
    if (!connectionState.isConnected || !resumeId) {
      console.warn('[DB Service] Connection inactive or resumeId invalid. Skipping report save.');
      return null;
    }

    const reportDoc = new AtsReport({
      resumeId,
      overallScore: atsResult.score,
      grade: atsResult.grade,
      checklistResults: atsResult.checks,
      jobDescription: jobDescription || null,
      similarityScore: matchResult?.similarityScore || null,
      keywordOverlap: atsResult.keywordOverlap || { matchedKeywords: [], overlapPercent: 0 },
    });

    const saved = await reportDoc.save();
    return saved._id.toString();
  } catch (error) {
    console.error('[DB Service] Error saving ATS report to MongoDB:', error.message);
    throw error;
  }
}

/**
 * Persists a generated study curriculum roadmap into MongoDB.
 * 
 * @param {string} resumeId - Optional Resume ObjectId reference
 * @param {Object} roadmapResult - Generated roadmap and metrics
 * @param {number} availableHoursPerDay - Target study time
 * @returns {Promise<string|null>} Created roadmap ObjectId string
 */
async function saveRoadmap(resumeId, roadmapResult, availableHoursPerDay) {
  try {
    if (!connectionState.isConnected) {
      console.warn('[DB Service] Mongoose connection not active. Skipping roadmap save.');
      return null;
    }

    const roadmapDoc = new Roadmap({
      resumeId: resumeId || null,
      targetRole: roadmapResult.targetRole,
      availableHoursPerDay,
      skillGaps: roadmapResult.skillGaps,
      curriculum: roadmapResult.roadmap,
      validationErrors: roadmapResult.validationErrors || [],
    });

    const saved = await roadmapDoc.save();
    return saved._id.toString();
  } catch (error) {
    console.error('[DB Service] Error saving Roadmap to MongoDB:', error.message);
    throw error;
  }
}

/**
 * Persists a generated GitHub profiling report into MongoDB.
 * 
 * @param {string} username - GitHub username
 * @param {Object} profile - Basic profile data
 * @param {Object} heuristics - Evaluated scores and checklist
 * @param {Array<Object>} summaries - Repository summary arrays
 * @returns {Promise<string|null>} Created report ObjectId string
 */
async function saveGithubReport(username, profile, heuristics, summaries) {
  try {
    if (!connectionState.isConnected) {
      console.warn('[DB Service] Mongoose connection not active. Skipping GitHub report save.');
      return null;
    }

    const reportDoc = new GithubReport({
      username,
      profile,
      heuristics,
      summaries,
    });

    const saved = await reportDoc.save();
    return saved._id.toString();
  } catch (error) {
    console.error('[DB Service] Error saving GitHub report to MongoDB:', error.message);
    throw error;
  }
}

/**
 * Fetches a GitHub profiling report for a specific user if it was created after a given date.
 * Allows implementation of caching layer.
 * 
 * @param {string} username - GitHub username
 * @param {Date} sinceDate - Earliest creation date allowed
 * @returns {Promise<Object|null>} Saved GithubReport document or null
 */
async function getRecentGithubReport(username, sinceDate) {
  try {
    if (!connectionState.isConnected) {
      return null;
    }
    
    return await GithubReport.findOne({
      username: username.toLowerCase().trim(),
      createdAt: { $gte: sinceDate },
    }).exec();
  } catch (error) {
    console.error('[DB Service] Error retrieving GitHub report:', error.message);
    return null;
  }
}

module.exports = {
  saveResume,
  saveAtsReport,
  saveRoadmap,
  saveGithubReport,
  getRecentGithubReport,
};

