'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, User, CreditCard, Bell } from 'lucide-react';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Organizasyon', path: '/settings/organization', icon: Building2 },
    { name: 'Profil', path: '/settings/profile', icon: User },
    { name: 'Faturalama', path: '/settings/billing', icon: CreditCard },
    { name: 'Bildirimler', path: '/settings/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
          <p className="mt-2 text-gray-600">Hesap ve organizasyon ayarlarınızı yönetin</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.path;

              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon size={18} />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
