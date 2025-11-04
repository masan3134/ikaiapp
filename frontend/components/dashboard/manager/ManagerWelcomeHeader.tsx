'use client';

import { Users, Briefcase, TrendingUp, DollarSign, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ManagerWelcomeHeaderProps {
  user: any;
  stats: {
    teamSize: number;
    activeProjects: number;
    performance: number;
    budgetUsed: number;
  } | null;
}

export function ManagerWelcomeHeader({ user, stats }: ManagerWelcomeHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            📊 Manager Dashboard
          </h1>
          <p className="text-blue-100 text-lg mb-3">
            Hoş geldin, {user?.firstName || 'Manager'}! Takımını yönet ve performansı izle.
          </p>
          <div className="flex gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2 bg-blue-700/30 px-3 py-1 rounded-lg">
              <Users className="w-4 h-4" />
              <span>{stats?.teamSize || 0} Kişi Takım</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-700/30 px-3 py-1 rounded-lg">
              <Briefcase className="w-4 h-4" />
              <span>{stats?.activeProjects || 0} Aktif Proje</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-700/30 px-3 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              <span>Performans: {stats?.performance || 0}%</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-700/30 px-3 py-1 rounded-lg">
              <DollarSign className="w-4 h-4" />
              <span>Bütçe: {stats?.budgetUsed || 0}% kullanıldı</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/notifications')}
            className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors"
            aria-label="Bildirimler"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
