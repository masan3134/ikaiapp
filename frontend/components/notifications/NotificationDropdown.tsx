'use client';

import { useNotifications } from '@/lib/hooks/useNotifications';
import NotificationItem from './NotificationItem';
import Link from 'next/link';
import { CheckIcon, InboxIcon } from '@heroicons/react/24/outline';

/**
 * NotificationDropdown Component
 *
 * Features:
 * - Latest 10 notifications
 * - Mark as read on click
 * - "View All" link
 * - "Mark All as Read" button
 * - Empty state
 * - Loading state
 *
 * Created by: Worker #2
 * Date: 2025-11-04
 */

interface NotificationDropdownProps {
  onClose?: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh
  } = useNotifications({
    autoRefresh: false,
    filters: { limit: 10 }
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

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Bildirimler
          </h3>

          {unreadNotifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <CheckIcon className="h-3 w-3" />
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <InboxIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Bildirim yok</p>
          </div>
        ) : (
          <div>
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleMarkAsRead}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <Link
            href="/notifications"
            onClick={onClose}
            className="block text-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            Tümünü Görüntüle →
          </Link>
        </div>
      )}
    </div>
  );
}
