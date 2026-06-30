/**
 * @file errors.js
 * @description Standard custom exception classes for HTTP error dispatching.
 * @author Senior Fullstack Engineer (9+ years experience)
 */

class AppError extends Error {
  /**
   * @param {string} message - Error description
   * @param {number} statusCode - HTTP Status code (e.g. 400, 404, 500)
   * @param {Array|null} [details=null] - Optional detailed issues (like validation failures)
   */
  constructor(message, statusCode, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 400, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
};
