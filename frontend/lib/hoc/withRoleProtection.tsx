"use client";

import React from "react";
import { RoleGuard } from "@/components/guards/RoleGuard";
import { AllowedRoles } from "@/lib/constants/roles";

interface WithRoleProtectionOptions {
  allowedRoles: AllowedRoles;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Higher-Order Component to add role-based protection to pages
 *
 * Usage:
 * ```tsx
 * const ProtectedPage = withRoleProtection(MyPage, {
 *   allowedRoles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
 * });
 * export default ProtectedPage;
 * ```
 *
 * @param Component - Page component to protect
 * @param options - Protection options
 */
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: WithRoleProtectionOptions
) {
  const ProtectedComponent = (props: P) => {
    return (
      <RoleGuard
        allowedRoles={options.allowedRoles}
        redirectTo={options.redirectTo}
        fallback={options.fallback}
      >
        <Component {...props} />
      </RoleGuard>
    );
  };

  ProtectedComponent.displayName = `withRoleProtection(${Component.displayName || Component.name || "Component"})`;

  return ProtectedComponent;
}
