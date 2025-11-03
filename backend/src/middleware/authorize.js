/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * This middleware checks if the authenticated user has one of the required roles.
 * Must be used after authenticateToken middleware.
 *
 * @param {Array<string>} allowedRoles - Array of roles that are allowed to access the endpoint
 * @returns {Function} Express middleware function
 *
 * @example
 * router.get('/admin-only', authenticateToken, authorize(['ADMIN']), controller);
 * router.get('/managers', authenticateToken, authorize(['ADMIN', 'MANAGER']), controller);
 */
function authorize(allowedRoles) {
  return (req, res, next) => {
    // Check if user exists (should be set by authenticateToken middleware)
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Kimlik doğrulaması gerekli'
      });
    }

    // Check if user has required role
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu işlem için yetkiniz yok',
        details: {
          requiredRoles: allowedRoles,
          userRole: userRole
        }
      });
    }

    // User is authorized, proceed to next middleware
    next();
  };
}

module.exports = { authorize };
