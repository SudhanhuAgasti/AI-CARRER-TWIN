const db = require('../config/db');

/**
 * Persists a parsed structured resume into PostgreSQL.
 * 
 * @param {Object} structured - Extracted structured resume fields.
 * @param {string} rawText - Unstructured raw text from PDF/Word.
 * @returns {Promise<string|null>} Created resume UUID (or null if DB not configured)
 */
async function saveResume(structured, rawText) {
  try {
    const queryText = `
      INSERT INTO resumes (
        candidate_name, candidate_email, candidate_phone, 
        total_years_experience, skills, education, 
        experience, certifications, raw_text
      ) 
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9)
      RETURNING id;
    `;

    const values = [
      structured.name || null,
      structured.email || null,
      structured.phone || null,
      structured.totalYearsExperience || null,
      structured.skills || [],
      JSON.stringify(structured.education || []),
      JSON.stringify(structured.experience || []),
      structured.certifications || [],
      rawText,
    ];

    const result = await db.query(queryText, values);
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error('Error in saveResume persistence service:', error);
    throw error;
  }
}

/**
 * Persists an ATS evaluation report.
 * 
 * @param {string} resumeId - Resume UUID reference
 * @param {Object} atsResult - Deterministic score and checks output
 * @param {string} jobDescription - Optional JD comparison text
 * @param {Object} matchResult - Optional semantic match score result
 * @returns {Promise<string|null>} Created report UUID
 */
async function saveAtsReport(resumeId, atsResult, jobDescription = null, matchResult = null) {
  if (!resumeId) return null;
  try {
    const queryText = `
      INSERT INTO ats_reports (
        resume_id, overall_score, grade, 
        checklist_results, job_description, 
        similarity_score, keyword_overlap
      ) 
      VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7::jsonb)
      RETURNING id;
    `;

    const values = [
      resumeId,
      atsResult.score,
      atsResult.grade,
      JSON.stringify(atsResult.checks || []),
      jobDescription || null,
      matchResult?.similarityScore || null,
      JSON.stringify(atsResult.keywordOverlap || {}),
    ];

    const result = await db.query(queryText, values);
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error('Error in saveAtsReport persistence service:', error);
    throw error;
  }
}

/**
 * Persists a generated study curriculum roadmap.
 * 
 * @param {string} resumeId - Optional Resume UUID reference
 * @param {Object} roadmapResult - Generated roadmap and metrics
 * @param {number} availableHoursPerDay - Target study time
 * @returns {Promise<string|null>} Created roadmap UUID
 */
async function saveRoadmap(resumeId, roadmapResult, availableHoursPerDay) {
  try {
    const queryText = `
      INSERT INTO roadmaps (
        resume_id, target_role, available_hours_per_day,
        skill_gaps, curriculum, validation_errors
      )
      VALUES ($1, $2, $3, $4, $5::jsonb, $6)
      RETURNING id;
    `;

    const values = [
      resumeId || null,
      roadmapResult.targetRole,
      availableHoursPerDay,
      roadmapResult.skillGaps || [],
      JSON.stringify(roadmapResult.roadmap || {}),
      roadmapResult.validationErrors || null,
    ];

    const result = await db.query(queryText, values);
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error('Error in saveRoadmap persistence service:', error);
    throw error;
  }
}

module.exports = {
  saveResume,
  saveAtsReport,
  saveRoadmap,
};
