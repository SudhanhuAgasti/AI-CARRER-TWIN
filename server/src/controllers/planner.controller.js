const { generateRoadmap } = require('../services/planner.service');
const { generateMicroProject } = require('../services/microProject.service');
const { getSupportedRoles } = require('../services/taxonomy.service');
const { saveRoadmap } = require('../services/db.service');

/**
 * Controller handling POST /api/planner/roadmap.
 * Extracts skill gaps deterministically, plans curriculum via LLM, and persists the roadmap to DB.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.NextFunction} next 
 */
async function createRoadmap(req, res, next) {
  try {
    const { resumeSkills, targetRole, availableHoursPerDay, resumeId } = req.body;

    if (!targetRole) {
      const err = new Error('targetRole field is required (e.g. backend-engineer)');
      err.status = 400;
      throw err;
    }

    if (!resumeSkills || !Array.isArray(resumeSkills)) {
      const err = new Error('resumeSkills must be an array of strings');
      err.status = 400;
      throw err;
    }

    const hours = availableHoursPerDay ? Number(availableHoursPerDay) : 2;
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      const err = new Error('availableHoursPerDay must be a positive number between 1 and 24');
      err.status = 400;
      throw err;
    }

    // Generate the roadmap (Run state analyzer nodes)
    const result = await generateRoadmap({
      resumeSkills,
      targetRole,
      availableHoursPerDay: hours,
    });

    // Database persistence layer (Gracefully falls back if database is not active)
    let roadmapId = null;
    try {
      roadmapId = await saveRoadmap(resumeId || null, result, hours);
    } catch (dbErr) {
      console.warn('Database persistence failed for roadmap, proceeding without database:', dbErr.message);
    }

    res.json({
      ids: {
        roadmapId,
      },
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller handling POST /api/planner/micro-project.
 * Generates a targeted micro-project repo specification for a specific skill gap.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.NextFunction} next 
 */
async function createMicroProjectController(req, res, next) {
  try {
    const { skillGap, targetRole } = req.body;

    if (!skillGap || typeof skillGap !== 'string' || skillGap.trim().length === 0) {
      const err = new Error('skillGap string parameter is required');
      err.status = 400;
      throw err;
    }

    const projectSpec = await generateMicroProject(skillGap, targetRole || 'Software Engineer');

    res.json({
      success: true,
      microProject: projectSpec,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller handling GET /api/planner/roles.
 * Returns lists of all supported career profiles.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
function listRoles(req, res) {
  const roles = getSupportedRoles();
  res.json({ roles });
}

module.exports = {
  createRoadmap,
  createMicroProjectController,
  listRoles,
};

