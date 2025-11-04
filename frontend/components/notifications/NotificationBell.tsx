'use client';

import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useUnreadCount } from '@/lib/hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

/**
 * NotificationBell Component
 *
 * Features:
 * - Bell icon with unread badge
 * - Auto-refresh count every 30s
 * - Click to toggle dropdown
 * - Animated bell on new notifications
 *
 * Usage: Place in AppLayout header
 *
 * Created by: Worker #2
 * Date: 2025-11-04
 */

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { count, loading } = useUnreadCount(true, 30000); // Auto-refresh every 30s

  const hasUnread = count > 0;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label={`Bildirimler${hasUnread ? ` (${count} okunmamış)` : ''}`}
      >
        {hasUnread ? (
          <BellSolidIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        ) : (
          <BellIcon className="h-6 w-6" />
        )}

        {/* Unread Badge */}
        {hasUnread && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-[20px]">
            {count > 99 ? '99+' : count}
          </span>
        )}

        {/* Loading indicator */}
        {loading && !hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 z-50">
            <NotificationDropdown onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
