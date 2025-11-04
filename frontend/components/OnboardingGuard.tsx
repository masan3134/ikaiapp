"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOrganization } from "@/contexts/OrganizationContext";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization, loading } = useOrganization();

  useEffect(() => {
    // Skip guard on onboarding page itself
    if (pathname === "/onboarding") return;

    // If org loaded and onboarding not completed, redirect
    if (!loading && organization && !organization.onboardingCompleted) {
      router.push("/onboarding");
    }
  }, [organization, loading, pathname, router]);

  // Show loading or nothing while checking
  if (
    loading ||
    (organization &&
      !organization.onboardingCompleted &&
      pathname !== "/onboarding")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
