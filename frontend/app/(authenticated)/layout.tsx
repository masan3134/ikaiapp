"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wand2,
  Briefcase,
  Users,
  Clock,
  LogOut,
  Menu,
  X,
  Shield,
  Calendar,
  FileText,
  ChevronDown,
  ChevronRight,
  Plus,
  BarChart3,
  Layers,
  Settings,
  UserCog,
  HelpCircle, // W1: Help
  Bell, // W1: Notifications
  User, // W1: Profile
  CreditCard, // W1: Billing
  BellRing, // W1: Notification settings
  Building2, // W1: Organizations
  ListChecks, // W1: Queues
  FileWarning, // W1: Security Logs
  Activity, // W1: System Health
  TrendingUp, // W1: Offers Analytics
  Database, // W7: Milvus/Database
  Lock, // W7: Security
  ServerCog, // W7: System
} from "lucide-react";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/lib/store/authStore";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { Toaster } from "react-hot-toast";

// Dynamic import to avoid SSR issues (uses localStorage/hooks)
const NotificationBell = dynamic(
  () => import("@/components/notifications/NotificationBellSimple"),
  { ssr: false }
);

const UserAvatar = dynamic(
  () => import("@/components/layout/UserAvatar"),
  { ssr: false }
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOffersExpanded, setIsOffersExpanded] = useState(true);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false); // W1: Settings submenu
  const [isSuperAdminExpanded, setIsSuperAdminExpanded] = useState(true); // W1: Super Admin submenu

  // Sidebar menü itemları (HR workflow order) - W1 UPDATED
  const allMenuItems = [
    // 1. Dashboard (always first)
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    // 2. Bildirimler (W1 ADDED - all users)
    { name: "Bildirimler", path: "/notifications", icon: Bell },
    // 3-8. HR Features (HR_SPECIALIST+ only)
    ...(user?.role === "HR_SPECIALIST" ||
    user?.role === "MANAGER" ||
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN"
      ? [
          // 3. İş İlanları (start of hiring workflow)
          { name: "İş İlanları", path: "/job-postings", icon: Briefcase },
          // 4. Adaylar (candidates apply to job postings)
          { name: "Adaylar", path: "/candidates", icon: Users },
          // 5. Analiz Sihirbazı (analyze candidates)
          { name: "Analiz Sihirbazı", path: "/wizard", icon: Wand2 },
          // 6. Geçmiş Analizlerim (past analyses)
          { name: "Geçmiş Analizlerim", path: "/analyses", icon: Clock },
          // 7. Teklifler (W1 UPDATED - has submenu with 4 items)
          { name: "Teklifler", path: "/offers", icon: FileText, hasSubmenu: true },
          // 8. Mülakatlar (interview scheduled candidates)
          { name: "Mülakatlar", path: "/interviews", icon: Calendar },
        ]
      : []),
    // 9. Takım (team management - MANAGER+)
    ...(user?.role === "MANAGER" ||
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN"
      ? [{ name: "Takım", path: "/team", icon: UserCog }]
      : []),
    // 10. Analitik (analytics & reports - MANAGER+)
    ...(user?.role === "MANAGER" ||
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN"
      ? [{ name: "Analitik", path: "/analytics", icon: BarChart3 }]
      : []),
    // 11. Sistem Yönetimi (W1 ADDED - SUPER_ADMIN only, has 4 submenu items)
    ...(user?.role === "SUPER_ADMIN"
      ? [{ name: "Sistem Yönetimi", path: "/super-admin/organizations", icon: Shield, hasSubmenu: true, submenuType: "superadmin" }]
      : []),
    // 12. Yardım (W1 ADDED - all users)
    { name: "Yardım", path: "/help", icon: HelpCircle },
    // 13. Ayarlar (W1 UPDATED - has 6 submenu items, all users)
    { name: "Ayarlar", path: "/settings/overview", icon: Settings, hasSubmenu: true, submenuType: "settings" },
  ];

  // Offer submenu items - W1 ADDED Analytics
  const offerSubMenuItems = [
    { name: "Tüm Teklifler", path: "/offers", icon: FileText },
    { name: "Yeni Teklif", path: "/offers/wizard", icon: Plus },
    { name: "Şablonlar", path: "/offers/templates", icon: Layers },
    {
      name: "Analitik",
      path: "/offers/analytics",
      icon: TrendingUp,
      show: user?.role === "MANAGER" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
    },
  ];

  // W1: Settings submenu items
  const settingsSubMenuItems = [
    { name: "Genel Bakış", path: "/settings/overview", icon: Settings, show: true },
    { name: "Profil", path: "/settings/profile", icon: User, show: true },
    { name: "Güvenlik", path: "/settings/security", icon: Shield, show: true },
    { name: "Bildirim Tercihleri", path: "/settings/notifications", icon: BellRing, show: true },
    {
      name: "Organizasyon",
      path: "/settings/organization",
      icon: Building2,
      show: user?.role === "MANAGER" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
    },
    {
      name: "Fatura ve Plan",
      path: "/settings/billing",
      icon: CreditCard,
      show: user?.role === "MANAGER" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
    },
  ];

  // W1: Super Admin submenu items (W7 UPDATED: Added 7 new pages)
  const superAdminSubMenuItems = [
    { name: "Organizasyonlar", path: "/super-admin/organizations", icon: Building2 },
    { name: "Kullanıcı Yönetimi", path: "/super-admin/users", icon: Users },
    { name: "Kuyruk Yönetimi", path: "/super-admin/queues", icon: ListChecks },
    { name: "Güvenlik", path: "/super-admin/security", icon: Lock },
    { name: "Güvenlik Logları", path: "/super-admin/security-logs", icon: FileWarning },
    { name: "Sistem Sağlığı", path: "/super-admin/system-health", icon: Activity },
    { name: "Sistem", path: "/super-admin/system", icon: ServerCog },
    { name: "Analitik", path: "/super-admin/analytics", icon: BarChart3 },
    { name: "Loglar", path: "/super-admin/logs", icon: FileText },
    { name: "Milvus", path: "/super-admin/milvus", icon: Database },
    { name: "Ayarlar", path: "/super-admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <OrganizationProvider>
        <OnboardingGuard>
          <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">İ</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">IKAI HR</h1>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <UserAvatar />
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <aside
                className={`
              fixed lg:static inset-y-0 left-0 z-50
              w-64 bg-white border-r border-gray-200
              transform transition-transform duration-200 ease-in-out
              flex flex-col
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
              >
                {/* Logo */}
                <div className="hidden lg:flex items-center h-16 px-6 border-b border-gray-200 bg-white flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-xl">İ</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-blue-600">IKAI</h1>
                      <p className="text-xs text-gray-500">HR Platform</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                  {allMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    // W1 FIX: Handle ALL submenus dynamically (Teklifler, Settings, Super Admin)
                    if (item.hasSubmenu) {
                      // Get correct submenu items based on type
                      const submenuItems =
                        item.submenuType === "settings" ? settingsSubMenuItems :
                        item.submenuType === "superadmin" ? superAdminSubMenuItems :
                        offerSubMenuItems; // Default to offers

                      // Get correct expanded state
                      const isExpanded =
                        item.submenuType === "settings" ? isSettingsExpanded :
                        item.submenuType === "superadmin" ? isSuperAdminExpanded :
                        isOffersExpanded; // Default to offers

                      // Get correct toggle function
                      const toggleExpanded = () => {
                        if (item.submenuType === "settings") setIsSettingsExpanded(!isSettingsExpanded);
                        else if (item.submenuType === "superadmin") setIsSuperAdminExpanded(!isSuperAdminExpanded);
                        else setIsOffersExpanded(!isOffersExpanded);
                      };

                      // Filter by show property (for role-specific submenu items)
                      const visibleSubmenuItems = submenuItems.filter((sub: any) => sub.show !== false);

                      return (
                        <div key={item.path}>
                          <button
                            onClick={toggleExpanded}
                            className={`
                          w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg
                          transition-colors duration-150
                          ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={20} />
                              <span>{item.name}</span>
                            </div>
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>

                          {/* Submenu */}
                          {isExpanded && (
                            <div className="mt-1 ml-4 space-y-1">
                              {visibleSubmenuItems.map((subItem: any) => {
                                const SubIcon = subItem.icon;
                                const isSubActive = pathname === subItem.path;

                                return (
                                  <Link
                                    key={subItem.path}
                                    href={subItem.path}
                                    prefetch={false}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                  flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                                  transition-colors duration-150
                                  ${
                                    isSubActive
                                      ? "bg-blue-50 text-blue-600 font-medium"
                                      : "text-gray-600 hover:bg-gray-50"
                                  }
                                `}
                                  >
                                    <SubIcon size={18} />
                                    <span>{subItem.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Regular menu item
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        prefetch={false}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-150
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                      >
                        <Icon size={20} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* User Section */}
                <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {user?.role}
                        </span>
                        {user?.role === "ADMIN" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            <Shield size={12} />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </aside>

              {/* Overlay for mobile */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              {/* Main Content */}
              <main className="flex-1 overflow-x-hidden">
                {/* Desktop Top Bar - Bell Icon + Avatar (hidden on mobile) */}
                <div className="hidden lg:block sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                  <div className="px-6 py-3 flex items-center justify-end gap-3">
                    <NotificationBell />
                    <UserAvatar />
                  </div>
                </div>

                {children}
              </main>
            </div>
          </div>
        </OnboardingGuard>
      </OrganizationProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </ProtectedRoute>
  );
}
