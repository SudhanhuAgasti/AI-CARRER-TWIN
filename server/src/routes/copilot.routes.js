/**
 * @file copilot.routes.js
 * @description Express routes for AI Career Advancement and Negotiation Copilot services.
 * @author Senior Fullstack Engineer (8+ years experience)
 */

const express = require('express');
const { 
  generateElevatorPitchController, 
  generateOutreachController,
  generateNegotiationController
} = require('../controllers/copilot.controller');

const router = express.Router();

// POST /api/copilot/elevator-pitch -> generate structured spoken introduction scripts
router.post('/elevator-pitch', generateElevatorPitchController);

// POST /api/copilot/outreach -> generate cold LinkedIn and Email messages for hiring managers
router.post('/outreach', generateOutreachController);

// POST /api/copilot/negotiate -> generate compensation benchmarks, email templates and scripts
router.post('/negotiate', generateNegotiationController);

module.exports = router;

