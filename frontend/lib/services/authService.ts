import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and suppress expected 503 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Suppress console errors for expected 503 errors on AI Chat endpoints
    if (error.response?.status === 503) {
      const url = error.config?.url || '';
      if (url.includes('/chat-stats') || url.includes('/prepare-chat') || url.includes('/chat')) {
        // This is an expected service unavailable error for AI Chat
        // Suppress the console error but still reject the promise
        error.suppressConsoleError = true;
      }
    }

    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
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
export async function register(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to connect to server' };
  }
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to connect to server' };
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/v1/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage on logout
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<{ user: User }>('/api/v1/auth/me');
    return response.data.user;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to get user' };
  }
}

/**
 * Refresh token
 */
export async function refreshToken(): Promise<string> {
  try {
    const response = await apiClient.post<{ token: string }>('/api/v1/auth/refresh');
    return response.data.token;
  } catch (error: any) {
    throw error.response?.data || { error: 'Network Error', message: 'Failed to refresh token' };
  }
}

export default apiClient;
