// Mock third-party service calls (Gemini AI, PDF parse, OCR) to keep tests isolated and fast
jest.mock('../src/services/parser.service', () => ({
  extractText: jest.fn().mockResolvedValue('Senior Software Engineer with 8 years of Javascript experience.'),
}));

jest.mock('../src/services/extraction.service', () => ({
  extractStructuredResume: jest.fn().mockResolvedValue({
    name: 'Mock Candidate',
    email: 'mock@example.com',
    phone: '1234567890',
    totalYearsExperience: 8,
    skills: ['Javascript', 'Express', 'React', 'MongoDB'],
    experience: [],
    education: [],
    certifications: [],
  }),
}));

jest.mock('../src/services/ats.service', () => ({
  computeAtsScore: jest.fn().mockReturnValue({
    score: 85,
    grade: 'A',
    checks: [],
    keywordOverlap: { matchedKeywords: ['React'], overlapPercent: 50 },
  }),
}));

jest.mock('../src/services/match.service', () => ({
  computeMatchScore: jest.fn().mockResolvedValue({
    similarityScore: 90,
  }),
}));

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../src/config');

describe('Resume Controller Endpoints', () => {
  let mockToken = '';

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-career-twin');
    }

    // Clean user and create test profile
    await User.deleteMany({ email: 'resumetest@example.com' });
    const user = new User({
      name: 'Resume Tester',
      email: 'resumetest@example.com',
      password: 'password123',
      role: 'candidate',
    });
    await user.save();

    // Create valid token
    mockToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      config.jwtAccessSecret,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'resumetest@example.com' });
    await mongoose.connection.close();
  });

  describe('POST /api/resume/analyze', () => {
    it('should successfully parse and analyze an uploaded resume', async () => {
      const res = await request(app)
        .post('/api/resume/analyze')
        .set('Authorization', `Bearer ${mockToken}`)
        .attach('file', Buffer.from('PDF_HEADER_CONTENT'), {
          filename: 'resume.pdf',
          contentType: 'application/pdf',
        })
        .field('jobDescription', 'Looking for a Senior Javascript developer with Express experience')
        .expect(200);

      expect(res.body).toHaveProperty('structuredResume');
      expect(res.body.structuredResume).toHaveProperty('name', 'Mock Candidate');
      expect(res.body).toHaveProperty('ats');
      expect(res.body.ats).toHaveProperty('score', 85);
      expect(res.body).toHaveProperty('match');
      expect(res.body.match).toHaveProperty('similarityScore', 90);
    });

    it('should fail if no file is uploaded', async () => {
      const res = await request(app)
        .post('/api/resume/analyze')
        .set('Authorization', `Bearer ${mockToken}`)
        .field('jobDescription', 'Some Job Description')
        .expect(400);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('file is required');
    });

    it('should deny access if unauthorized', async () => {
      await request(app)
        .post('/api/resume/analyze')
        .expect(401);
    });
  });
});
