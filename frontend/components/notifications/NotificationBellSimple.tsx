"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { getUnreadCount } from "@/lib/api/notifications";

/**
 * Simple NotificationBell - No infinite loops
 * Minimal hooks, manual refresh
 */

export default function NotificationBellSimple() {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  const loadCount = async () => {
    try {
      const unread = await getUnreadCount();
      setCount(unread);
    } catch (err) {
      console.error("Unread count error:", err);
    }
  };

  // Load once on mount
  useEffect(() => {
    loadCount();

    // Auto-refresh every 30s
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, []); // Empty deps - stable!

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
        aria-label={`Bildirimler${count > 0 ? ` (${count} okunmamış)` : ""}`}
      >
        <Bell size={20} className={count > 0 ? "text-blue-600" : ""} />

        {count > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[20px]">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 z-50">
            <NotificationDropdown
              onClose={() => {
                setIsOpen(false);
                loadCount();
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
