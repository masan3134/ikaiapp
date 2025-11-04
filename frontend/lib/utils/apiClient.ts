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

const apiClient = axios.create({
  baseURL: getAPIURL()
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
