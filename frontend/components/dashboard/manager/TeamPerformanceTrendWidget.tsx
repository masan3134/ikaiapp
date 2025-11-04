'use client';

import { TrendingUp } from 'lucide-react';

interface TeamPerformanceTrendWidgetProps {
  data: {
    trend: Array<{
      date: string;
      productivity: number;
      quality: number;
      delivery: number;
    }>;
    currentProductivity: number;
    currentQuality: number;
    currentDelivery: number;
  } | null;
}

export function TeamPerformanceTrendWidget({ data }: TeamPerformanceTrendWidgetProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Takım Performans Trendi (30 Gün)
        </h3>

        {/* Chart Placeholder - Real implementation would use recharts */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8 mb-4">
          <div className="flex items-end justify-around h-40">
            {[65, 70, 75, 80, 85, 88, 90].map((height, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="w-8 bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-slate-500">{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-xs text-slate-600">Verimlilik</span>
            </div>
            <p className="text-lg font-bold text-blue-600">{data?.currentProductivity || 0}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs text-slate-600">Kalite</span>
            </div>
            <p className="text-lg font-bold text-green-600">{data?.currentQuality || 0}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-xs text-slate-600">Teslimat</span>
            </div>
            <p className="text-lg font-bold text-yellow-600">{data?.currentDelivery || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
