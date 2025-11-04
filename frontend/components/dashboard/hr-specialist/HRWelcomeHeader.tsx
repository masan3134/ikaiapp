'use client';

import { Briefcase, Users, TrendingUp, Plus, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HRWelcomeHeaderProps {
  user: any;
  stats: {
    activePostings: number;
    todayCVs: number;
    thisWeekAnalyses: number;
  } | null;
}

export function HRWelcomeHeader({ user, stats }: HRWelcomeHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-6 mb-6 text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            💼 HR Dashboard
          </h1>
          <p className="text-emerald-100 text-lg mb-3">
            Hoş geldin, {user?.firstName || 'İK Uzmanı'}! İşe alım süreçlerini yönet.
          </p>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>{stats?.activePostings || 0} Aktif İlan</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{stats?.todayCVs || 0} CV Bugün</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{stats?.thisWeekAnalyses || 0} Analiz Bu Hafta</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/notifications')}
            className="relative p-2 hover:bg-emerald-700 rounded-lg transition-colors"
            aria-label="Bildirimler"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={() => router.push('/wizard')}
            className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Hızlı CV Yükle
          </button>
        </div>
      </div>
    </div>
  );
}
