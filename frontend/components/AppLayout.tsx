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
  Settings
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/lib/store/authStore';
import { useHasRole } from '@/lib/hooks/useHasRole';
import { RoleGroups, UserRole } from '@/lib/constants/roles';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOffersExpanded, setIsOffersExpanded] = useState(true); // Always expanded by default

  // Role-based access control
  const canManageHR = useHasRole(RoleGroups.HR_MANAGERS);
  const canViewAnalytics = useHasRole(RoleGroups.ANALYTICS_VIEWERS);
  const isAdmin = useHasRole(RoleGroups.ADMINS);
  const isSuperAdmin = useHasRole([UserRole.SUPER_ADMIN]);

  // Sidebar menü itemları - Dashboard visible to all
  const allMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  // Offer submenu items - split by role
  const hrManagerOfferItems = [
    { name: 'Yeni Teklif', path: '/offers/wizard', icon: Plus },
    { name: 'Tüm Teklifler', path: '/offers', icon: FileText },
  ];

  const analyticsOfferItems = [
    { name: 'Şablonlar', path: '/offer-templates', icon: Layers },
    { name: 'Analytics', path: '/offers/analytics', icon: BarChart3 },
  ];

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
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
              {/* Dashboard - visible to all */}
              {allMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

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

              {/* HR Manager menu items */}
              {canManageHR && (
                <>
                  <Link
                    href="/wizard"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-150
                      ${
                        pathname === '/wizard'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Wand2 size={20} />
                    <span>Analiz Sihirbazı</span>
                  </Link>

                  <Link
                    href="/job-postings"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-150
                      ${
                        pathname === '/job-postings'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Briefcase size={20} />
                    <span>İş İlanları</span>
                  </Link>

                  <Link
                    href="/candidates"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-150
                      ${
                        pathname === '/candidates'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Users size={20} />
                    <span>Adaylar</span>
                  </Link>

                  <Link
                    href="/analyses"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-150
                      ${
                        pathname === '/analyses'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Clock size={20} />
                    <span>Geçmiş Analizlerim</span>
                  </Link>
                </>
              )}

              {/* Offers collapsible menu - HR_MANAGERS */}
              {canManageHR && (
                <div>
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
                      <FileText size={20} />
                      <span>Teklifler</span>
                    </div>
                    {isOffersExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {/* Submenu */}
                  {isOffersExpanded && (
                    <div className="mt-1 ml-4 space-y-1">
                      {/* HR_MANAGERS: Yeni Teklif, Tüm Teklifler */}
                      {hrManagerOfferItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`
                              flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                              transition-colors duration-150
                              ${
                                isActive
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }
                            `}
                          >
                            <Icon size={18} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}

                      {/* ANALYTICS_VIEWERS: Şablonlar, Analytics */}
                      {canViewAnalytics && analyticsOfferItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`
                              flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                              transition-colors duration-150
                              ${
                                isActive
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }
                            `}
                          >
                            <Icon size={18} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Admin-only menu items */}
              {isAdmin && (
                <>
                  <Link
                    href="/team"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-150
                      ${
                        pathname === '/team'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Users size={20} />
                    <span>Team</span>
                  </Link>

                  <Link
                    href="/settings/organization"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-150
                      ${
                        pathname === '/settings/organization'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </Link>
                </>
              )}

              {/* Super Admin only */}
              {isSuperAdmin && (
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
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{user?.role}</span>
                    {user?.role === 'ADMIN' && (
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
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
