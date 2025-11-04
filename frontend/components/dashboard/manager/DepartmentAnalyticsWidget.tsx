'use client';

import { BarChart3, UserPlus, Clock, CheckCircle, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

interface DepartmentAnalyticsWidgetProps {
  data: {
    monthHires: number;
    hiresChange: number;
    avgTimeToHire: number;
    timeChange: number;
    acceptanceRate: number;
    acceptanceChange: number;
    costPerHire: number;
    costChange: number;
  } | null;
}

export function DepartmentAnalyticsWidget({ data }: DepartmentAnalyticsWidgetProps) {
  const metrics = [
    {
      label: 'İşe Alım',
      value: data?.monthHires || 0,
      icon: <UserPlus className="w-4 h-4" />,
      change: data?.hiresChange || 0,
      color: 'green',
      reversed: false
    },
    {
      label: 'Ort. Süre',
      value: `${data?.avgTimeToHire || 0} gün`,
      icon: <Clock className="w-4 h-4" />,
      change: data?.timeChange || 0,
      color: 'blue',
      reversed: true
    },
    {
      label: 'Kabul Oranı',
      value: `${data?.acceptanceRate || 0}%`,
      icon: <CheckCircle className="w-4 h-4" />,
      change: data?.acceptanceChange || 0,
      color: 'cyan',
      reversed: false
    },
    {
      label: 'Kişi Başı Maliyet',
      value: `₺${data?.costPerHire || 0}`,
      icon: <DollarSign className="w-4 h-4" />,
      change: data?.costChange || 0,
      color: 'purple',
      reversed: true
    }
  ];

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-white shadow-sm hover:shadow-md transition-shadow rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-cyan-600" />
          Departman Analitikleri
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {metrics.map(metric => (
            <div key={metric.label} className="p-3 bg-white rounded-lg border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                  <div className={`text-${metric.color}-600`}>{metric.icon}</div>
                </div>
                {metric.change !== 0 && (
                  <span className={`text-xs flex items-center gap-1 ${
                    metric.reversed
                      ? (metric.change <= 0 ? 'text-green-600' : 'text-red-600')
                      : (metric.change >= 0 ? 'text-green-600' : 'text-red-600')
                  }`}>
                    {((metric.reversed && metric.change <= 0) || (!metric.reversed && metric.change >= 0)) ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {Math.abs(metric.change)}%
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-slate-800">{metric.value}</p>
              <p className="text-xs text-slate-600">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
