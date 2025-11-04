'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

// Manager Widgets
import { ManagerWelcomeHeader } from './manager/ManagerWelcomeHeader';
import { TeamPerformanceWidget } from './manager/TeamPerformanceWidget';
import { DepartmentAnalyticsWidget } from './manager/DepartmentAnalyticsWidget';
import { ActionItemsWidget } from './manager/ActionItemsWidget';
import { TeamPerformanceTrendWidget } from './manager/TeamPerformanceTrendWidget';
import { ApprovalQueueWidget } from './manager/ApprovalQueueWidget';
import { InterviewScheduleWidget } from './manager/InterviewScheduleWidget';
import { MonthlyKPIsWidget } from './manager/MonthlyKPIsWidget';

export const ManagerDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadManagerDashboard();
  }, []);

  const loadManagerDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/dashboard/manager', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load dashboard');
      }

      const data = await response.json();
      setStats(data.data);
      setError(null);
    } catch (err) {
      console.error('[MANAGER DASHBOARD] Load error:', err);
      setError('Dashboard verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <LoadingSkeleton variant="grid" rows={3} columns={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={loadManagerDashboard}
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
      <ManagerWelcomeHeader user={user} stats={stats?.overview} />

      {/* Top Row: Team Performance, Dept Analytics, Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TeamPerformanceWidget data={stats?.teamPerformance} />
        <DepartmentAnalyticsWidget data={stats?.departmentAnalytics} />
        <ActionItemsWidget data={stats?.actionItems} />
      </div>

      {/* Middle Row: Performance Trend (2 cols) + Approval Queue (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TeamPerformanceTrendWidget data={stats?.performanceTrend} />
        </div>
        <ApprovalQueueWidget data={stats?.approvalQueue} />
      </div>

      {/* Bottom Row: Interview Schedule, Monthly KPIs, Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InterviewScheduleWidget data={stats?.interviews} />
        <MonthlyKPIsWidget data={stats?.kpis} />
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
            💰 Bütçe Özeti
          </h3>
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">Bütçe takibi yakında eklenecek</p>
          </div>
        </div>
      </div>
    </div>
  );
};
