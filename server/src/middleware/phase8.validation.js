/**
 * @file phase8.validation.js
 * @description Zod validation schemas for Phase 8 endpoints.
 * @author Senior Fullstack Engineer (10+ years experience)
 */

const { z } = require('zod');

// Schema for POST /api/telemetry/analyze
const telemetryAnalysisSchema = z.object({
  resumeText: z.string({ required_error: 'resumeText is required' }).trim().min(10, 'resumeText must be at least 10 characters long'),
  liveMarketJobs: z
    .array(z.string().trim().min(1), { required_error: 'liveMarketJobs array is required' })
    .min(1, 'liveMarketJobs must contain at least one job description'),
});

// Schema for POST /api/sandbox/generate
const sandboxGenerationSchema = z.object({
  githubRepoUrl: z
    .string({ required_error: 'githubRepoUrl is required' })
    .trim()
    .url('githubRepoUrl must be a valid URL'),
  astReport: z
    .object({
      cleanCodeScore: z.number().min(0).max(100).optional(),
      securityScore: z.number().min(0).max(100).optional(),
      detectedArchitecturePatterns: z.array(z.string()).optional(),
    })
    .optional()
    .nullable(),
});

// Schema for GET /api/sandbox/verify/:token
const sandboxVerificationSchema = z.object({
  token: z.string({ required_error: 'Verification token parameter is required' }).trim().min(1),
});

module.exports = {
  telemetryAnalysisSchema,
  sandboxGenerationSchema,
  sandboxVerificationSchema,
};
