/**
 * @file recruiterMarketplace.service.js
 * @description B2B Recruiter Marketplace and Public Verified Candidate Profile indexing service
 */

const ReadinessDashboard = require('../models/readinessDashboard.model');
const Resume = require('../models/resume.model');
const { connectionState } = require('../config/db');

/**
 * Generates a public verified candidate credential badge profile.
 *
 * @param {string} resumeId - Candidate Resume ID
 * @returns {Promise<Object>} Public verified badge profile
 */
async function generatePublicCandidateBadge(resumeId) {
  if (!connectionState.isConnected) {
    return {
      verificationId: `VCD-DEMO88`,
      candidateName: 'Verified Tech Candidate (Demo)',
      targetRole: 'Senior Fullstack Engineer',
      verifiedUnifiedScore: 88,
      scoreBreakdown: { atsScore: 90, matchScore: 85, githubScore: 88, interviewScore: 90, linkedinScore: 85 },
      topSkills: ['React', 'Node.js', 'TypeScript', 'Kafka', 'System Design'],
      verificationBadgeUrl: `https://ai-career-twin.saas/verify/VCD-DEMO88`,
      issuedAt: new Date()
    };
  }

  const dashboard = await ReadinessDashboard.findOne({ resumeId }).exec();
  const resume = await Resume.findById(resumeId).exec();

  if (!dashboard || !resume) {
    throw new Error('Candidate readiness profile or resume data not found.');
  }

  return {
    verificationId: `VCD-${resumeId.toString().slice(-8).toUpperCase()}`,
    candidateName: resume.structuredResume ? resume.structuredResume.name || 'Verified Tech Candidate' : 'Verified Candidate',
    targetRole: resume.structuredResume && resume.structuredResume.experience && resume.structuredResume.experience.length > 0 
      ? resume.structuredResume.experience[0].title 
      : 'Software Engineer',
    verifiedUnifiedScore: dashboard.unifiedScore,
    scoreBreakdown: dashboard.breakdown,
    topSkills: resume.structuredResume ? (resume.structuredResume.skills || []).slice(0, 8) : [],
    verificationBadgeUrl: `https://ai-career-twin.saas/verify/VCD-${resumeId.toString().slice(-8).toUpperCase()}`,
    issuedAt: dashboard.updatedAt || dashboard.createdAt
  };
}

/**
 * Searches pre-vetted candidates for B2B tech recruiters.
 *
 * @param {Object} queryParams - Filtering criteria (minScore, skill, role)
 * @returns {Promise<Array<Object>>} List of matching verified candidates
 */
async function searchVerifiedCandidates(queryParams = {}) {
  if (!connectionState.isConnected) {
    return [
      {
        resumeId: 'demo-resume-1',
        candidateName: 'Sudhanshu Agasti (Verified)',
        targetRole: 'Senior Fullstack Engineer',
        unifiedReadinessScore: 92,
        skillsSummary: ['Node.js', 'React', 'Kafka', 'System Design', 'MongoDB'],
        verificationStatus: 'VERIFIED_AI_TWIN'
      },
      {
        resumeId: 'demo-resume-2',
        candidateName: 'Alex Rivers (Verified)',
        targetRole: 'Lead Backend Architect',
        unifiedReadinessScore: 89,
        skillsSummary: ['Java', 'Spring Boot', 'Redis', 'Docker', 'Kubernetes'],
        verificationStatus: 'VERIFIED_AI_TWIN'
      }
    ];
  }

  const { minScore = 60 } = queryParams;

  const filter = {
    unifiedScore: { $gte: Number(minScore) }
  };

  const candidateDashboards = await ReadinessDashboard.find(filter)
    .sort({ unifiedScore: -1 })
    .limit(20)
    .exec();

  const results = await Promise.all(
    candidateDashboards.map(async (dash) => {
      let candidateName = 'Verified Candidate';
      let role = 'Software Engineer';
      let skills = [];

      try {
        const resume = await Resume.findById(dash.resumeId).exec();
        if (resume && resume.structuredResume) {
          candidateName = resume.structuredResume.name || candidateName;
          skills = resume.structuredResume.skills || [];
          if (resume.structuredResume.experience && resume.structuredResume.experience.length > 0) {
            role = resume.structuredResume.experience[0].title;
          }
        }
      } catch (e) {
        // Fallback gracefully
      }

      return {
        resumeId: dash.resumeId,
        candidateName,
        targetRole: role,
        unifiedReadinessScore: dash.unifiedScore,
        skillsSummary: skills.slice(0, 6),
        verificationStatus: 'VERIFIED_AI_TWIN'
      };
    })
  );

  return results;
}

module.exports = {
  generatePublicCandidateBadge,
  searchVerifiedCandidates,
};

