"use client";

import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const settingsCategories = [
    {
      name: "Genel Bakış",
      description: "Dashboard ve hızlı erişim",
      path: "/settings/overview",
      icon: <SettingsIcon className="w-6 h-6 text-blue-600" />,
      available: true,
    },
    {
      name: "Profil Ayarları",
      description: "Kişisel bilgiler ve profil fotoğrafı",
      path: "/settings/profile",
      icon: <User className="w-6 h-6 text-slate-600" />,
      available: true,
    },
    {
      name: "Bildirim Tercihleri",
      description: "Email ve uygulama bildirimleri",
      path: "/settings/notifications",
      icon: <Bell className="w-6 h-6 text-slate-600" />,
      available: true,
    },
    {
      name: "Güvenlik",
      description: "Şifre değiştirme ve 2FA ayarları",
      path: "/settings/security",
      icon: <Shield className="w-6 h-6 text-slate-600" />,
      available: true,
    },
    {
      name: "Faturalandırma",
      description: "Plan yönetimi ve ödeme bilgileri",
      path: "/settings/billing",
      icon: <CreditCard className="w-6 h-6 text-purple-600" />,
      available: isAdmin,
    },
    {
      name: "Organizasyon",
      description: "Şirket bilgileri ve ayarları",
      path: "/settings/organization",
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      available: isAdmin,
    },
  ];

  const availableSettings = settingsCategories.filter((cat) => cat.available);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-slate-600" />
            Ayarlar
          </h1>
          <p className="text-slate-600 mt-2">
            Hesap ayarlarınızı ve tercihlerinizi yönetin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableSettings.map((category) => (
            <Link
              key={category.path}
              href={category.path}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
