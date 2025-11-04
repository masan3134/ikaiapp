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
  Calendar,
  FileText,
  ChevronDown,
  ChevronRight,
  Plus,
  BarChart3,
  Layers,
  Settings,
  UserCog
} from 'lucide-react';
import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/lib/store/authStore';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { OnboardingGuard } from '@/components/OnboardingGuard';

// Dynamic import to avoid SSR issues (uses localStorage/hooks)
const NotificationBell = dynamic(
  () => import('@/components/notifications/NotificationBellSimple'),
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

  // Sidebar menü itemları (HR workflow order)
  const allMenuItems = [
    // 1. Dashboard (always first)
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    // 2. İş İlanları (start of hiring workflow)
    { name: 'İş İlanları', path: '/job-postings', icon: Briefcase },
    // 3. Adaylar (candidates apply to job postings)
    { name: 'Adaylar', path: '/candidates', icon: Users },
    // 4. Analiz Sihirbazı (analyze candidates)
    { name: 'Analiz Sihirbazı', path: '/wizard', icon: Wand2 },
    // 5. Geçmiş Analizlerim (past analyses)
    { name: 'Geçmiş Analizlerim', path: '/analyses', icon: Clock },
    // 6. Teklifler (make offers to selected candidates) - has submenu
    { name: 'Teklifler', path: '/offers', icon: FileText, hasSubmenu: true },
    // 7. Mülakatlar (interview scheduled candidates)
    { name: 'Mülakatlar', path: '/interviews', icon: Calendar },
    // 8. Takım (team management - MANAGER+)
    ...(user?.role === 'MANAGER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? [{ name: 'Takım', path: '/team', icon: UserCog }] : []),
    // 8. Analitik (analytics & reports - MANAGER+)
    ...(user?.role === 'MANAGER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? [{ name: 'Analitik', path: '/analytics', icon: BarChart3 }] : []),
    // 9. Ayarlar (settings - all roles)
    { name: 'Ayarlar', path: '/settings/profile', icon: Settings },
    // 9. Super Admin (only for SUPER_ADMIN role)
    ...(user?.role === 'SUPER_ADMIN' ? [{ name: 'Süper Yönetici', path: '/super-admin', icon: Shield }] : []),
  ];

  // Offer submenu items
  const offerSubMenuItems = [
    { name: 'Tüm Teklifler', path: '/offers', icon: FileText },
    { name: 'Yeni Teklif', path: '/offers/wizard', icon: Plus },
    { name: 'Şablonlar', path: '/offers/templates', icon: Layers },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
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
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
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

                // Handle Teklifler with submenu
                if (item.hasSubmenu && item.name === 'Teklifler') {
                  return (
                    <div key={item.path}>
                      <button
                        onClick={() => setIsOffersExpanded(!isOffersExpanded)}
                        className={`
                          w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg
                          transition-colors duration-150
                          ${
                            pathname.startsWith('/offers')
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
                          {offerSubMenuItems.map((subItem) => {
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

                // Regular menu item
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
            </nav>

            {/* User Section */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
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
            {/* Desktop Top Bar - Bell Icon (hidden on mobile) */}
            <div className="hidden lg:block sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
              <div className="px-6 py-3 flex items-center justify-end">
                <NotificationBell />
              </div>
            </div>

            {children}
          </main>
        </div>
        </div>
        </OnboardingGuard>
      </OrganizationProvider>
    </ProtectedRoute>
  );
}
