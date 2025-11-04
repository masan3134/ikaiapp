"use client";

import { useState } from "react";
import { FileText, Download, Filter, TrendingUp, Users, Briefcase } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";

function AnalyticsReportsPage() {
  const [dateRange, setDateRange] = useState("last_30_days");

  const reportTypes = [
    {
      id: "hiring_funnel",
      title: "İşe Alım Hunisi",
      description: "Başvurudan işe alıma kadar süreç analizi",
      icon: TrendingUp,
      color: "blue",
    },
    {
      id: "team_performance",
      title: "Ekip Performansı",
      description: "Ekip bazında işe alım metrikleri",
      icon: Users,
      color: "emerald",
    },
    {
      id: "job_posting_analysis",
      title: "İlan Analizi",
      description: "İlan başarı oranları ve istatistikler",
      icon: Briefcase,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
          <p className="text-gray-600 mt-1">Detaylı analiz raporlarını görüntüleyin ve indirin</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="last_7_days">Son 7 Gün</option>
            <option value="last_30_days">Son 30 Gün</option>
            <option value="last_90_days">Son 90 Gün</option>
            <option value="last_year">Son 1 Yıl</option>
          </select>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const colorClasses = {
            blue: "bg-blue-100 text-blue-600",
            emerald: "bg-emerald-100 text-emerald-600",
            purple: "bg-purple-100 text-purple-600",
          }[report.color];

          return (
            <div
              key={report.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Download className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Raporu Görüntüle
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Özet İstatistikler</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">142</div>
            <div className="text-sm text-gray-600">Toplam Başvuru</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">38</div>
            <div className="text-sm text-gray-600">Mülakat</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">Teklif</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-sm text-gray-600">İşe Alım</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(AnalyticsReportsPage, RoleGroups.MANAGER_AND_ABOVE);
