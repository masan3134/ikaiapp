'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Calendar
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useAuthStore } from '@/lib/store/authStore';
import { useHasRole } from '@/lib/hooks/useHasRole';
import { RoleGroups, UserRole } from '@/lib/constants/roles';
import {
  canViewJobPostings,
  canViewCandidates,
  canViewAnalyses,
  canViewOffers,
  canViewInterviews,
  canViewTeam,
  canViewAnalytics,
  isSuperAdmin
} from '@/lib/utils/rbac';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOffersExpanded, setIsOffersExpanded] = useState(true); // Always expanded by default

  // Get user role for RBAC checks
  const userRole = user?.role;

  // Define all menu items with role requirements
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      show: true // All roles can see dashboard
    },
    {
      name: 'Analiz Sihirbazı',
      path: '/wizard',
      icon: Wand2,
      show: canViewAnalyses(userRole)
    },
    {
      name: 'İş İlanları',
      path: '/job-postings',
      icon: Briefcase,
      show: canViewJobPostings(userRole)
    },
    {
      name: 'Adaylar',
      path: '/candidates',
      icon: Users,
      show: canViewCandidates(userRole)
    },
    {
      name: 'Geçmiş Analizlerim',
      path: '/analyses',
      icon: Clock,
      show: canViewAnalyses(userRole)
    },
    {
      name: 'Teklifler',
      path: '/offers',
      icon: FileText,
      show: canViewOffers(userRole),
      submenu: [
        {
          name: 'Yeni Teklif',
          path: '/offers/wizard',
          icon: Plus,
          show: canViewOffers(userRole)
        },
        {
          name: 'Tüm Teklifler',
          path: '/offers',
          icon: FileText,
          show: canViewOffers(userRole)
        },
        {
          name: 'Şablonlar',
          path: '/offer-templates',
          icon: Layers,
          show: canViewAnalytics(userRole)
        },
        {
          name: 'Analytics',
          path: '/offers/analytics',
          icon: BarChart3,
          show: canViewAnalytics(userRole)
        }
      ]
    },
    {
      name: 'Mülakatlar',
      path: '/interviews',
      icon: Calendar,
      show: canViewInterviews(userRole)
    },
    {
      name: 'Takım',
      path: '/team',
      icon: Users,
      show: canViewTeam(userRole)
    },
    {
      name: 'Analitik',
      path: '/analytics',
      icon: BarChart3,
      show: canViewAnalytics(userRole)
    },
    {
      name: 'Ayarlar',
      path: '/settings/organization',
      icon: Settings,
      show: true // All roles can access settings (but tabs differ)
    }
  ];

  // Filter visible menu items
  const visibleMenuItems = menuItems.filter(item => item.show);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
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
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
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
                  const visibleSubmenuItems = item.submenu.filter((subItem: any) => subItem.show);

                  return (
                    <div key={item.path}>
                      <button
                        onClick={() => setIsOffersExpanded(!isOffersExpanded)}
                        className={`
                          w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg
                          transition-colors duration-150
                          ${
                            pathname.startsWith('/offers') || pathname.startsWith('/offer-templates')
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          <span>{item.name}</span>
                        </div>
                        {isOffersExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>

                      {/* Submenu */}
                      {isOffersExpanded && (
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
                                      ? 'bg-blue-50 text-blue-600 font-medium'
                                      : 'text-gray-600 hover:bg-gray-50'
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
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Super Admin only */}
              {isSuperAdmin(userRole) && (
                <Link
                  href="/super-admin"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors duration-150
                    ${
                      pathname === '/super-admin'
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Shield size={20} />
                  <span>Super Admin</span>
                </Link>
              )}
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
            {children}
            <FloatingActionButton />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
