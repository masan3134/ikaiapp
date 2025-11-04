"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useOrganization } from "@/contexts/OrganizationContext";
import DashboardSkeleton from "./DashboardSkeleton";
import apiClient from "@/lib/utils/apiClient";

// Import admin widgets
import AdminWelcomeHeader from "./admin/AdminWelcomeHeader";
import OrganizationStatsWidget from "./admin/OrganizationStatsWidget";
import UserManagementWidget from "./admin/UserManagementWidget";
import BillingOverviewWidget from "./admin/BillingOverviewWidget";
import UsageMetricsChart from "./admin/UsageMetricsChart";
import QuickSettingsWidget from "./admin/QuickSettingsWidget";
import TeamActivityWidget from "./admin/TeamActivityWidget";
import SecurityOverviewWidget from "./admin/SecurityOverviewWidget";
import OrganizationHealthWidget from "./admin/OrganizationHealthWidget";

interface AdminDashboardStats {
  orgStats: {
    totalUsers: number;
    activeToday: number;
    plan: string;
  };
  userManagement: {
    totalUsers: number;
    activeToday: number;
  };
  billing: {
    monthlyAmount: number;
    nextBillingDate: string;
  };
  usageTrend: Array<{
    date: string;
    analyses: number;
    cvs: number;
    activeUsers: number;
  }>;
  teamActivity: Array<{
    id: string;
    type: string;
    user: {
      firstName: string;
      lastName: string;
    };
    action: string;
    createdAt: string;
  }>;
  security: {
    twoFactorUsers: number;
    activeSessions: number;
    lastSecurityEvent: string | null;
    complianceScore: number;
  };
  health: {
    score: number;
    factors: Array<{
      name: string;
      score: number;
      status: "good" | "warning" | "critical";
    }>;
  };
}

export function AdminDashboard() {
  const { user } = useAuthStore();
  const { organization, usage } = useOrganization();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const loadAdminDashboard = async () => {
    try {
      const response = await apiClient.get("/api/v1/dashboard/admin");
      const data = response.data; // axios returns data directly, no .json() needed

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("[ADMIN DASHBOARD] Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !organization || !usage) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Welcome Header */}
      <AdminWelcomeHeader
        user={user}
        organization={organization}
        usage={usage}
      />

      {/* Top Row: Org Stats, User Management, Billing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <OrganizationStatsWidget
          data={
            stats?.orgStats || {
              totalUsers: organization.totalUsers || 0,
              activeToday: 0,
              plan: organization.plan || "FREE",
            }
          }
          organization={organization}
        />
        <UserManagementWidget
          data={
            stats?.userManagement || {
              totalUsers: organization.totalUsers || 0,
              activeToday: 0,
            }
          }
        />
        <BillingOverviewWidget
          organization={organization}
          usage={usage}
          billing={
            stats?.billing || {
              monthlyAmount: 0,
              nextBillingDate: new Date().toISOString(),
            }
          }
        />
      </div>

      {/* Middle Row: Usage Chart + Quick Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <UsageMetricsChart data={stats?.usageTrend || []} usage={usage} />
        </div>
        <QuickSettingsWidget />
      </div>

      {/* Bottom Row: Team Activity, Security, Org Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TeamActivityWidget data={stats?.teamActivity || []} />
        <SecurityOverviewWidget
          data={
            stats?.security || {
              twoFactorUsers: 0,
              activeSessions: 0,
              lastSecurityEvent: null,
              complianceScore: 0,
            }
          }
          organization={organization}
        />
        <OrganizationHealthWidget
          data={
            stats?.health || {
              score: 0,
              factors: [],
            }
          }
        />
      </div>
    </div>
  );
}
