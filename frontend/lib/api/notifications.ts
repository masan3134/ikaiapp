/**
 * Notifications API Client
 * Worker #2 - 2025-11-04
 */

import apiClient from "@/lib/utils/apiClient";

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
  if (filters?.read !== undefined) params.append("read", String(filters.read));
  if (filters?.type) params.append("type", filters.type);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const query = params.toString();
  const url = `/api/v1/notifications${query ? `?${query}` : ""}`;

  const response = await apiClient.get(url);
  return response.data;
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get("/api/v1/notifications/unread-count");
  return response.data.count || 0;
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
  await apiClient.patch(`/api/v1/notifications/${notificationId}/read`);
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<number> {
  const response = await apiClient.patch("/api/v1/notifications/read-all");
  return response.data.count || 0;
}

/**
 * Get notification preferences
 */
export async function getPreferences(): Promise<NotificationPreference[]> {
  const response = await apiClient.get("/api/v1/notifications/preferences");
  return response.data.preferences || [];
}

/**
 * Update all preferences (batch)
 */
export async function updatePreferences(
  preferences: NotificationPreference[]
): Promise<NotificationPreference[]> {
  const response = await apiClient.put("/api/v1/notifications/preferences", {
    preferences,
  });
  return response.data.preferences || [];
}

/**
 * Update single preference
 */
export async function updateSinglePreference(
  type: string,
  enabled: boolean,
  emailEnabled: boolean
): Promise<NotificationPreference> {
  const response = await apiClient.put(
    `/api/v1/notifications/preferences/${type}`,
    {
      enabled,
      emailEnabled,
    }
  );
  return response.data.preference;
}
