import axios from 'axios';

// Get API URL with browser-side override for Docker internal hostnames
const getAPIURL = () => {
  const envURL = process.env.NEXT_PUBLIC_API_URL;

  // If running in browser and env URL uses Docker internal hostname, use localhost
  if (typeof window !== 'undefined' && envURL?.includes('ikai-backend')) {
    return 'http://localhost:8102';
  }

  // Otherwise use env URL or fallback to localhost
  return envURL || 'http://localhost:8102';
};

const API_URL = getAPIURL();

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

export default apiClient;
