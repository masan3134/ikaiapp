'use client';

import { useState, useEffect } from 'react';
import { getNotifications, markAsRead as markAsReadAPI, markAllAsRead as markAllAsReadAPI, type Notification } from '@/lib/api/notifications';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Bell, BellOff, CheckCircle2, Filter, Inbox, Settings,
  Clock, CheckCheck, AlertCircle, FileText, Users, Calendar,
  Sparkles, Briefcase, AlertTriangle
} from 'lucide-react';

/**
 * Notification Center Page (System Style)
 * Matches existing IKAI design system
 */

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadNotifications();
  }, [readFilter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications({
        read: readFilter === 'all' ? undefined : readFilter === 'read',
        limit: 50
      });
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
    } catch (err) {
      console.error('Mark all error:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  const getIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      ANALYSIS_STARTED: Clock,
      ANALYSIS_COMPLETED: CheckCircle2,
      ANALYSIS_FAILED: AlertCircle,
      CANDIDATE_UPLOADED: Users,
      OFFER_CREATED: FileText,
      OFFER_SENT: Briefcase,
      OFFER_ACCEPTED: CheckCircle2,
      OFFER_REJECTED: AlertCircle,
      INTERVIEW_SCHEDULED: Calendar,
      INTERVIEW_COMPLETED: CheckCircle2,
      USAGE_LIMIT_WARNING: AlertTriangle,
      USAGE_LIMIT_REACHED: AlertTriangle,
    };
    return iconMap[type] || Bell;
  };

  const getColor = (type: string) => {
    if (type.includes('COMPLETED') || type.includes('ACCEPTED')) return 'green';
    if (type.includes('FAILED') || type.includes('REJECTED')) return 'red';
    if (type.includes('WARNING')) return 'orange';
    if (type.includes('STARTED') || type.includes('SCHEDULED')) return 'blue';
    return 'gray';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm border-2 border-blue-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-lg shadow-md">
              <Bell className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Toplam Bildirim</p>
              <p className="text-3xl font-bold text-blue-900">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl shadow-sm border-2 border-orange-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-lg shadow-md">
              <BellOff className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-700">Okunmamış</p>
              <p className="text-3xl font-bold text-orange-900">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl shadow-sm border-2 border-green-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-lg shadow-md">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">Okunmuş</p>
              <p className="text-3xl font-bold text-green-900">{readCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setReadFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              readFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-300'
            }`}
          >
            Tümü ({notifications.length})
          </button>
          <button
            onClick={() => setReadFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              readFilter === 'unread'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-300'
            }`}
          >
            Okunmamış ({unreadCount})
          </button>
          <button
            onClick={() => setReadFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              readFilter === 'read'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-300'
            }`}
          >
            Okunmuş ({readCount})
          </button>
        </div>

        <div className="ml-auto flex gap-3">
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="secondary">
              <CheckCheck size={16} />
              Tümünü Okundu İşaretle
            </Button>
          )}
          <Link href="/settings/notifications">
            <Button variant="outline">
              <Settings size={16} />
              Tercihler
            </Button>
          </Link>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Inbox size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim Yok</h3>
            <p className="text-gray-600">
              {readFilter === 'unread' ? 'Okunmamış bildiriminiz bulunmuyor' : 'Henüz bildirim almadınız'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const color = getColor(notification.type);
            const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: tr
            });

            const colorClasses = {
              green: 'bg-green-100 text-green-600',
              red: 'bg-red-100 text-red-600',
              blue: 'bg-blue-100 text-blue-600',
              orange: 'bg-orange-100 text-orange-600',
              gray: 'bg-gray-100 text-gray-600'
            }[color];

            return (
              <Card
                key={notification.id}
                className={`transition-all cursor-pointer hover:shadow-md ${
                  !notification.read ? 'border-2 border-blue-200 bg-blue-50/50' : ''
                }`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${colorClasses}`}>
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {timeAgo}
                          </span>
                          {notification.user && (
                            <span>• {notification.user.email}</span>
                          )}
                          {notification.organization && (
                            <span>• {notification.organization.name}</span>
                          )}
                        </div>
                      </div>

                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
