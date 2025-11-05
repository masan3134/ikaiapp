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
 * Usage (both formats supported):
 * ```tsx
 * // Option 1: Array (shorthand)
 * export default withRoleProtection(MyPage, ["ADMIN", "SUPER_ADMIN"]);
 *
 * // Option 2: Object (with options)
 * export default withRoleProtection(MyPage, {
 *   allowedRoles: ["ADMIN", "SUPER_ADMIN"],
 *   redirectTo: "/dashboard",
 *   fallback: <Loading />
 * });
 * ```
 *
 * @param Component - Page component to protect
 * @param optionsOrRoles - Protection options object OR array of allowed roles
 */
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  optionsOrRoles: WithRoleProtectionOptions | AllowedRoles
) {
  // Normalize input: if array, convert to options object
  const options: WithRoleProtectionOptions = Array.isArray(optionsOrRoles)
    ? { allowedRoles: optionsOrRoles }
    : optionsOrRoles;

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
