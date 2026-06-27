/**
 * @file copilot.routes.js
 * @description Express routes for AI Career Advancement and Negotiation Copilot services.
 * @author Senior Fullstack Engineer (8+ years experience)
 */

const express = require('express');
const { generateElevatorPitchController } = require('../controllers/copilot.controller');

const router = express.Router();

// POST /api/copilot/elevator-pitch -> generate structured spoken introduction scripts
router.post('/elevator-pitch', generateElevatorPitchController);

module.exports = router;
