const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config');
const { connectionState } = require('../config/db');

/**
 * Generates a short-lived access JWT token.
 */
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    config.jwtAccessSecret,
    { expiresIn: '15m' }
  );
}

/**
 * Generates a long-lived refresh JWT token.
 */
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id || user.id },
    config.jwtRefreshSecret,
    { expiresIn: '7d' }
  );
}

/**
 * Helper to set secure HTTP-only refresh token cookie.
 */
function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/**
 * Registers a new system user.
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      const err = new Error('Name, email, and password are required');
      err.status = 400;
      throw err;
    }

    if (!connectionState.isConnected) {
      // Offline / No-DB Mode fallback for local testing
      const mockUser = { id: 'mock-id-' + Date.now(), name, email, role: role || 'candidate' };
      const accessToken = generateAccessToken(mockUser);
      const refreshToken = generateRefreshToken(mockUser);
      setRefreshCookie(res, refreshToken);
      return res.status(201).json({
        accessToken,
        user: mockUser,
      });
    }

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      const err = new Error('Email is already registered');
      err.status = 400;
      throw err;
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'candidate',
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Authenticates user credentials and issues tokens.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.status = 400;
      throw err;
    }

    if (!connectionState.isConnected) {
      // Offline fallback
      if (password.length >= 6) {
        const mockUser = { id: 'dev-user-01', name: 'Sudhanshu Agasti', email, role: 'candidate' };
        const accessToken = generateAccessToken(mockUser);
        const refreshToken = generateRefreshToken(mockUser);
        setRefreshCookie(res, refreshToken);
        return res.json({
          accessToken,
          user: mockUser,
        });
      }
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    const user = await User.findOne({ email }).select('+password').exec();
    if (!user || !(await user.comparePassword(password))) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    setRefreshCookie(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Refreshes an expired access token using the HTTP-only refresh token.
 * Performs token rotation to prevent replay attacks.
 */
async function refresh(req, res, next) {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      const err = new Error('Refresh token missing');
      err.status = 401;
      throw err;
    }

    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, config.jwtRefreshSecret);
    } catch (jwtErr) {
      const err = new Error('Invalid or expired refresh token');
      err.status = 401;
      throw err;
    }

    if (!connectionState.isConnected) {
      // Offline fallback
      const mockUser = { id: decoded.id, name: 'Sudhanshu Agasti', email: 'user@example.com', role: 'candidate' };
      const newAccessToken = generateAccessToken(mockUser);
      const newRefreshToken = generateRefreshToken(mockUser);
      setRefreshCookie(res, newRefreshToken);
      return res.json({
        accessToken: newAccessToken,
        user: mockUser,
      });
    }

    const user = await User.findById(decoded.id).exec();
    if (!user || !user.refreshTokens.includes(oldRefreshToken)) {
      // Replay attack or revoked token: clear user tokens for security
      if (user) {
        user.refreshTokens = [];
        await user.save();
      }
      res.clearCookie('refreshToken', { path: '/' });
      const err = new Error('Session expired or hijacked');
      err.status = 403;
      throw err;
    }

    // Generate rotated tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Rotate refresh tokens: remove old, push new
    user.refreshTokens = user.refreshTokens.filter(t => t !== oldRefreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    setRefreshCookie(res, newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logs out the user, clearing local cookies and DB sessions.
 */
async function logout(req, res, next) {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (oldRefreshToken && connectionState.isConnected) {
      try {
        const decoded = jwt.verify(oldRefreshToken, config.jwtRefreshSecret);
        await User.findByIdAndUpdate(decoded.id, {
          $pull: { refreshTokens: oldRefreshToken }
        }).exec();
      } catch (e) {
        // Token was already invalid, ignore
      }
    }

    res.clearCookie('refreshToken', { path: '/' });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns the current user profile.
 */
function getMe(req, res) {
  res.json({
    user: {
      id: req.user._id || req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
