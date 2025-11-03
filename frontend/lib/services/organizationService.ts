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

// Request interceptor to add token
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

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
    severity: 'warning' | 'critical';
  }>;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
}

/**
 * Get organization usage statistics
 */
export async function getOrganizationUsage(): Promise<UsageData> {
  const response = await apiClient.get('/api/v1/organizations/me/usage');
  return response.data.data;
}

/**
 * Get organization details
 */
export async function getOrganization() {
  const response = await apiClient.get('/api/v1/organizations/me');
  return response.data.data;
}

/**
 * Update organization details
 */
export async function updateOrganization(data: any) {
  const response = await apiClient.patch('/api/v1/organizations/me', data);
  return response.data.data;
}
