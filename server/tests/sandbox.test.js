const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../src/config');

describe('Code Sandbox API Endpoints', () => {
  let mockToken = '';

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-career-twin');
    }

    // Create a test user
    await User.deleteMany({ email: 'sandboxtest@example.com' });
    const user = new User({
      name: 'Sandbox Tester',
      email: 'sandboxtest@example.com',
      password: 'password123',
      role: 'candidate',
    });
    await user.save();

    mockToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      config.jwtAccessSecret,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'sandboxtest@example.com' });
    await mongoose.connection.close();
  });

  describe('POST /api/sandbox/generate & GET /api/sandbox/verify/:token', () => {
    let generatedToken = '';

    it('should generate a signed sandbox proof of work token', async () => {
      const res = await request(app)
        .post('/api/sandbox/generate')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          githubRepoUrl: 'https://github.com/test/project',
          astReport: {
            cleanCodeScore: 92,
            securityScore: 88,
            detectedArchitecturePatterns: ['MVC', 'Repository'],
          },
        })
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('proof');
      expect(res.body.proof).toHaveProperty('verificationToken');

      generatedToken = res.body.proof.verificationToken;
    });

    it('should successfully verify the generated cryptographic token', async () => {
      const res = await request(app)
        .get(`/api/sandbox/verify/${generatedToken}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('verifiedReport');
      expect(res.body.verifiedReport).toHaveProperty('githubRepoUrl', 'https://github.com/test/project');
    });

    it('should reject invalid or tampered verification tokens with 401', async () => {
      // Mutate a character in the middle of the base64 token to invalidate signature/JSON structure
      const tamperedToken = generatedToken.substring(0, 10) + (generatedToken[10] === 'A' ? 'B' : 'A') + generatedToken.substring(11);
      await request(app)
        .get(`/api/sandbox/verify/${tamperedToken}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(401);
    });
  });
});
