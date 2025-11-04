import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "../services/authService";
import type { User } from "../services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User, token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);

          // Store token in localStorage
          localStorage.setItem("auth_token", response.token);
          localStorage.setItem("auth_user", JSON.stringify(response.user));

          // Track session start for activity tracking
          const now = new Date();
          localStorage.setItem("sessionStartTimestamp", Date.now().toString());
          localStorage.setItem(
            "sessionLoginTime",
            now.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
          localStorage.setItem("sessionPageViews", "0"); // Reset page view counter

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || "Login failed",
          });
          throw error;
        }
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(email, password);

          // Store token in localStorage
          localStorage.setItem("auth_token", response.token);
          localStorage.setItem("auth_user", JSON.stringify(response.user));

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || "Registration failed",
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Clear localStorage
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");

          // Clear session tracking
          localStorage.removeItem("sessionStartTimestamp");
          localStorage.removeItem("sessionLoginTime");
          localStorage.removeItem("sessionPageViews");

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Token is invalid, clear everything
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      setUser: (user: User, token: string) => {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
