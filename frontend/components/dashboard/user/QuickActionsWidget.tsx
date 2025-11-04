"use client";

import {
  Zap,
  User,
  Settings,
  Bell,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    name: "Profilim",
    description: "Profil bilgilerini görüntüle",
    path: "/settings/profile",
    icon: <User className="w-5 h-5 text-slate-600" />,
  },
  {
    name: "Ayarlar",
    description: "Hesap ayarlarını düzenle",
    path: "/settings",
    icon: <Settings className="w-5 h-5 text-slate-600" />,
  },
  {
    name: "Bildirimler",
    description: "Tüm bildirimleri gör",
    path: "/notifications",
    icon: <Bell className="w-5 h-5 text-slate-600" />,
  },
  {
    name: "Yardım",
    description: "Yardım merkezine git",
    path: "/help",
    icon: <HelpCircle className="w-5 h-5 text-slate-600" />,
  },
];

export function QuickActionsWidget() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-600" />
        Hızlı Erişim
      </h3>

      <div className="space-y-2">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            href={action.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">
                {action.name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {action.description}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 flex-shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
