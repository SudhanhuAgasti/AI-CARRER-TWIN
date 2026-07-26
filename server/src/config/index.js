/**
 * @file index.js
 * @description Central configuration manager using Zod for parsing and validation
 */

const { z } = require('zod');

// Ensure environment variables are loaded (loaded in server.js but safe here too)
require('dotenv').config();

const configSchema = z.object({
  port: z.coerce.number().default(4000),
  mongodbUri: z.string().default('mongodb://127.0.0.1:27017/ai-career-twin'),
  geminiApiKey: z.string().optional(),
  githubToken: z.string().optional(),
  hmacSecret: z.string().default('career-twin-cryptographic-verification-salt-secure-default'),
  jwtAccessSecret: z.string().default('ai-career-twin-jwt-access-secret-key-10-yoe-experience'),
  jwtRefreshSecret: z.string().default('ai-career-twin-jwt-refresh-secret-key-10-yoe-experience'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = configSchema.safeParse({
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI || process.env.MONGODB_URI_LOCAL, // Support typical variants
  geminiApiKey: process.env.GEMINI_API_KEY,
  githubToken: process.env.GITHUB_TOKEN,
  hmacSecret: process.env.HMAC_SECRET,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  nodeEnv: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

const config = parsed.data;

// Print warning logs for missing critical API keys
if (!config.geminiApiKey) {
  console.warn(
    '[Warning] GEMINI_API_KEY is not defined in the environment. AI extraction, match, and copilot services will fail at runtime.'
  );
}

if (!config.githubToken) {
  console.warn(
    '[Warning] GITHUB_TOKEN is not defined in the environment. GitHub API requests will be rate-limited to 60 requests/hour.'
  );
}

module.exports = config;
