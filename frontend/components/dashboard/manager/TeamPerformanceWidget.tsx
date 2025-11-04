'use client';

import { Users } from 'lucide-react';
import Link from 'next/link';

interface TeamPerformanceWidgetProps {
  data: {
    teamScore: number;
    activeMembers: number;
    totalMembers: number;
    completedTasks: number;
    satisfaction: number;
  } | null;
}

export function TeamPerformanceWidget({ data }: TeamPerformanceWidgetProps) {
  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-all rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          Takım Performansı
        </h3>

        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{data?.teamScore || 0}</p>
              <p className="text-xs text-slate-600">Skor</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Aktif Üyeler</span>
            <span className="font-semibold text-slate-800">
              {data?.activeMembers || 0}/{data?.totalMembers || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Tamamlanan Görev</span>
            <span className="font-semibold text-green-600">{data?.completedTasks || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Memnuniyet</span>
            <span className="font-semibold text-blue-600">{data?.satisfaction || 0}%</span>
          </div>
        </div>

        <Link
          href="/team"
          className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Detaylı Rapor →
        </Link>
      </div>
    </div>
  );
}
