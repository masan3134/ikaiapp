/**
 * User Role Constants
 * Used for authorization and access control
 */

const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  HR_SPECIALIST: 'HR_SPECIALIST',
  USER: 'USER'
};

/**
 * Role Groups
 * Used for checking if user belongs to a group of roles
 */
const ROLE_GROUPS = {
  // All roles that have admin privileges
  ADMINS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],

  // Manager and above (for delete operations)
  MANAGERS_PLUS: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],

  // All roles that can manage HR operations
  HR_MANAGERS: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.HR_SPECIALIST],

  // All roles that can view analytics
  ANALYTICS_VIEWERS: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],

  // All authenticated users
  ALL_AUTHENTICATED: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.HR_SPECIALIST, ROLES.USER]
};

/**
 * Role Hierarchy (higher number = more privileges)
 */
const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 5,
  [ROLES.ADMIN]: 4,
  [ROLES.MANAGER]: 3,
  [ROLES.HR_SPECIALIST]: 2,
  [ROLES.USER]: 1
};

module.exports = {
  ROLES,
  ROLE_GROUPS,
  ROLE_HIERARCHY
};
