'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Briefcase, Clock, Target } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';

interface AnalyticsData {
  totalAnalyses: number;
  activeCandidates: number;
  activeJobPostings: number;
  avgProcessDays: number;
  analysesGrowth: number;
  candidatesGrowth: number;
}

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await fetch('/api/v1/analytics/summary');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('[ANALYTICS] Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          Organizasyon Analitikleri
        </h1>
        <p className="text-slate-600 mt-2">
          Organizasyonunuzun işe alım süreç metrikleri ve performans göstergeleri
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Analyses */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Toplam Analiz</h3>
          <p className="text-2xl font-bold text-slate-800">
            {analytics?.totalAnalyses || 0}
          </p>
          {analytics && analytics.analysesGrowth !== 0 && (
            <p className={`text-xs mt-1 ${analytics.analysesGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.analysesGrowth > 0 ? '+' : ''}{analytics.analysesGrowth}% bu ay
            </p>
          )}
        </div>

        {/* Active Candidates */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Aktif Adaylar</h3>
          <p className="text-2xl font-bold text-slate-800">
            {analytics?.activeCandidates || 0}
          </p>
          {analytics && analytics.candidatesGrowth !== 0 && (
            <p className={`text-xs mt-1 ${analytics.candidatesGrowth > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {analytics.candidatesGrowth > 0 ? '+' : ''}{analytics.candidatesGrowth}% bu hafta
            </p>
          )}
        </div>

        {/* Active Job Postings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Aktif İlan</h3>
          <p className="text-2xl font-bold text-slate-800">
            {analytics?.activeJobPostings || 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">Yayında</p>
        </div>

        {/* Average Process Days */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Ortalama Süre</h3>
          <p className="text-2xl font-bold text-slate-800">
            {analytics?.avgProcessDays || 0} gün
          </p>
          <p className="text-xs text-slate-500 mt-1">İşe alım süreci</p>
        </div>
      </div>

      {/* Additional Analytics Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metrics Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            İşe Alım Metrikleri
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Bu Ay Yapılan Analiz</span>
              <span className="font-semibold text-slate-800">{analytics?.totalAnalyses || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Aktif Aday Havuzu</span>
              <span className="font-semibold text-slate-800">{analytics?.activeCandidates || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Açık Pozisyon</span>
              <span className="font-semibold text-slate-800">{analytics?.activeJobPostings || 0}</span>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Performans Göstergeleri
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm text-slate-600">Analiz Büyümesi</span>
              <span className={`font-semibold ${
                (analytics?.analysesGrowth || 0) > 0 ? 'text-emerald-600' : 'text-slate-600'
              }`}>
                {analytics?.analysesGrowth || 0 > 0 ? '+' : ''}{analytics?.analysesGrowth || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-slate-600">Aday Büyümesi</span>
              <span className={`font-semibold ${
                (analytics?.candidatesGrowth || 0) > 0 ? 'text-blue-600' : 'text-slate-600'
              }`}>
                {analytics?.candidatesGrowth || 0 > 0 ? '+' : ''}{analytics?.candidatesGrowth || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-slate-600">Ortalama İşlem Süresi</span>
              <span className="font-semibold text-purple-600">{analytics?.avgProcessDays || 0} gün</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(AnalyticsPage, {
  allowedRoles: RoleGroups.ADMINS // ADMIN + SUPER_ADMIN only
});
