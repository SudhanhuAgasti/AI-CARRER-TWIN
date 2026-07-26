const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, refresh, logout, getMe } = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth/authentication.middleware');

const router = express.Router();

// Strict rate-limiting for auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 registration/login requests per windowMs
  message: {
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

module.exports = router;
