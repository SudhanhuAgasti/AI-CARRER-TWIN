const express = require('express');
const { getDashboard, recompileDashboard } = require('../controllers/dashboard.controller');

const router = express.Router();

// GET /api/dashboard/:resumeId -> fetch consolidated readiness dashboard (cached by default)
router.get('/:resumeId', getDashboard);

// POST /api/dashboard/:resumeId/recompile -> force compile / recalculate metrics
router.post('/:resumeId/recompile', recompileDashboard);

module.exports = router;
