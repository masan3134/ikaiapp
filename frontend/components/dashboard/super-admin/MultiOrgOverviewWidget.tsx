'use client';

import Link from 'next/link';
import { Building2, Crown, Star, Users } from 'lucide-react';

interface MultiOrgOverviewWidgetProps {
  data: {
    total: number;
    planCounts: any;
    activeOrgs: number;
    churnedOrgs: number;
  };
}

export default function MultiOrgOverviewWidget({ data }: MultiOrgOverviewWidgetProps) {
  // Convert planCounts to usable format
  const planBreakdown = {
    enterprise: data.planCounts?.find((p: any) => p.plan === 'ENTERPRISE')?._count || 0,
    pro: data.planCounts?.find((p: any) => p.plan === 'PRO')?._count || 0,
    free: data.planCounts?.find((p: any) => p.plan === 'FREE')?._count || 0,
  };

  return (
    <div className="bg-white shadow-sm hover:shadow-lg transition-all rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-rose-600" />
          Organizasyonlar
        </h3>
      </div>
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-red-100 rounded-full mb-3">
            <span className="text-3xl font-bold text-rose-600">{data.total}</span>
          </div>
          <p className="text-sm text-slate-600">Toplam Organizasyon</p>
        </div>

        <div className="space-y-2 mb-4">
          {[
            { plan: 'ENTERPRISE', count: planBreakdown.enterprise, color: 'purple', icon: Crown },
            { plan: 'PRO', count: planBreakdown.pro, color: 'blue', icon: Star },
            { plan: 'FREE', count: planBreakdown.free, color: 'slate', icon: Users }
          ].map(item => (
            <div key={item.plan} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                </div>
                <span className="text-sm text-slate-700">{item.plan}</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{item.count}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
          <div className="text-center">
            <p className="text-xs text-slate-600">Aktif</p>
            <p className="text-lg font-bold text-green-600">{data.activeOrgs}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600">Bu Ay Kayıp</p>
            <p className="text-lg font-bold text-red-600">{data.churnedOrgs}</p>
          </div>
        </div>

        <Link
          href="/super-admin/organizations"
          className="block mt-4 text-center text-sm text-rose-600 hover:text-rose-700 font-medium"
        >
          Tüm Organizasyonlar →
        </Link>
      </div>
    </div>
  );
}
