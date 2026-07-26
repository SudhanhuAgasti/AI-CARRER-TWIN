const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../models/user.model');
const { connectionState } = require('../../config/db');

/**
 * Authentication Middleware
 * Decodes the JWT access token and attaches the authenticated user to the request context.
 * Supports Bearer token in the Authorization header.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.NextFunction} next 
 */
async function authenticate(req, res, next) {
  try {
    let token = null;

    // Retrieve token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      const error = new Error('Authentication failed. No access token provided.');
      error.status = 401;
      return next(error);
    }

    // Verify JWT access token
    const decoded = jwt.verify(token, config.jwtAccessSecret);

    // If database connection is not active, construct fallback user metadata from token
    if (!connectionState.isConnected) {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      };
      return next();
    }

    // Fetch user from DB to ensure they still exist and are active
    const user = await User.findById(decoded.id).exec();
    if (!user) {
      const error = new Error('User account not found.');
      error.status = 401;
      return next(error);
    }

    // Attach user mongoose document to request context
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const expiredError = new Error('Access token has expired.');
      expiredError.status = 401;
      expiredError.code = 'TOKEN_EXPIRED';
      return next(expiredError);
    }

    const invalidError = new Error('Invalid authentication token.');
    invalidError.status = 401;
    next(invalidError);
  }
}

module.exports = authenticate;
