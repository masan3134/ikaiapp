import apiClient from "./apiClient";

export interface UsageData {
  monthlyAnalysisCount: number;
  maxAnalysisPerMonth: number;
  monthlyCvCount: number;
  maxCvPerMonth: number;
  totalUsers: number;
  maxUsers: number;
  analyses: {
    used: number;
    limit: number;
    remaining: number;
  };
  cvs: {
    used: number;
    limit: number;
    remaining: number;
  };
  users: {
    used: number;
    limit: number;
    remaining: number;
  };
  percentages: {
    analysis: number;
    cv: number;
    user: number;
  };
  warnings: Array<{
    type: string;
    message: string;
    severity: "warning" | "critical";
  }>;
  plan: "FREE" | "PRO" | "ENTERPRISE";
}

/**
 * Get organization usage statistics
 */
export async function getOrganizationUsage(): Promise<UsageData> {
  const response = await apiClient.get("/api/v1/organizations/me/usage");
  return response.data.data;
}

/**
 * Get organization details
 */
export async function getOrganization() {
  const response = await apiClient.get("/api/v1/organizations/me");
  return response.data.data;
}

/**
 * Update organization details
 */
export async function updateOrganization(data: any) {
  const response = await apiClient.patch("/api/v1/organizations/me", data);
  return response.data.data;
}
