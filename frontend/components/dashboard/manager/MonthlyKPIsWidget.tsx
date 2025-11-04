"use client";

import { Target, CheckCircle } from "lucide-react";

interface MonthlyKPIsWidgetProps {
  data: {
    kpis: Array<{
      name: string;
      current: number;
      target: number;
      percentage: number;
    }>;
  } | null;
}

export function MonthlyKPIsWidget({ data }: MonthlyKPIsWidgetProps) {
  // Use real KPIs from backend API - no fallback mock data!
  const kpis = data?.kpis || [];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white shadow-sm rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          Aylık KPI'lar
        </h3>

        <div className="space-y-4">
          {kpis.map((kpi) => (
            <div key={kpi.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-700">{kpi.name}</span>
                <span className="text-sm font-bold text-slate-800">
                  {kpi.current} / {kpi.target}
                </span>
              </div>
              <div className="relative w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${
                    kpi.percentage >= 100
                      ? "bg-green-500"
                      : kpi.percentage >= 75
                        ? "bg-blue-500"
                        : kpi.percentage >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(kpi.percentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-xs font-medium ${
                    kpi.percentage >= 100
                      ? "text-green-600"
                      : kpi.percentage >= 75
                        ? "text-blue-600"
                        : kpi.percentage >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                  }`}
                >
                  {kpi.percentage}%
                </span>
                {kpi.percentage >= 100 && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
