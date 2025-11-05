"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/services/authService";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import DashboardSkeleton from "./DashboardSkeleton";

// Super Admin widgets
import SuperAdminHeader from "./super-admin/SuperAdminHeader";
import MultiOrgOverviewWidget from "./super-admin/MultiOrgOverviewWidget";
import RevenueOverviewWidget from "./super-admin/RevenueOverviewWidget";
import PlatformAnalyticsWidget from "./super-admin/PlatformAnalyticsWidget";
import PlatformGrowthChart from "./super-admin/PlatformGrowthChart";
import SystemHealthWidget from "./super-admin/SystemHealthWidget";
import OrganizationListWidget from "./super-admin/OrganizationListWidget";
import QueueManagementWidget from "./super-admin/QueueManagementWidget";
import SecurityMonitoringWidget from "./super-admin/SecurityMonitoringWidget";

export const SuperAdminDashboard = () => {
  const { user } = useAuthStore();
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuperAdminDashboard();
  }, []);

  const loadSuperAdminDashboard = async () => {
    try {
      const response = await apiClient.get("/api/v1/dashboard/super-admin");
      setPlatformStats(response.data.data);
    } catch (error) {
      console.error("[SUPER ADMIN DASHBOARD] Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (!platformStats) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-7xl mx-auto text-center py-8">
          <p className="text-slate-600">Dashboard verileri yüklenemedi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-4">
      {/* Header */}
      <SuperAdminHeader platformStats={platformStats.overview} />

      {/* Modern 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Main Metrics */}
        <div className="space-y-6">
          {/* Organizations & Revenue - Stacked */}
          <MultiOrgOverviewWidget data={platformStats.organizations} />
          <RevenueOverviewWidget data={platformStats.revenue} />

          {/* Organization List */}
          <OrganizationListWidget
            data={platformStats.orgList}
            total={platformStats.organizations.total}
          />
        </div>

        {/* Right Column - System & Operations */}
        <div className="space-y-6">
          {/* Platform Analytics */}
          <PlatformAnalyticsWidget data={platformStats.analytics} />

          {/* System Health */}
          <SystemHealthWidget data={platformStats.systemHealth} />

          {/* Queue & Security - Stacked */}
          <QueueManagementWidget data={platformStats.queues} />
          <SecurityMonitoringWidget data={platformStats.security} />
        </div>
      </div>

      {/* Full Width Chart at Bottom */}
      <div className="mt-6">
        <PlatformGrowthChart data={platformStats.growth} />
      </div>
    </div>
  );
};
