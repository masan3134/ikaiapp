"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

/**
 * User Avatar with dropdown menu
 * Shows user initials with gradient background
 */

export default function UserAvatar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  // Get user initials
  const getInitials = () => {
    const first = user.firstName || user.email?.[0] || "U";
    const last = user.lastName?.[0] || "";
    return `${first[0]}${last}`.toUpperCase();
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const menuItems = [
    {
      icon: User,
      label: "Profil",
      onClick: () => {
        setIsOpen(false);
        router.push("/profile");
      },
    },
    {
      icon: Settings,
      label: "Ayarlar",
      onClick: () => {
        setIsOpen(false);
        router.push("/settings");
      },
    },
    {
      icon: LogOut,
      label: "Çıkış Yap",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Kullanıcı menüsü"
      >
        {getInitials()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {user.role === "SUPER_ADMIN"
                  ? "Süper Admin"
                  : user.role === "ADMIN"
                  ? "Admin"
                  : user.role === "MANAGER"
                  ? "Müdür"
                  : user.role === "HR_SPECIALIST"
                  ? "İK Uzmanı"
                  : "Kullanıcı"}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      item.danger
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
