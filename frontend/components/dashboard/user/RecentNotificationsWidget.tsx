'use client';

import { List as ListIcon, Check, Bell, Info, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface RecentNotificationsWidgetProps {
  data: Notification[];
}

export function RecentNotificationsWidget({ data }: RecentNotificationsWidgetProps) {
  const notifications = data || [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'WARNING':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'ERROR':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'INFO':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <ListIcon className="w-5 h-5 text-slate-600" />
        Son Bildirimler
      </h3>

      {notifications.length > 0 ? (
        <>
          <div className="space-y-3">
            {notifications.slice(0, 5).map(notif => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  notif.read ? 'bg-slate-50' : 'bg-blue-50 border-l-4 border-blue-500'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 font-medium line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
                {!notif.read && (
                  <button className="flex-shrink-0 text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-100 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <Link
            href="/notifications"
            className="block text-center mt-4 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Tümünü Gör →
          </Link>
        </>
      ) : (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Henüz bildirim yok</p>
        </div>
      )}
    </div>
  );
}
