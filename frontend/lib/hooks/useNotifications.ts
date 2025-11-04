'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification
} from '../api/notifications';

/**
 * useNotifications Hook
 *
 * Features:
 * - Fetch notifications with filters
 * - Unread count (auto-refresh every 30s)
 * - Mark as read (single + all)
 * - Loading states
 * - Error handling
 *
 * Created by: Worker #2
 * Date: 2025-11-04
 */

interface UseNotificationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  filters?: {
    read?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  };
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    filters = {}
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  /**
   * Fetch notifications
   */
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getNotifications(filters);
      setNotifications(data.notifications || []);
      setPagination(data.pagination);

    } catch (err: any) {
      setError(err.message || 'Bildirimler yüklenemedi');
      console.error('Notification fetch error:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.read, filters.type, filters.page, filters.limit]); // Stable dependencies

  /**
   * Fetch unread count
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err: any) {
      console.error('Unread count fetch error:', err);
    }
  }, []);

  /**
   * Mark single notification as read
   */
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await markAsRead(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, read: true, readAt: new Date().toISOString() }
            : n
        )
      );

      // Decrease unread count
      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (err: any) {
      console.error('Mark as read error:', err);
      throw err;
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      const count = await markAllAsRead();

      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
      );

      // Reset unread count
      setUnreadCount(0);

      return count;
    } catch (err: any) {
      console.error('Mark all as read error:', err);
      throw err;
    }
  }, []);

  /**
   * Refresh both notifications and unread count
   */
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchNotifications(),
      fetchUnreadCount()
    ]);
  }, [fetchNotifications, fetchUnreadCount]);

  // Initial fetch (only on mount)
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount, ignore refresh dependency

  // Auto-refresh unread count
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    refresh,
    fetchNotifications,
    fetchUnreadCount
  };
}

/**
 * useUnreadCount Hook (Lightweight - just count)
 * For components that only need unread count (like bell icon)
 */
export function useUnreadCount(autoRefresh = true, refreshInterval = 30000) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true);
      const unreadCount = await getUnreadCount();
      setCount(unreadCount);
    } catch (err) {
      console.error('Unread count error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch (only on mount)
  useEffect(() => {
    fetchCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchCount, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchCount]);

  return { count, loading, refresh: fetchCount };
}
