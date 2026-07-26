const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/user.model');

describe('Authentication API Endpoints', () => {
  const testUser = {
    name: 'Test Candidate',
    email: `candidate-${Date.now()}@example.com`,
    password: 'password123',
    role: 'candidate',
  };

  let accessToken = '';
  let cookieHeader = null;

  // Helper to extract name=value pairs from set-cookie headers
  const getCookieHeader = (headers) => {
    if (!headers) return [];
    return headers.map((cookie) => cookie.split(';')[0]);
  };

  beforeAll(async () => {
    // Wait for DB connection if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-career-twin');
    }
    // Clean user table
    await User.deleteMany({ email: /.*@example.com/ });
  });

  afterAll(async () => {
    // Clean up created test user
    await User.deleteMany({ email: testUser.email });
    // Close DB connection cleanly
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user and return an access token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.headers).toHaveProperty('set-cookie');
      
      cookieHeader = res.headers['set-cookie'];
    });

    it('should reject registration if the email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(res.body).toHaveProperty('message', 'Email is already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return access token + refresh cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toHaveProperty('name', testUser.name);
      expect(res.headers).toHaveProperty('set-cookie');

      accessToken = res.body.accessToken;
      cookieHeader = res.headers['set-cookie'];
    });

    it('should reject login with wrong password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user context when using a valid access token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should reject request when access token is missing', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should return rotated access token when calling with valid refresh cookie', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', getCookieHeader(cookieHeader))
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.headers).toHaveProperty('set-cookie');
      
      accessToken = res.body.accessToken;
      cookieHeader = res.headers['set-cookie'];
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear refresh token cookie', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', getCookieHeader(cookieHeader))
        .expect(200);

      expect(res.headers['set-cookie'][0]).toContain('refreshToken=;');
    });
  });
});
