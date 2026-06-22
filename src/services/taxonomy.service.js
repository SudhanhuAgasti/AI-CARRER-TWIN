const taxonomy = require('../data/taxonomy.json');

/**
 * Normalizes a skill string (lowercases, trims, resolves common synonyms).
 * @param {string} skill 
 * @returns {string}
 */
function normalizeSkill(skill) {
  if (!skill) return '';
  const clean = skill.toLowerCase().trim();
  return taxonomy.synonyms[clean] || clean;
}

/**
 * Extracts skill gaps by comparing resume skills with target role requirements.
 * @param {string[]} resumeSkills 
 * @param {string} roleKey 
 * @returns {{ roleTitle: string, requiredGaps: string[], preferredGaps: string[], totalGaps: string[] }}
 */
function extractSkillGaps(resumeSkills = [], roleKey) {
  const role = taxonomy.roles[roleKey];
  if (!role) {
    throw new Error(`Role '${roleKey}' is not supported in the taxonomy. Supported roles: ${Object.keys(taxonomy.roles).join(', ')}`);
  }

  // Normalize all user skills into a Set for fast lookup
  const userSkillSet = new Set(resumeSkills.map(normalizeSkill));

  // Determine gaps for required skills
  const requiredGaps = role.requiredSkills.filter(
    (skill) => !userSkillSet.has(normalizeSkill(skill))
  );

  // Determine gaps for preferred skills
  const preferredGaps = role.preferredSkills.filter(
    (skill) => !userSkillSet.has(normalizeSkill(skill))
  );

  return {
    roleTitle: role.title,
    requiredGaps,
    preferredGaps,
    totalGaps: [...requiredGaps, ...preferredGaps],
  };
}

/**
 * Lists all supported roles in the taxonomy system.
 * @returns {Array<{key: string, title: string}>}
 */
function getSupportedRoles() {
  return Object.entries(taxonomy.roles).map(([key, value]) => ({
    key,
    title: value.title,
  }));
}

module.exports = {
  normalizeSkill,
  extractSkillGaps,
  getSupportedRoles,
};
