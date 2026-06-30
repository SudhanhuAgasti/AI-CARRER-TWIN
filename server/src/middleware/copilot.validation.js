/**
 * @file copilot.validation.js
 * @description Zod validation schemas for the Copilot suite routes.
 * @author Senior Fullstack Engineer (9+ years experience)
 */

const { z } = require('zod');

// Schema for POST /api/copilot/elevator-pitch
const elevatorPitchSchema = z.object({
  resumeData: z.object({}).passthrough().describe('Structured candidate resume data object'),
  targetRole: z.string().trim().min(1).default('Software Engineer'),
  experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead']).default('senior'),
});

// Schema for POST /api/copilot/outreach
const outreachSchema = z.object({
  candidateData: z.object({}).passthrough().describe('Candidate profile & achievements details'),
  targetCompany: z.string().trim().min(1).default('Target Company'),
  targetManagerRole: z.string().trim().min(1).default('Engineering Manager'),
});

// Schema for POST /api/copilot/negotiate
const negotiateSchema = z.object({
  targetRole: z.string({ required_error: 'targetRole is required' }).trim().min(1),
  location: z.string({ required_error: 'location is required' }).trim().min(1),
  currentOffer: z.object({
    baseSalary: z.number().optional(),
    equity: z.union([z.number(), z.string()]).optional(),
    performanceBonus: z.union([z.number(), z.string()]).optional(),
    signingBonus: z.union([z.number(), z.string()]).optional(),
    currency: z.string().optional(),
  }).optional().nullable(),
  candidateData: z.object({}).passthrough().optional().nullable(),
});

module.exports = {
  elevatorPitchSchema,
  outreachSchema,
  negotiateSchema,
};
