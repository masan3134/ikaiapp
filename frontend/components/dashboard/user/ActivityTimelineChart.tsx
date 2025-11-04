'use client';

import { TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

interface ActivityTimelineChartProps {
  data: Array<{
    date: string;
    duration: number;
    logins: number;
  }>;
}

export function ActivityTimelineChart({ data }: ActivityTimelineChartProps) {
  // Generate default data if none provided
  const activityData = data && data.length > 0 ? data : [
    { date: 'Pzt', duration: 45, logins: 2 },
    { date: 'Sal', duration: 120, logins: 5 },
    { date: 'Çar', duration: 90, logins: 3 },
    { date: 'Per', duration: 150, logins: 6 },
    { date: 'Cum', duration: 60, logins: 2 },
    { date: 'Cmt', duration: 30, logins: 1 },
    { date: 'Paz', duration: 20, logins: 1 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-slate-600" />
        Aktivite Grafiği (Son 7 Gün)
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={activityData}>
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#cbd5e1' }}
            label={{ value: 'Dakika', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            labelStyle={{ color: '#334155', fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="duration"
            stroke="#64748b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorActivity)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Toplam giriş: {activityData.reduce((sum, item) => sum + item.logins, 0)}</span>
        <span>Toplam süre: {activityData.reduce((sum, item) => sum + item.duration, 0)} dk</span>
      </div>
    </div>
  );
}
