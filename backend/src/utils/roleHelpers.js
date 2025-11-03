const { ROLES, ROLE_GROUPS, ROLE_HIERARCHY } = require('../constants/roles');

/**
 * Check if user has admin role (ADMIN or SUPER_ADMIN)
 * @param {string} userRole - User's role
 * @returns {boolean}
 */
function isAdmin(userRole) {
  return ROLE_GROUPS.ADMINS.includes(userRole);
}

/**
 * Check if user can manage HR operations
 * @param {string} userRole - User's role
 * @returns {boolean}
 */
function canManageHR(userRole) {
  return ROLE_GROUPS.HR_MANAGERS.includes(userRole);
}

/**
 * Check if user can view analytics
 * @param {string} userRole - User's role
 * @returns {boolean}
 */
function canViewAnalytics(userRole) {
  return ROLE_GROUPS.ANALYTICS_VIEWERS.includes(userRole);
}

/**
 * Check if user has one of the required roles
 * @param {string} userRole - User's role
 * @param {string[]} requiredRoles - Array of required roles
 * @returns {boolean}
 */
function hasRequiredRole(userRole, requiredRoles) {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user's role is higher than or equal to required role
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role
 * @returns {boolean}
 */
function hasRoleOrHigher(userRole, requiredRole) {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Get all roles equal to or higher than given role
 * @param {string} role - Base role
 * @returns {string[]}
 */
function getRolesEqualOrHigher(role) {
  const baseLevel = ROLE_HIERARCHY[role] || 0;
  return Object.keys(ROLE_HIERARCHY).filter(
    r => ROLE_HIERARCHY[r] >= baseLevel
  );
}

module.exports = {
  isAdmin,
  canManageHR,
  canViewAnalytics,
  hasRequiredRole,
  hasRoleOrHigher,
  getRolesEqualOrHigher
};
