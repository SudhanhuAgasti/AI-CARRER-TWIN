const express = require('express');
const { getDashboard } = require('../controllers/dashboard.controller');

const router = express.Router();

// GET /api/dashboard/:resumeId -> fetch consolidated readiness dashboard
router.get('/:resumeId', getDashboard);

module.exports = router;
