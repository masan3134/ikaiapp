'use client';

import { useState } from 'react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import NotificationItem from '@/components/notifications/NotificationItem';
import { CheckIcon, FunnelIcon, InboxIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

/**
 * Notification Center Page
 *
 * Features:
 * - Full notification list (paginated)
 * - Filters (read/unread, type)
 * - Mark all as read
 * - Empty state
 * - Link to preferences
 *
 * Route: /notifications
 *
 * Created by: Worker #2
 * Date: 2025-11-04
 */

export default function NotificationCenterPage() {
  const [readFilter, setReadFilter] = useState<boolean | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    markAsRead,
    markAllAsRead,
    refresh
  } = useNotifications({
    autoRefresh: true,
    refreshInterval: 30000,
    filters: {
      read: readFilter,
      type: typeFilter || undefined,
      page,
      limit: 20
    }
  });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      await refresh();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await refresh();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const notificationTypes = [
    'ANALYSIS_STARTED',
    'ANALYSIS_COMPLETED',
    'ANALYSIS_FAILED',
    'CANDIDATE_UPLOADED',
    'OFFER_CREATED',
    'OFFER_SENT',
    'OFFER_ACCEPTED',
    'OFFER_REJECTED',
    'OFFER_EXPIRED',
    'INTERVIEW_SCHEDULED',
    'INTERVIEW_COMPLETED',
    'INTERVIEW_CANCELLED',
    'USER_INVITED',
    'USAGE_LIMIT_WARNING',
    'USAGE_LIMIT_REACHED'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bildirimler
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Tüm sistem bildirimleri ve etkinlikler
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <FunnelIcon className="h-5 w-5 text-gray-400" />

          {/* Read/Unread Filter */}
          <select
            value={readFilter === undefined ? 'all' : readFilter ? 'read' : 'unread'}
            onChange={(e) => {
              const val = e.target.value;
              setReadFilter(val === 'all' ? undefined : val === 'read');
              setPage(1);
            }}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tümü</option>
            <option value="unread">Okunmamış ({unreadCount})</option>
            <option value="read">Okunmuş</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Tüm Tipler</option>
            {notificationTypes.map(type => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1.5 font-medium"
            >
              <CheckIcon className="h-4 w-4" />
              Tümünü Okundu İşaretle
            </button>
          )}

          <Link
            href="/settings/notifications"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Ayarlar
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Toplam</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {pagination?.total || 0}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">Okunmamış</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {unreadCount}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">Okunmuş</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {(pagination?.total || 0) - unreadCount}
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Bildirimler yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <InboxIcon className="h-16 w-16 text-gray-400 mx-auto" />
            <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">Bildirim yok</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Henüz bildirim almadınız
            </p>
          </div>
        ) : (
          <div>
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Sayfa <span className="font-medium">{pagination.page}</span> /{' '}
            <span className="font-medium">{pagination.totalPages}</span>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Önceki
            </button>

            <button
              onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={page === pagination.totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
