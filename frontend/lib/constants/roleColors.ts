/**
 * Role-Based Color System
 * Visual identity for each user role
 */

export const ROLE_COLORS = {
  SUPER_ADMIN: {
    primary: "#EF4444", // Red (power/danger)
    light: "#FEE2E2",
    dark: "#991B1B",
    gradient: "from-red-500 to-red-700",
    emoji: "🔴",
  },
  ADMIN: {
    primary: "#A855F7", // Purple (premium/authority)
    light: "#F3E8FF",
    dark: "#6B21A8",
    gradient: "from-purple-500 to-purple-700",
    emoji: "🟣",
  },
  MANAGER: {
    primary: "#3B82F6", // Blue (trust/leadership)
    light: "#DBEAFE",
    dark: "#1E40AF",
    gradient: "from-blue-500 to-blue-700",
    emoji: "🔵",
  },
  HR_SPECIALIST: {
    primary: "#10B981", // Green (growth/recruitment)
    light: "#D1FAE5",
    dark: "#065F46",
    gradient: "from-green-500 to-green-700",
    emoji: "🟢",
  },
  USER: {
    primary: "#6B7280", // Gray (neutral/basic)
    light: "#F3F4F6",
    dark: "#374151",
    gradient: "from-gray-500 to-gray-700",
    emoji: "⚪",
  },
} as const;

export type RoleColorKey = keyof typeof ROLE_COLORS;
