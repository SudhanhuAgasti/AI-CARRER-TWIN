const express = require('express');
const {
  getDashboard,
  recompileDashboard,
  getCandidateBadgeController,
  searchRecruiterMarketplaceController,
} = require('../controllers/dashboard.controller');

const router = express.Router();

// GET /api/dashboard/marketplace/search -> search pre-vetted candidates for B2B recruiters
router.get('/marketplace/search', searchRecruiterMarketplaceController);

// GET /api/dashboard/:resumeId -> fetch consolidated readiness dashboard (cached by default)
router.get('/:resumeId', getDashboard);

// GET /api/dashboard/:resumeId/verify-badge -> generate public verified credential badge
router.get('/:resumeId/verify-badge', getCandidateBadgeController);

// POST /api/dashboard/:resumeId/recompile -> force compile / recalculate metrics
router.post('/:resumeId/recompile', recompileDashboard);

module.exports = router;

