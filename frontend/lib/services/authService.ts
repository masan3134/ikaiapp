import { UserRole } from "@/lib/constants/roles";
import apiClient from "@/lib/utils/apiClient"; // Use shared apiClient

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  organization?: {
    id: string;
    name: string;
    plan: string;
  };
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any[];
}

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/register",
      {
        email,
        password,
      }
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        error: "Network Error",
        message: "Failed to connect to server",
      }
    );
  }
}

/**
 * Login user
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  console.log("[authService] login() called");  // DEBUG
  try {
    console.log("[authService] Posting to /api/v1/auth/login");  // DEBUG
    const response = await apiClient.post<AuthResponse>("/api/v1/auth/login", {
      email,
      password,
    });
    console.log("[authService] Login API response received");  // DEBUG
    return response.data;
  } catch (error: any) {
    console.error("[authService] Login API error:", error);  // DEBUG
    throw (
      error.response?.data || {
        error: "Network Error",
        message: "Failed to connect to server",
      }
    );
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post("/api/v1/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always clear local storage on logout
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<{ user: User }>("/api/v1/auth/me");
    return response.data.user;
  } catch (error: any) {
    throw (
      error.response?.data || {
        error: "Network Error",
        message: "Failed to get user",
      }
    );
  }
}

/**
 * Refresh token
 */
export async function refreshToken(): Promise<string> {
  try {
    const response = await apiClient.post<{ token: string }>(
      "/api/v1/auth/refresh"
    );
    return response.data.token;
  } catch (error: any) {
    throw (
      error.response?.data || {
        error: "Network Error",
        message: "Failed to refresh token",
      }
    );
  }
}

export default apiClient;
