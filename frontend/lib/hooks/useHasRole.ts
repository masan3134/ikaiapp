'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { UserRole, isRoleAllowed, AllowedRoles } from '@/lib/constants/roles';

/**
 * Hook to check if current user has required role(s)
 * @param allowedRoles - Array of allowed roles
 * @returns boolean - true if user has one of the allowed roles
 */
export function useHasRole(allowedRoles: AllowedRoles): boolean {
  const { user } = useAuthStore();

  if (!user || !user.role) {
    return false;
  }

  return isRoleAllowed(user.role, allowedRoles);
}

/**
 * Hook to check if current user is admin
 * @returns boolean
 */
export function useIsAdmin(): boolean {
  const { user } = useAuthStore();

  if (!user || !user.role) {
    return false;
  }

  return user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
}

/**
 * Hook to check if current user can manage HR operations
 * @returns boolean
 */
export function useCanManageHR(): boolean {
  const { user } = useAuthStore();

  if (!user || !user.role) {
    return false;
  }

  return [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.HR_SPECIALIST
  ].includes(user.role as UserRole);
}

/**
 * Hook to get current user's role
 * @returns UserRole | null
 */
export function useUserRole(): UserRole | null {
  const { user } = useAuthStore();
  return (user?.role as UserRole) || null;
}
