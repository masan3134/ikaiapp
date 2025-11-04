"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  User,
  Building2,
  TrendingUp,
  Bell,
  Shield,
} from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Genel Bakış",
      path: "/settings/overview",
      icon: LayoutGrid,
      description: "Dashboard ve hızlı erişim",
    },
    {
      name: "Profil",
      path: "/settings/profile",
      icon: User,
      description: "Kişisel bilgiler ve istatistikler",
    },
    {
      name: "Şirket",
      path: "/settings/organization",
      icon: Building2,
      description: "Organizasyon ayarları",
    },
    {
      name: "Kullanım & Planlar",
      path: "/settings/billing",
      icon: TrendingUp,
      description: "Faturalama ve limitler",
    },
    {
      name: "Bildirimler",
      path: "/settings/notifications",
      icon: Bell,
      description: "Bildirim tercihleri",
    },
    {
      name: "Güvenlik",
      path: "/settings/security",
      icon: Shield,
      description: "Şifre ve oturum yönetimi",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ayarlar</h1>
          <p className="text-lg text-gray-600">
            Hesap, organizasyon ve sistem ayarlarınızı yönetin
          </p>
        </div>

        {/* Tabs - Modern Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex -mb-px min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.path;

                return (
                  <Link
                    key={tab.path}
                    href={tab.path}
                    className={`
                      group relative flex items-center gap-3 px-6 py-4 border-b-2 font-medium text-sm transition-all min-w-[140px]
                      ${
                        isActive
                          ? "border-blue-600 text-blue-600 bg-blue-50/50"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={
                        isActive
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }
                    />
                    <div className="flex flex-col">
                      <span
                        className={`font-medium ${isActive ? "text-blue-600" : ""}`}
                      >
                        {tab.name}
                      </span>
                      <span className="text-xs text-gray-500 hidden lg:block">
                        {tab.description}
                      </span>
                    </div>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
