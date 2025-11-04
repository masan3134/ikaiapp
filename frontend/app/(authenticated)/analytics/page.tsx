'use client';

import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';

function AnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Analitik & Raporlar
        </h1>
        <p className="text-slate-600 mt-2">
          Departman analitikleri, metrikler ve detaylı raporlar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI Cards */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Toplam Analiz</h3>
          <p className="text-2xl font-bold text-slate-800">--</p>
          <p className="text-xs text-green-600 mt-1">+12% bu ay</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Aktif Adaylar</h3>
          <p className="text-2xl font-bold text-slate-800">--</p>
          <p className="text-xs text-emerald-600 mt-1">+8% bu hafta</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Hedef Tamamlama</h3>
          <p className="text-2xl font-bold text-slate-800">--</p>
          <p className="text-xs text-purple-600 mt-1">75% ilerleme</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Ortalama Süre</h3>
          <p className="text-2xl font-bold text-slate-800">-- gün</p>
          <p className="text-xs text-orange-600 mt-1">İşe alım süreci</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <BarChart3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Analitik Sayfası Hazırlanıyor</h3>
            <p className="text-sm text-blue-800 mb-3">
              Bu sayfa departman analitikleri, metrikler ve detaylı raporları gösterecek.
              Yakında kullanıma açılacak!
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• İşe alım süreci analitikleri</li>
              <li>• Aday havuzu metrikleri</li>
              <li>• Departman performans raporları</li>
              <li>• Trend analizleri ve tahminler</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(AnalyticsPage, {
  allowedRoles: RoleGroups.ANALYTICS_VIEWERS // MANAGER, ADMIN, SUPER_ADMIN
});
