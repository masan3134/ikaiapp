"use client";

import Link from "next/link";
import {
  Crown,
  Sparkles,
  Users,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";

interface AdminWelcomeHeaderProps {
  user: any;
  organization: any;
  usage: any;
}

export default function AdminWelcomeHeader({
  user,
  organization,
  usage,
}: AdminWelcomeHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 mb-6 text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Crown className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-100 text-sm">
                {organization?.name || "Organization"}
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-sm mt-4 flex-wrap">
            <div className="flex items-center gap-2 bg-purple-700/40 px-3 py-1.5 rounded-lg backdrop-blur">
              <Sparkles className="w-4 h-4" />
              <span>Plan: {organization?.plan || "FREE"}</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-700/40 px-3 py-1.5 rounded-lg backdrop-blur">
              <Users className="w-4 h-4" />
              <span>
                {organization?.totalUsers || 0}/{organization?.maxUsers || 0}{" "}
                Kullanıcı
              </span>
            </div>
            <div className="flex items-center gap-2 bg-purple-700/40 px-3 py-1.5 rounded-lg backdrop-blur">
              <BarChart3 className="w-4 h-4" />
              <span>{usage?.analysisPercentage || 0}% Analiz Kullanımı</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-700/40 px-3 py-1.5 rounded-lg backdrop-blur">
              <FileText className="w-4 h-4" />
              <span>{usage?.cvPercentage || 0}% CV Kullanımı</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link
            href="/settings/organization"
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
