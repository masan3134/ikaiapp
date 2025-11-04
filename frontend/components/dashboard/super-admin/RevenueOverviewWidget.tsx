'use client';

import { DollarSign, TrendingUp } from 'lucide-react';

interface RevenueOverviewWidgetProps {
  data: {
    mrr: number;
    mrrGrowth: number;
    avgLTV: number;
    enterprise: number;
    pro: number;
  };
}

export default function RevenueOverviewWidget({ data }: RevenueOverviewWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-lg transition-all rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Gelir Özeti
        </h3>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white mb-3">
            <p className="text-xs mb-1 opacity-90">Aylık Yinelenen Gelir</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">₺{data.mrr?.toLocaleString() || 0}</span>
              <span className="text-sm opacity-90">/ay</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>+{data.mrrGrowth || 0}% bu ay</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">ARR</p>
              <p className="text-lg font-bold text-blue-600">
                ₺{((data.mrr || 0) * 12).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">LTV Ort.</p>
              <p className="text-lg font-bold text-purple-600">
                ₺{data.avgLTV?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-600 mb-2">Plan Bazlı Gelir</p>
          {[
            { plan: 'ENTERPRISE', amount: data.enterprise || 0, color: 'purple' },
            { plan: 'PRO', amount: data.pro || 0, color: 'blue' },
            { plan: 'FREE', amount: 0, color: 'slate' }
          ].map(item => (
            <div key={item.plan} className="flex items-center justify-between">
              <span className="text-sm text-slate-700">{item.plan}</span>
              <span className={`text-sm font-bold text-${item.color}-600`}>
                ₺{item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
