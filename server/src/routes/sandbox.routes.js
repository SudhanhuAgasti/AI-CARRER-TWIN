/**
 * @file sandbox.routes.js
 * @description Express routing definition for cryptographically verified code sandbox executions */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { generateSandboxProofController, verifySandboxTokenController } = require('../controllers/sandbox.controller');
const { validateBody } = require('../middleware/validation.middleware');
const { sandboxGenerationSchema } = require('../middleware/phase8.validation');

const router = express.Router();

// Sandbox API Rate Limiter
const sandboxLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many sandbox verify operations from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/sandbox/generate -> simulates execution and generates HMAC-signed verification certificate
router.post('/generate', sandboxLimiter, validateBody(sandboxGenerationSchema), generateSandboxProofController);

// GET /api/sandbox/verify/:token -> decodes base64 verification token and cryptographically validates signature
router.get('/verify/:token', sandboxLimiter, verifySandboxTokenController);

module.exports = router;
