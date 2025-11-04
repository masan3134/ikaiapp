'use client';

import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PlatformGrowthChartProps {
  data: {
    chartData: any[];
    metrics: {
      orgGrowth: number;
      userGrowth: number;
      revenueGrowth: number;
      activityGrowth: number;
    };
  };
}

export default function PlatformGrowthChart({ data }: PlatformGrowthChartProps) {
  const growthData = data?.chartData || [];
  const metrics = data?.metrics || { orgGrowth: 0, userGrowth: 0, revenueGrowth: 0, activityGrowth: 0 };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-600" />
            Platform Büyüme Trendi (90 Gün)
          </h3>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1 rounded bg-rose-100 text-rose-700 font-medium">
              Tümü
            </button>
            <button className="text-xs px-3 py-1 rounded bg-slate-100 text-slate-700">
              30 Gün
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={growthData}>
            <defs>
              <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #fecdd3',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="organizations"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ fill: '#f43f5e', r: 3 }}
              name="Organizasyonlar"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              name="Kullanıcılar"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
              name="Gelir (₺)"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="activity"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ fill: '#a855f7', r: 3 }}
              name="Aktivite"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: 'Org Büyüme', value: `+${metrics.orgGrowth}%`, color: 'rose' },
            { label: 'Kullanıcı Büyüme', value: `+${metrics.userGrowth}%`, color: 'blue' },
            { label: 'Gelir Büyüme', value: `+${metrics.revenueGrowth}%`, color: 'green' },
            { label: 'Aktivite Artışı', value: `+${metrics.activityGrowth}%`, color: 'purple' }
          ].map(metric => (
            <div key={metric.label} className={`text-center p-2 bg-${metric.color}-50 rounded-lg`}>
              <p className="text-xs text-slate-600">{metric.label}</p>
              <p className={`text-sm font-bold text-${metric.color}-600`}>{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
