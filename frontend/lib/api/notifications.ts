/**
 * Notifications API Client
 * Worker #2 - 2025-11-04
 */

import { apiRequest } from './client';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  readAt?: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
  organization?: {
    id: string;
    name: string;
  };
}

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  emailEnabled: boolean;
}

/**
 * Get user notifications
 */
export async function getNotifications(filters?: {
  read?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<{ notifications: Notification[]; pagination: any }> {
  const params = new URLSearchParams();
  if (filters?.read !== undefined) params.append('read', String(filters.read));
  if (filters?.type) params.append('type', filters.type);
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));

  const query = params.toString();
  const url = `/notifications${query ? `?${query}` : ''}`;

  return apiRequest(url, { method: 'GET' });
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  const data = await apiRequest('/notifications/unread-count', { method: 'GET' });
  return data.count || 0;
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
  await apiRequest(`/notifications/${notificationId}/read`, { method: 'PATCH' });
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<number> {
  const data = await apiRequest('/notifications/read-all', { method: 'PATCH' });
  return data.count || 0;
}

/**
 * Get notification preferences
 */
export async function getPreferences(): Promise<NotificationPreference[]> {
  const data = await apiRequest('/notifications/preferences', { method: 'GET' });
  return data.preferences || [];
}

/**
 * Update all preferences (batch)
 */
export async function updatePreferences(
  preferences: NotificationPreference[]
): Promise<NotificationPreference[]> {
  const data = await apiRequest('/notifications/preferences', {
    method: 'PUT',
    body: JSON.stringify({ preferences })
  });
  return data.preferences || [];
}

/**
 * Update single preference
 */
export async function updateSinglePreference(
  type: string,
  enabled: boolean,
  emailEnabled: boolean
): Promise<NotificationPreference> {
  const data = await apiRequest(`/notifications/preferences/${type}`, {
    method: 'PUT',
    body: JSON.stringify({ enabled, emailEnabled })
  });
  return data.preference;
}
