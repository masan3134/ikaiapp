'use client';

import { AlertCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ActionItemsWidgetProps {
  data: {
    urgentCount: number;
    approvalCount: number;
    todayTasksCount: number;
  } | null;
}

export function ActionItemsWidget({ data }: ActionItemsWidgetProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-white shadow-sm hover:shadow-md transition-shadow border-l-4 border-yellow-500 rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          Dikkat Gereken İşler
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-red-600">{data?.urgentCount || 0}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Acil</p>
                <p className="text-xs text-slate-500">Hemen yanıt gerekli</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-yellow-600">{data?.approvalCount || 0}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Onay Bekliyor</p>
                <p className="text-xs text-slate-500">Teklifler, bütçeler</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">{data?.todayTasksCount || 0}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Bugün Biten</p>
                <p className="text-xs text-slate-500">Görevler ve toplantılar</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <button
          onClick={() => router.push('/tasks')}
          className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Tümünü Görüntüle
        </button>
      </div>
    </div>
  );
}
