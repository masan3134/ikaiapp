'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import {
  User, Bell, Activity, Zap, TrendingUp,
  Server, Check, ChevronRight, List as ListIcon
} from 'lucide-react';

interface DashboardStats {
  profile: {
    completion: number;
    missingFields: number;
  };
  notifications: {
    unread: number;
    latest: any;
  };
  activity: {
    loginTime: string;
    onlineTime: string;
    pageViews: number;
  };
  recentNotifications: any[];
  activityTimeline: any[];
}

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/dashboard/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Dashboard verileri yüklenemedi');
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.message || 'Veri alınamadı');
      }
    } catch (error) {
      console.error('[USER DASHBOARD] Load error:', error);
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Hata</div>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Welcome Header */}
      <WelcomeHeader user={user} />

      {/* Main Grid - Top 3 widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ProfileCompletionWidget data={stats.profile} />
        <NotificationCenterWidget data={stats.notifications} />
        <ActivityTodayWidget data={stats.activity} />
      </div>

      {/* Middle Section - Notifications List + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RecentNotificationsWidget data={stats.recentNotifications} />
        </div>
        <QuickActionsWidget />
      </div>

      {/* Bottom Section - Activity Timeline + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTimelineChart data={stats.activityTimeline} />
        </div>
        <SystemStatusWidget />
      </div>
    </div>
  );
}

// Temporary placeholder components (will be replaced with actual widgets in Task 2)
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 animate-pulse">
      <div className="bg-slate-200 rounded-xl h-24 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-200 rounded-xl h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-slate-200 rounded-xl h-64" />
        <div className="bg-slate-200 rounded-xl h-64" />
      </div>
    </div>
  );
}

function WelcomeHeader({ user }: any) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    return currentTime.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl p-6 mb-6 text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            👋 Hoş geldin, {user?.firstName || 'Kullanıcı'}!
          </h1>
          <p className="text-slate-200">
            {formatDate()} • {formatTime()}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileCompletionWidget({ data }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-slate-600" />
        Profil Tamamlanma
      </h3>
      <div className="text-center">
        <div className="text-4xl font-bold text-slate-800 mb-2">
          {data?.completion || 0}%
        </div>
        <p className="text-sm text-slate-600">
          {data?.missingFields || 0} alan eksik
        </p>
      </div>
    </div>
  );
}

function NotificationCenterWidget({ data }: any) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-blue-600" />
        Bildirimler
      </h3>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
          <span className="text-2xl font-bold text-blue-600">{data?.unread || 0}</span>
        </div>
        <p className="text-sm text-slate-600">
          Okunmamış bildirim
        </p>
      </div>
    </div>
  );
}

function ActivityTodayWidget({ data }: any) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-600" />
        Bugünkü Aktivite
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Giriş</span>
          <span className="text-sm font-semibold text-slate-800">{data?.loginTime || '--:--'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Süre</span>
          <span className="text-sm font-semibold text-slate-800">{data?.onlineTime || '0dk'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Ziyaret</span>
          <span className="text-sm font-semibold text-slate-800">{data?.pageViews || 0} sayfa</span>
        </div>
      </div>
    </div>
  );
}

function RecentNotificationsWidget({ data }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <ListIcon className="w-5 h-5 text-slate-600" />
        Son Bildirimler
      </h3>
      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.slice(0, 5).map((notif: any) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                notif.read ? 'bg-slate-50' : 'bg-blue-50 border-l-4 border-blue-500'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 font-medium">
                  {notif.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(notif.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-8">Henüz bildirim yok</p>
      )}
    </div>
  );
}

function QuickActionsWidget() {
  const actions = [
    { name: 'Profilim', path: '/settings/profile', icon: <User className="w-5 h-5 text-slate-600" /> },
    { name: 'Ayarlar', path: '/settings', icon: <Server className="w-5 h-5 text-slate-600" /> },
    { name: 'Bildirimler', path: '/notifications', icon: <Bell className="w-5 h-5 text-slate-600" /> },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-600" />
        Hızlı Erişim
      </h3>
      <div className="space-y-2">
        {actions.map(action => (
          <a
            key={action.path}
            href={action.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              {action.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{action.name}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </a>
        ))}
      </div>
    </div>
  );
}

function ActivityTimelineChart({ data }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-slate-600" />
        Aktivite Grafiği (Son 7 Gün)
      </h3>
      <div className="h-48 flex items-center justify-center text-slate-400">
        <p>Grafik verisi yükleniyor...</p>
      </div>
    </div>
  );
}

function SystemStatusWidget() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Server className="w-5 h-5 text-slate-600" />
        Sistem Durumu
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Backend</span>
          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Çalışıyor
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Veritabanı</span>
          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Bağlı
          </span>
        </div>
      </div>
    </div>
  );
}
