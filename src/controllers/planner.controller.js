const { generateRoadmap } = require('../services/planner.service');
const { getSupportedRoles } = require('../services/taxonomy.service');

async function createRoadmap(req, res, next) {
  try {
    const { resumeSkills, targetRole, availableHoursPerDay } = req.body;

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

    const result = await generateRoadmap({
      resumeSkills,
      targetRole,
      availableHoursPerDay: hours,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

function listRoles(req, res) {
  const roles = getSupportedRoles();
  res.json({ roles });
}

module.exports = {
  createRoadmap,
  listRoles,
};
