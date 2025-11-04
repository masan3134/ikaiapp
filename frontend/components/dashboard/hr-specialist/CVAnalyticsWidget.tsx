'use client';

import { BarChart2 } from 'lucide-react';

interface CVAnalyticsWidgetProps {
  data: {
    weekCVs: number;
    weekAnalyses: number;
    avgScore: number;
    pendingCVs: number;
  } | null;
}

export function CVAnalyticsWidget({ data }: CVAnalyticsWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white shadow-sm rounded-xl hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-600" />
            CV Analitik
          </h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            Bu Hafta
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-slate-800">{data?.weekCVs || 0}</p>
            <p className="text-xs text-slate-600">CV Yüklendi</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{data?.weekAnalyses || 0}</p>
            <p className="text-xs text-slate-600">Analiz Yapıldı</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{data?.avgScore || 0}%</p>
            <p className="text-xs text-slate-600">Ort. Eşleşme</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{data?.pendingCVs || 0}</p>
            <p className="text-xs text-slate-600">Bekleyen</p>
          </div>
        </div>

        <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          Detaylı Rapor
        </button>
      </div>
    </div>
  );
}
