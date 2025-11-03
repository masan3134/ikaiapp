
import { useAuthStore } from '@/lib/store/authStore';

export const getAuthToken = (): string | null => {
  return useAuthStore.getState().token;
};
