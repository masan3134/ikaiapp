import { useAuthStore } from '@/lib/store/authStore';

/**
 * useAuth hook - Access authentication state and actions
 * Returns user, token, and auth functions
 */
export function useAuth() {
  const { user, token, login, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };
}
