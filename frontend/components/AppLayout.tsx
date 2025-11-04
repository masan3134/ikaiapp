"use client";
// Menu reorganized: HR workflow order (2025-11-04)

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
  FileText,
  ChevronDown,
  ChevronRight,
  Plus,
  BarChart3,
  Layers,
  Settings,
  Calendar,
  UserCog, // NEW: For Takım icon
  HelpCircle, // W1: Help page
  Bell, // W1: Notifications
  User, // W1: Profile settings
  CreditCard, // W1: Billing settings
  BellRing, // W1: Notification settings
  Building2, // W1: Super Admin - Organizations
  ListChecks, // W1: Super Admin - Queues
  FileWarning, // W1: Super Admin - Security Logs
  Activity, // W1: Super Admin - System Health
  TrendingUp, // W1: Offers Analytics
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotificationBell from "@/components/notifications/NotificationBell";
import { useAuthStore } from "@/lib/store/authStore";
import { useHasRole } from "@/lib/hooks/useHasRole";
import { RoleGroups, UserRole } from "@/lib/constants/roles";
import {
  canViewJobPostings,
  canViewCandidates,
  canViewAnalyses,
  canViewOffers,
  canViewInterviews,
  canViewTeam,
  canViewAnalytics,
  isSuperAdmin,
} from "@/lib/utils/rbac";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOffersExpanded, setIsOffersExpanded] = useState(true); // Always expanded by default
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false); // W1 FIX: Settings submenu state
  const [isSuperAdminExpanded, setIsSuperAdminExpanded] = useState(true); // W1 FIX: Super Admin submenu state (default expanded for SA)

  // Get user role for RBAC checks
  const userRole = user?.role;

  // W1 FIX: Submenu state helper functions
  const getSubmenuState = (path: string) => {
    if (path.startsWith('/offers')) return isOffersExpanded;
    if (path.startsWith('/settings')) return isSettingsExpanded;
    if (path.startsWith('/super-admin')) return isSuperAdminExpanded;
    return false;
  };

  const toggleSubmenu = (path: string) => {
    if (path.startsWith('/offers')) setIsOffersExpanded(!isOffersExpanded);
    else if (path.startsWith('/settings')) setIsSettingsExpanded(!isSettingsExpanded);
    else if (path.startsWith('/super-admin')) setIsSuperAdminExpanded(!isSuperAdminExpanded);
  };

  const isSubmenuActive = (path: string) => {
    return pathname.startsWith(path);
  };

  // Define all menu items with role requirements
  const menuItems = [
    // 1. Dashboard (always first)
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      show: true, // All roles can see dashboard
    },
    // 2. Bildirimler (notifications - W1 added)
    {
      name: "Bildirimler",
      path: "/notifications",
      icon: Bell,
      show: true, // All users can see notifications
    },
    // 3. İş İlanları (start of hiring workflow)
    {
      name: "İş İlanları",
      path: "/job-postings",
      icon: Briefcase,
      show: canViewJobPostings(userRole),
    },
    // 4. Adaylar (candidates apply to job postings)
    {
      name: "Adaylar",
      path: "/candidates",
      icon: Users,
      show: canViewCandidates(userRole),
    },
    // 5. Analiz Sihirbazı (analyze candidates)
    {
      name: "Analiz Sihirbazı",
      path: "/wizard",
      icon: Wand2,
      show: canViewAnalyses(userRole),
    },
    // 6. Geçmiş Analizlerim (past analyses)
    {
      name: "Geçmiş Analizlerim",
      path: "/analyses",
      icon: Clock,
      show: canViewAnalyses(userRole),
    },
    // 7. Teklifler (make offers to best candidates) - W1 added analytics + fixed templates path
    {
      name: "Teklifler",
      path: "/offers",
      icon: FileText,
      show: canViewOffers(userRole),
      submenu: [
        {
          name: "Tüm Teklifler",
          path: "/offers",
          icon: FileText,
          show: canViewOffers(userRole),
        },
        {
          name: "Yeni Teklif",
          path: "/offers/wizard",
          icon: Plus,
          show: canViewOffers(userRole),
        },
        {
          name: "Şablonlar",
          path: "/offers/templates", // W1 FIXED: was /offer-templates
          icon: Layers,
          show: canViewAnalytics(userRole), // Only MANAGER+ can manage templates
        },
        {
          name: "Analitik",
          path: "/offers/analytics", // W1 ADDED
          icon: TrendingUp,
          show: canViewAnalytics(userRole), // Only MANAGER+ analytics
        },
      ],
    },
    // 8. Mülakatlar (interview scheduled candidates)
    {
      name: "Mülakatlar",
      path: "/interviews",
      icon: Calendar,
      show: canViewInterviews(userRole),
    },
    // 9. Takım (team management)
    {
      name: "Takım",
      path: "/team",
      icon: UserCog, // CHANGED from Users to UserCog (avoid conflict with Adaylar)
      show: canViewTeam(userRole),
    },
    // 10. Analitik (analytics & reports)
    {
      name: "Analitik",
      path: "/analytics",
      icon: BarChart3,
      show: canViewAnalytics(userRole),
    },
    // 11. Super Admin (W1 ADDED - only for SUPER_ADMIN role)
    {
      name: "Sistem Yönetimi",
      path: "/super-admin/organizations", // Default to organizations
      icon: Shield,
      show: isSuperAdmin(userRole),
      submenu: [
        {
          name: "Organizasyonlar",
          path: "/super-admin/organizations",
          icon: Building2,
          show: isSuperAdmin(userRole),
        },
        {
          name: "Kuyruk Yönetimi",
          path: "/super-admin/queues",
          icon: ListChecks,
          show: isSuperAdmin(userRole),
        },
        {
          name: "Güvenlik Logları",
          path: "/super-admin/security-logs",
          icon: FileWarning,
          show: isSuperAdmin(userRole),
        },
        {
          name: "Sistem Sağlığı",
          path: "/super-admin/system-health",
          icon: Activity,
          show: isSuperAdmin(userRole),
        },
      ],
    },
    // 12. Yardım (W1 ADDED - help & support)
    {
      name: "Yardım",
      path: "/help",
      icon: HelpCircle,
      show: true, // All users can access help
    },
    // 13. Ayarlar (W1 UPDATED - converted to submenu, always last)
    {
      name: "Ayarlar",
      path: "/settings/overview", // Default to overview
      icon: Settings,
      show: true, // All roles can access settings (but tabs differ)
      submenu: [
        {
          name: "Genel Bakış",
          path: "/settings/overview",
          icon: Settings,
          show: true,
        },
        {
          name: "Profil",
          path: "/settings/profile",
          icon: User,
          show: true, // All users can edit their profile
        },
        {
          name: "Güvenlik",
          path: "/settings/security",
          icon: Shield,
          show: true, // All users can change password
        },
        {
          name: "Bildirim Tercihleri",
          path: "/settings/notifications",
          icon: BellRing,
          show: true, // All users can manage notification preferences
        },
        {
          name: "Organizasyon",
          path: "/settings/organization",
          icon: Building2,
          show: canViewAnalytics(userRole), // Only MANAGER+ can edit organization
        },
        {
          name: "Fatura & Plan",
          path: "/settings/billing",
          icon: CreditCard,
          show: canViewAnalytics(userRole), // Only MANAGER+ can manage billing
        },
      ],
    },
  ];

  // Filter visible menu items
  const visibleMenuItems = menuItems.filter((item) => item.show);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">İKAI HR</h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
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
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            {/* Logo */}
            <div className="hidden lg:flex items-center h-16 px-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-blue-600">İKAI HR</h1>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                // Handle items with submenu (like Offers)
                if (item.submenu) {
                  const visibleSubmenuItems = item.submenu.filter(
                    (subItem: any) => subItem.show
                  );

                  const isExpanded = getSubmenuState(item.path);
                  const isActive = isSubmenuActive(item.path);

                  return (
                    <div key={item.path}>
                      <button
                        onClick={() => toggleSubmenu(item.path)}
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

                // Regular menu item (no submenu)
                return (
                  <Link
                    key={item.path}
                    href={item.path}
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
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <RoleBadge role={user?.role} size="sm" />
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
          <main className="flex-1 overflow-x-hidden relative">
            {/* Desktop Top Bar (hidden on mobile) */}
            <div className="hidden lg:block sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
              <div className="px-6 py-3 flex items-center justify-end">
                <NotificationBell />
              </div>
            </div>

            {children}
            <FloatingActionButton />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
