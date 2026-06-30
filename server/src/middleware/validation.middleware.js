const { ValidationError } = require('../utils/errors');

/**
 * Creates an Express middleware to validate request body against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler} Express request handler
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Map Zod errors to a readable array of fields and error messages
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return next(new ValidationError('Validation failed', formattedErrors));
    }

    // Replace req.body with the parsed/coerced data from Zod
    req.body = result.data;
    next();
  };
}

module.exports = {
  validateBody,
};
