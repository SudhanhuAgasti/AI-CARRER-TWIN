// Mock external AI services to isolate controller integration testing
jest.mock('../src/services/interviewAgent.service', () => ({
  containsPromptInjection: jest.fn().mockReturnValue(false),
  runQuestionGeneratorNode: jest.fn().mockResolvedValue('How do you design a scalable microservices architecture?'),
  runEvaluatorNode: jest.fn().mockResolvedValue({
    feedback: 'Good answer, but could cover caching more.',
    score: 8,
  }),
  runFinalScorerNode: jest.fn().mockResolvedValue({
    score: 85,
    summary: 'Great performance.',
  }),
}));

jest.mock('../src/services/audio.service', () => ({
  transcribeAudio: jest.fn().mockResolvedValue('This is my speech answer.'),
}));

jest.mock('../src/services/speechTelemetry.service', () => ({
  analyzeSpeechTelemetry: jest.fn().mockResolvedValue({
    duration: 5,
    wpm: 120,
    confidence: 0.9,
  }),
}));

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/user.model');
const InterviewSession = require('../src/models/interviewSession.model');
const jwt = require('jsonwebtoken');
const config = require('../src/config');

describe('Mock Interview API Endpoints', () => {
  let mockToken = '';
  let sessionId = '';

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-career-twin');
    }

    // Create a test user
    await User.deleteMany({ email: 'interviewtest@example.com' });
    const user = new User({
      name: 'Interview Tester',
      email: 'interviewtest@example.com',
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
    await User.deleteMany({ email: 'interviewtest@example.com' });
    if (sessionId) {
      await InterviewSession.deleteOne({ _id: sessionId });
    }
    await mongoose.connection.close();
  });

  describe('POST /api/interview/start', () => {
    it('should successfully create a new interview session and yield the first question', async () => {
      const res = await request(app)
        .post('/api/interview/start')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetRole: 'Software Engineer',
          experienceLevel: 'mid',
          maxQuestions: 3,
        })
        .expect(200);

      expect(res.body).toHaveProperty('sessionId');
      expect(res.body).toHaveProperty('question');
      expect(res.body.question).toContain('scalable microservices');
      
      sessionId = res.body.sessionId;
    });

    it('should block starting session if input validation fails', async () => {
      await request(app)
        .post('/api/interview/start')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          experienceLevel: 'Mid',
        })
        .expect(400);
    });
  });

  describe('GET /api/interview/:id', () => {
    it('should fetch the interview session configuration details', async () => {
      const res = await request(app)
        .get(`/api/interview/${sessionId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('session');
      expect(res.body.session).toHaveProperty('targetRole', 'Software Engineer');
    });
  });

  describe('Concurrency Locks & POST /api/interview/:id/answer', () => {
    it('should successfully process a candidate text answer submission', async () => {
      const res = await request(app)
        .post(`/api/interview/${sessionId}/answer`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          answerText: 'I would use load balancers, caching and horizontal scaling.',
        })
        .expect(200);

      expect(res.body).toHaveProperty('feedback');
    });

    it('should throw a 409 status if parallel duplicate requests attempt to hijack the session lock', async () => {
      // Manually set isLocked flag to true in the db to simulate parallel execution lock
      await InterviewSession.findByIdAndUpdate(sessionId, { isLocked: true }).exec();

      const res = await request(app)
        .post(`/api/interview/${sessionId}/answer`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          answerText: 'Another answer.',
        })
        .expect(409);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Session is currently busy');

      // Clear the lock for cleanup
      await InterviewSession.findByIdAndUpdate(sessionId, { isLocked: false }).exec();
    });
  });
});
