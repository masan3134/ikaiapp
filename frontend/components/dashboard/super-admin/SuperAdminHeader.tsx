"use client";

import Link from "next/link";
import { Zap, Settings, Bell } from "lucide-react";

interface SuperAdminHeaderProps {
  platformStats: {
    totalOrganizations: number;
    monthlyRevenue: number;
    totalUsers: number;
    uptime: number;
    activeAnalyses: number;
  };
}

export default function SuperAdminHeader({
  platformStats,
}: SuperAdminHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-rose-600 to-red-800 rounded-xl p-6 mb-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-900/30 rounded-full blur-3xl" />

      <div className="relative flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center border border-white/30">
              <Zap className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Platform Control Center</h1>
              <p className="text-rose-100 text-sm">
                System-wide administration & monitoring
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
              <p className="text-xs text-rose-200">Toplam Organizasyon</p>
              <p className="text-2xl font-bold">
                {platformStats.totalOrganizations}
              </p>
            </div>
            <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
              <p className="text-xs text-rose-200">Aylık Gelir (MRR)</p>
              <p className="text-2xl font-bold">
                ₺{platformStats.monthlyRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
              <p className="text-xs text-rose-200">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold">{platformStats.totalUsers}</p>
            </div>
            <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
              <p className="text-xs text-rose-200">System Uptime</p>
              <p className="text-2xl font-bold">{platformStats.uptime}%</p>
            </div>
            <div className="bg-red-700/40 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
              <p className="text-xs text-rose-200">Aktif Analizler</p>
              <p className="text-2xl font-bold">
                {platformStats.activeAnalyses}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur transition-colors border border-white/30">
            <Bell className="w-6 h-6" />
          </button>
          <Link
            href="/super-admin"
            className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur transition-colors border border-white/30"
          >
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
