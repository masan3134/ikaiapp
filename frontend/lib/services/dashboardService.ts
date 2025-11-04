import apiClient from "./authService";

export interface DashboardStats {
  overview: {
    totalUsers: number | null;
    totalCandidates: number;
    totalJobPostings: number;
    totalAnalyses: number;
    userCandidates: number;
    userJobPostings: number;
    userAnalyses: number;
  };
  analysisByStatus: {
    PENDING: number;
    PROCESSING: number;
    COMPLETED: number;
    FAILED: number;
  };
  recentAnalyses: Array<{
    id: string;
    status: string;
    jobPostingTitle: string;
    department: string;
    candidateCount: number;
    createdAt: string;
    completedAt?: string;
  }>;
  userRole: string;
  timestamp: string;
}

/**
 * Get dashboard statistics
 * Access: ADMIN, MANAGER
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await apiClient.get<DashboardStats>(
      "/api/v1/dashboard/stats"
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        error: "Network Error",
        message: "Failed to fetch dashboard stats",
      }
    );
  }
}
