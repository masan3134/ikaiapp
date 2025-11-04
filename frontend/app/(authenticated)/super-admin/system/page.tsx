"use client";

import { Server, Cpu, HardDrive, Activity, Zap } from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";

function SuperAdminSystemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistem Sağlığı</h1>
        <p className="text-gray-600 mt-1">Sunucu durumu ve performans metrikleri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CPU Kullanımı", value: "45%", icon: Cpu, color: "blue", status: "normal" },
          { label: "RAM Kullanımı", value: "62%", icon: Server, color: "emerald", status: "normal" },
          { label: "Disk Kullanımı", value: "38%", icon: HardDrive, color: "purple", status: "normal" },
          { label: "Uptime", value: "99.9%", icon: Activity, color: "green", status: "good" },
        ].map((metric, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${metric.color}-100 rounded-lg`}>
                <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Server className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Servisler</h2>
          </div>
          <div className="space-y-3">
            {["Backend API", "Frontend", "PostgreSQL", "Redis", "Milvus"].map((service) => (
              <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{service}</span>
                <span className="flex items-center gap-2 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Çalışıyor
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Zap className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Performans</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Ortalama Response Time</span>
              <span className="text-sm font-medium text-gray-900">156ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">İstek/Saniye</span>
              <span className="text-sm font-medium text-gray-900">342</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Hata Oranı</span>
              <span className="text-sm font-medium text-gray-900">0.02%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(SuperAdminSystemPage, ["SUPER_ADMIN"]);
