"use client";

import { BarChart3, TrendingUp, Users, Database } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";

function SuperAdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistem Analitikleri</h1>
        <p className="text-gray-600 mt-1">Platform kullanım metrikleri ve raporları</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Toplam Organizasyon", value: "156", icon: Database, color: "blue" },
          { label: "Aktif Kullanıcı", value: "1,234", icon: Users, color: "green" },
          { label: "API Çağrısı/Gün", value: "45.2K", icon: BarChart3, color: "purple" },
          { label: "Büyüme Oranı", value: "+12%", icon: TrendingUp, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kullanım Grafikleri</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Grafik yüklenecek...
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SuperAdminAnalyticsPage, ["SUPER_ADMIN"]);
