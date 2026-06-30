/**
 * @file copilot.routes.js
 * @description Express routes for AI Career Advancement and Negotiation Copilot services.
 * @author Senior Fullstack Engineer (8+ years experience)
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { 
  generateElevatorPitchController, 
  generateOutreachController,
  generateNegotiationController
} = require('../controllers/copilot.controller');
const { validateBody } = require('../middleware/validation.middleware');
const { 
  elevatorPitchSchema, 
  outreachSchema, 
  negotiateSchema 
} = require('../middleware/copilot.validation');

const router = express.Router();

// Define a request rate limiter for LLM-heavy copilot routes
// Max 20 requests per 15 minutes per IP address
const copilotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: 'Too many requests to the Career Copilot API from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all copilot endpoints
router.use(copilotLimiter);

// POST /api/copilot/elevator-pitch -> generate structured spoken introduction scripts
router.post('/elevator-pitch', validateBody(elevatorPitchSchema), generateElevatorPitchController);

// POST /api/copilot/outreach -> generate cold LinkedIn and Email messages for hiring managers
router.post('/outreach', validateBody(outreachSchema), generateOutreachController);

// POST /api/copilot/negotiate -> generate compensation benchmarks, email templates and scripts
router.post('/negotiate', validateBody(negotiateSchema), generateNegotiationController);

module.exports = router;

