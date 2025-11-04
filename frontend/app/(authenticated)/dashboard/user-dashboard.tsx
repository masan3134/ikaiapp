"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import {
  WelcomeHeader,
  ProfileCompletionWidget,
  NotificationCenterWidget,
  ActivityTodayWidget,
  RecentNotificationsWidget,
  QuickActionsWidget,
  ActivityTimelineChart,
  SystemStatusWidget,
} from "@/components/dashboard/user";
import apiClient from "@/lib/utils/apiClient";

interface DashboardStats {
  profile: {
    completion: number;
    missingFields: number;
  };
  notifications: {
    unread: number;
    latest: any;
  };
  activity: {
    loginTime: string;
    onlineTime: string;
    pageViews: number;
  };
  recentNotifications: any[];
  activityTimeline: any[];
}

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.get("/api/v1/dashboard/user");

      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.message || "Veri alınamadı");
      }
    } catch (error) {
      console.error("[USER DASHBOARD] Load error:", error);
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Hata</div>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Welcome Header */}
      <WelcomeHeader user={user} />

      {/* Main Grid - Top 3 widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ProfileCompletionWidget data={stats.profile} />
        <NotificationCenterWidget data={stats.notifications} />
        <ActivityTodayWidget data={stats.activity} />
      </div>

      {/* Middle Section - Notifications List + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RecentNotificationsWidget data={stats.recentNotifications} />
        </div>
        <QuickActionsWidget />
      </div>

      {/* Bottom Section - Activity Timeline + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTimelineChart data={stats.activityTimeline} />
        </div>
        <SystemStatusWidget />
      </div>
    </div>
  );
}
