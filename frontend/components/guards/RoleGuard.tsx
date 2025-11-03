'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useHasRole } from '@/lib/hooks/useHasRole';
import { AllowedRoles } from '@/lib/constants/roles';

interface RoleGuardProps {
  allowedRoles: AllowedRoles;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * RoleGuard Component
 * Conditionally renders children based on user's role
 *
 * @param allowedRoles - Array of roles that can see the content
 * @param children - Content to render if user has permission
 * @param fallback - Optional fallback UI if user doesn't have permission
 * @param redirectTo - Optional path to redirect if user doesn't have permission
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback,
  redirectTo
}: RoleGuardProps) {
  const hasRole = useHasRole(allowedRoles);
  const router = useRouter();

  React.useEffect(() => {
    if (!hasRole && redirectTo) {
      router.push(redirectTo);
    }
  }, [hasRole, redirectTo, router]);

  if (!hasRole) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erişim Engellendi</h1>
          <p className="text-gray-600 mb-6">
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Simple role check component (just hide/show, no fallback UI)
 */
export function RoleCheck({
  allowedRoles,
  children
}: {
  allowedRoles: AllowedRoles;
  children: React.ReactNode;
}) {
  const hasRole = useHasRole(allowedRoles);

  if (!hasRole) {
    return null;
  }

  return <>{children}</>;
}
