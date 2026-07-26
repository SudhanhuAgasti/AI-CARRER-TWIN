/**
 * Authorization Middleware
 * Restricts access to routes based on user roles.
 * Must be executed after the authenticate middleware.
 * 
 * @param {...string} allowedRoles - List of authorized roles (e.g. 'admin', 'interviewer')
 * @returns {Function} Express middleware function
 */
function restrictTo(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Authorization failed. User context is missing.');
      error.status = 500;
      return next(error);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const error = new Error('Access denied. You do not have permission to access this resource.');
      error.status = 403;
      return next(error);
    }

    next();
  };
}

module.exports = {
  restrictTo,
};
