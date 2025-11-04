'use client';

import { useState, useEffect } from 'react';
import { getNotifications, markAsRead as markAsReadAPI, markAllAsRead as markAllAsReadAPI, type Notification } from '@/lib/api/notifications';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  CheckCheck, Inbox, ArrowRight, Clock, CheckCircle2,
  AlertCircle, Users, FileText, Calendar, Sparkles, Bell
} from 'lucide-react';

/**
 * NotificationDropdown - System Style
 * Matches IKAI design system (Card + Lucide + Light theme)
 */

interface NotificationDropdownProps {
  onClose?: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications({ limit: 10 });
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadAPI(id);
      await loadNotifications();
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadAPI();
      await loadNotifications();
      if (onClose) onClose();
    } catch (err) {
      console.error('Mark all error:', err);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  const getIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      ANALYSIS_STARTED: Clock,
      ANALYSIS_COMPLETED: CheckCircle2,
      ANALYSIS_FAILED: AlertCircle,
      CANDIDATE_UPLOADED: Users,
      OFFER_CREATED: FileText,
      OFFER_SENT: FileText,
      OFFER_ACCEPTED: CheckCircle2,
      OFFER_REJECTED: AlertCircle,
      INTERVIEW_SCHEDULED: Calendar,
      INTERVIEW_COMPLETED: CheckCircle2,
    };
    return iconMap[type] || Bell;
  };

  const getColor = (type: string) => {
    if (type.includes('COMPLETED') || type.includes('ACCEPTED')) return 'green';
    if (type.includes('FAILED') || type.includes('REJECTED')) return 'red';
    if (type.includes('STARTED') || type.includes('SCHEDULED')) return 'blue';
    return 'gray';
  };

  return (
    <div className="w-96 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <h3 className="text-base font-bold">Bildirimler</h3>
          </div>

          {unreadNotifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1"
            >
              <CheckCheck size={14} />
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[450px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Yükleniyor...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-3">
              <Inbox size={28} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">Bildirim Yok</p>
            <p className="text-xs text-gray-500 mt-1">Yeni bildirimler burada görünecek</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const color = getColor(notification.type);
              const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: tr
              });

              const bgClasses = {
                green: 'bg-green-100 text-green-600',
                red: 'bg-red-100 text-red-600',
                blue: 'bg-blue-100 text-blue-600',
                gray: 'bg-gray-100 text-gray-600'
              }[color];

              return (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  className={`px-5 py-4 border-b border-gray-100 transition-all cursor-pointer hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50/50' : 'bg-white'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${bgClasses}`}>
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium mb-1 ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>

                      <p className={`text-xs mb-2 line-clamp-2 ${
                        !notification.read ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={11} />
                        <span>{timeAgo}</span>
                      </div>
                    </div>

                    {!notification.read && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
          <Link
            href="/notifications"
            onClick={onClose}
            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Tümünü Görüntüle
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
