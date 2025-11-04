'use client';

import { Activity } from 'lucide-react';

interface ActivityTodayWidgetProps {
  data: {
    loginTime: string;
    onlineTime: string;
    pageViews: number;
  };
}

export function ActivityTodayWidget({ data }: ActivityTodayWidgetProps) {
  const { loginTime, onlineTime, pageViews } = data;

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-green-600" />
        Bugünkü Aktivite
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Giriş Saati</span>
          <span className="text-sm font-semibold text-slate-800">{loginTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Çevrimiçi Süre</span>
          <span className="text-sm font-semibold text-slate-800">{onlineTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Sayfa Ziyareti</span>
          <span className="text-sm font-semibold text-slate-800">{pageViews} sayfa</span>
        </div>
      </div>
    </div>
  );
}
