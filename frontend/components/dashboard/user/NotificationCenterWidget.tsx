"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationCenterWidgetProps {
  data: {
    unread: number;
    latest: {
      id: string;
      message: string;
      createdAt: string;
    } | null;
  };
}

export function NotificationCenterWidget({
  data,
}: NotificationCenterWidgetProps) {
  const { unread, latest } = data;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-blue-600" />
        Bildirimler
      </h3>

      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
          <span className="text-2xl font-bold text-blue-600">{unread}</span>
        </div>
        <p className="text-sm text-slate-600 mb-3">Okunmamış bildirim</p>

        {latest && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-2 px-2">
            {latest.message}
          </p>
        )}

        <Link
          href="/notifications"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Tümünü Gör →
        </Link>
      </div>
    </div>
  );
}
