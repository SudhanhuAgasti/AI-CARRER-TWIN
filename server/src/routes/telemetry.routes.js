/**
 * @file telemetry.routes.js
 * @description Express routes mapping for real-time Job Market Telemetry.
 * @author Senior Fullstack Engineer (10+ years experience)
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { analyzeTelemetryController } = require('../controllers/telemetry.controller');
const { validateBody } = require('../middleware/validation.middleware');
const { telemetryAnalysisSchema } = require('../middleware/phase8.validation');

const router = express.Router();

// Telemetry API Rate Limiter (Max 15 requests per 15 minutes per IP)
const telemetryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Too many telemetry analysis requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/telemetry/analyze -> analyze semantic drift and suggest remedies
router.post('/analyze', telemetryLimiter, validateBody(telemetryAnalysisSchema), analyzeTelemetryController);

module.exports = router;
