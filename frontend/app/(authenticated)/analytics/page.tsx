'use client';

import { BarChart3, TrendingUp, Users, Briefcase } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';

function AnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          Organizasyon Analitikleri & Raporlar
        </h1>
        <p className="text-slate-600 mt-2">
          Detaylı metrikler, trendler ve performans raporları
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">İşe Alım Oranı</p>
                <p className="text-2xl font-bold text-slate-800">-</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Bu ay hesaplanıyor...
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Toplam Başvuru</p>
                <p className="text-2xl font-bold text-slate-800">-</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Bu ay hesaplanıyor...
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Aktif Pozisyon</p>
                <p className="text-2xl font-bold text-slate-800">-</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Bu ay hesaplanıyor...
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Detaylı Analitikler
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📊 Organizasyon genelinde işe alım metrikleri, trend analizi ve performans raporları burada görüntülenecek.
          </p>
          <ul className="mt-3 ml-4 space-y-1 text-sm text-blue-700">
            <li>• Departman bazlı işe alım hızı</li>
            <li>• Aylık/yıllık karşılaştırmalı trendler</li>
            <li>• Kaynak bazlı başvuru analizi</li>
            <li>• Mülakat süreç metrikleri</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(AnalyticsPage, {
  allowedRoles: RoleGroups.ADMINS // ADMIN + SUPER_ADMIN only
});
