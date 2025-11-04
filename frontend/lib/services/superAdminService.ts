import axios from "axios";

// Get API URL with browser-side override for Docker internal hostnames
const getAPIURL = () => {
  const envURL = process.env.NEXT_PUBLIC_API_URL;

  // If running in browser and env URL uses Docker internal hostname, use localhost
  if (typeof window !== "undefined" && envURL?.includes("ikai-backend")) {
    return "http://localhost:8102";
  }

  // Otherwise use env URL or fallback to localhost
  return envURL || "http://localhost:8102";
};

const API_URL = getAPIURL();

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401/403 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      // Forbidden - redirect to dashboard
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      }
    }
    return Promise.reject(error);
  }
);

export interface SystemStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalUsers: number;
  planBreakdown: {
    FREE: number;
    PRO: number;
    ENTERPRISE: number;
  };
  monthlyAnalyses: number;
  todayRegistrations: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  isActive: boolean;
  userCount: number;
  monthlyAnalysisCount: number;
  createdAt: string;
}

export interface OrganizationsResponse {
  success: boolean;
  data: Organization[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get system-wide statistics
 */
export async function getStats(): Promise<SystemStats> {
  const response = await apiClient.get("/api/v1/super-admin/stats");
  return response.data.data;
}

/**
 * Get all organizations with pagination, search, and filters
 */
export async function getOrganizations(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  plan?: "FREE" | "PRO" | "ENTERPRISE",
  isActive?: boolean,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<OrganizationsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  });

  if (search) params.append("search", search);
  if (plan) params.append("plan", plan);
  if (isActive !== undefined) params.append("isActive", isActive.toString());

  const response = await apiClient.get(
    `/api/v1/super-admin/organizations?${params.toString()}`
  );
  return response.data;
}

/**
 * Toggle organization active status
 */
export async function toggleOrganization(id: string): Promise<Organization> {
  const response = await apiClient.patch(`/api/v1/super-admin/${id}/toggle`);
  return response.data.data;
}

/**
 * Update organization subscription plan
 */
export async function updatePlan(
  id: string,
  plan: "FREE" | "PRO" | "ENTERPRISE"
): Promise<Organization> {
  const response = await apiClient.patch(`/api/v1/super-admin/${id}/plan`, {
    plan,
  });
  return response.data.data;
}

/**
 * Delete (deactivate) organization
 */
export async function deleteOrganization(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/super-admin/${id}`);
}
