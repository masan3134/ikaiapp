/**
 * Super Admin Middleware
 * Restricts access to SUPER_ADMIN role only
 * Must be used after authenticateToken middleware
 */

/**
 * Middleware to require SUPER_ADMIN role
 * Returns 403 if user is not a super admin
 */
function requireSuperAdmin(req, res, next) {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Kimlik doğrulama gerekli'
    });
  }

  // Check if user has SUPER_ADMIN role
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Süper yönetici erişimi gerekli'
    });
  }

  // User is super admin, proceed
  next();
}

module.exports = {
  requireSuperAdmin
};
