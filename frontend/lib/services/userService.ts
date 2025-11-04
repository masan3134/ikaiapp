import apiClient from "./apiClient";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  position: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  analysisNotifications: boolean;
  teamNotifications: boolean;
  offerNotifications: boolean;
}

export interface UserStats {
  totalAnalyses: number;
  totalCandidates: number;
  totalJobPostings: number;
  totalInterviews: number;
  totalOffers: number;
  recentAnalyses: Array<{
    id: string;
    createdAt: string;
    status: string;
    jobPosting: { title: string };
  }>;
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<UserProfile> {
  const response = await apiClient.get("/api/v1/users/me");
  return response.data.data;
}

/**
 * Update current user profile
 */
export async function updateCurrentUser(
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const response = await apiClient.patch("/api/v1/users/me", data);
  return response.data.data;
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await apiClient.get("/api/v1/users/me/notifications");
  return response.data.data;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  data: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const response = await apiClient.patch(
    "/api/v1/users/me/notifications",
    data
  );
  return response.data.data;
}

/**
 * Get user activity statistics
 */
export async function getUserStats(): Promise<UserStats> {
  const response = await apiClient.get("/api/v1/users/me/stats");
  return response.data.data;
}
