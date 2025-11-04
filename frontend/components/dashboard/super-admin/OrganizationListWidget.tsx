'use client';

import Link from 'next/link';
import { Building2, Edit2, Trash2 } from 'lucide-react';

interface OrganizationListWidgetProps {
  data: any[];
  total: number;
}

export default function OrganizationListWidget({ data, total }: OrganizationListWidgetProps) {
  const organizations = data || [];

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-rose-600" />
            Organizasyonlar
          </h3>
          <button className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded font-medium">
            + Yeni
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-2">
          {organizations.slice(0, 5).map((org: any) => (
            <div
              key={org.id}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-all group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                  org.plan === 'ENTERPRISE' ? 'bg-purple-500' :
                  org.plan === 'PRO' ? 'bg-blue-500' :
                  'bg-slate-400'
                }`}>
                  {org.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {org.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      org.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                      org.plan === 'PRO' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {org.plan}
                    </span>
                    <span className="text-xs text-slate-500">
                      {org.totalUsers || 0} kullanıcı
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-100 rounded transition-all">
                  <Edit2 className="w-4 h-4 text-blue-600" />
                </button>
                <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded transition-all">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/super-admin/organizations"
          className="block text-center mt-4 text-sm text-rose-600 hover:text-rose-700 font-medium"
        >
          Tüm Organizasyonlar ({total}) →
        </Link>
      </div>
    </div>
  );
}
