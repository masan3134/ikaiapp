import { UserRole } from "@/lib/constants/roles";

/**
 * RBAC Helper Utilities
 * Centralized permission checking for UI elements
 */

// ============================================
// JOB POSTING PERMISSIONS
// ============================================

/**
 * Check if role can create job postings
 */
export const canCreateJobPosting = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

/**
 * Check if role can edit job postings
 */
export const canEditJobPosting = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

/**
 * Check if role can delete job postings
 */
export const canDeleteJobPosting = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
};

/**
 * Check if role can view job postings
 */
export const canViewJobPostings = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

// ============================================
// CANDIDATE PERMISSIONS
// ============================================

export const canCreateCandidate = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

export const canEditCandidate = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

export const canDeleteCandidate = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
};

export const canViewCandidates = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

// ============================================
// ANALYSIS PERMISSIONS
// ============================================

export const canCreateAnalysis = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

export const canViewAnalyses = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

export const canDeleteAnalysis = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
};

// ============================================
// OFFER PERMISSIONS
// ============================================

export const canCreateOffer = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role);
};

export const canEditOffer = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role);
};

export const canDeleteOffer = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role); // MANAGER can delete offers
};

export const canViewOffers = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

// ============================================
// INTERVIEW PERMISSIONS
// ============================================

export const canScheduleInterview = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

export const canEditInterview = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

export const canDeleteInterview = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role); // MANAGER can delete interviews
};

export const canViewInterviews = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER", "HR_SPECIALIST"].includes(role);
};

// ============================================
// TEAM MANAGEMENT PERMISSIONS
// ============================================

export const canInviteUsers = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
};

export const canManageTeam = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role);
};

export const canViewTeam = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role);
};

// ============================================
// SETTINGS & ORGANIZATION PERMISSIONS
// ============================================

export const canViewOrganizationSettings = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
};

export const canEditOrganizationSettings = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
};

export const canViewUsageStats = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
};

// ============================================
// ANALYTICS & REPORTS PERMISSIONS
// ============================================

export const canViewAnalytics = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role);
};

export const canExportReports = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role);
};

// ============================================
// DASHBOARD PERMISSIONS
// ============================================

export const canViewDashboard = (role?: UserRole): boolean => {
  // All roles can view dashboard (but content differs)
  return !!role;
};

export const canViewTeamPerformance = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role);
};

export const canViewPersonalStats = (role?: UserRole): boolean => {
  // All roles can view their own stats
  return !!role;
};

// ============================================
// GENERIC ROLE CHECKER (for complex cases)
// ============================================

/**
 * Check if user has one of the specified roles
 * @param userRole - Current user's role
 * @param allowedRoles - Array of allowed roles
 */
export const hasAnyRole = (
  userRole?: UserRole,
  allowedRoles: UserRole[] = []
): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Check if user is SUPER_ADMIN
 */
export const isSuperAdmin = (role?: UserRole): boolean => {
  return role === "SUPER_ADMIN";
};

/**
 * Check if user is ADMIN or higher
 */
export const isAdminOrHigher = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
};

/**
 * Check if user is MANAGER or higher
 */
export const isManagerOrHigher = (role?: UserRole): boolean => {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(role);
};
