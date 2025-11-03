/**
 * User Role Constants (Frontend)
 * Must match backend roles exactly
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  HR_SPECIALIST = 'HR_SPECIALIST',
  USER = 'USER'
}

/**
 * Role Groups for easier permission checks
 */
export const RoleGroups = {
  ADMINS: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  HR_MANAGERS: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.HR_SPECIALIST],
  ANALYTICS_VIEWERS: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
  ALL_AUTHENTICATED: [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.HR_SPECIALIST,
    UserRole.USER
  ]
} as const;

/**
 * Role hierarchy for comparison
 */
export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 5,
  [UserRole.ADMIN]: 4,
  [UserRole.MANAGER]: 3,
  [UserRole.HR_SPECIALIST]: 2,
  [UserRole.USER]: 1
};

/**
 * Type for role arrays
 */
export type AllowedRoles = UserRole[];

/**
 * Helper to check if role is in allowed list
 */
export function isRoleAllowed(userRole: UserRole | string, allowedRoles: AllowedRoles): boolean {
  return allowedRoles.includes(userRole as UserRole);
}

/**
 * Helper to check if user has admin privileges
 */
export function isAdmin(userRole: UserRole | string): boolean {
  return (RoleGroups.ADMINS as readonly UserRole[]).includes(userRole as UserRole);
}

/**
 * Helper to check if user can manage HR operations
 */
export function canManageHR(userRole: UserRole | string): boolean {
  return (RoleGroups.HR_MANAGERS as readonly UserRole[]).includes(userRole as UserRole);
}
