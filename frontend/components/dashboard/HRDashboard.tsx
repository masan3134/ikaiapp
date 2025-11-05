"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import apiClient from "@/lib/utils/apiClient";

// HR Specialist Widgets
import { HRWelcomeHeader } from "./hr-specialist/HRWelcomeHeader";
import { ActiveJobPostingsWidget } from "./hr-specialist/ActiveJobPostingsWidget";
import { CVAnalyticsWidget } from "./hr-specialist/CVAnalyticsWidget";
import { RecentAnalysesWidget } from "./hr-specialist/RecentAnalysesWidget";
import { HiringPipelineWidget } from "./hr-specialist/HiringPipelineWidget";
import { QuickActionsWidget } from "./hr-specialist/QuickActionsWidget";
import { PendingInterviewsWidget } from "./hr-specialist/PendingInterviewsWidget";
import { MonthlyStatsWidget } from "./hr-specialist/MonthlyStatsWidget";
import { HRDashboardSkeleton } from "./hr-specialist/HRDashboardSkeleton";

export const HRDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHRDashboard();
  }, []);

  const loadHRDashboard = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/v1/dashboard/hr-specialist");

      // Axios automatically throws on non-2xx status codes
      // response.data contains the JSON data directly
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      console.error("[HR DASHBOARD] Load error:", err);
      setError("Dashboard verileri yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <HRDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={loadHRDashboard}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Welcome Header */}
      <HRWelcomeHeader user={user} stats={stats?.overview} />

      {/* Top Row: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ActiveJobPostingsWidget data={stats?.jobPostings} />
        <CVAnalyticsWidget data={stats?.cvAnalytics} />
        <RecentAnalysesWidget data={stats?.recentAnalyses} />
      </div>

      {/* Middle Row: Pipeline (2 cols) + Quick Actions (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <HiringPipelineWidget data={stats?.pipeline} />
        </div>
        <QuickActionsWidget />
      </div>

      {/* Bottom Row: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PendingInterviewsWidget data={stats?.interviews} />
        <MonthlyStatsWidget data={stats?.monthlyStats} />
      </div>
    </div>
  );
};
