'use client';

import { TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface HiringPipelineWidgetProps {
  data: Array<{
    stage: string;
    count: number;
    percentage: number;
  }> | null;
}

export function HiringPipelineWidget({ data }: HiringPipelineWidgetProps) {
  const pipelineData = data || [
    { stage: 'Başvurular', count: 0, percentage: 100 },
    { stage: 'Eleme', count: 0, percentage: 0 },
    { stage: 'Mülakat', count: 0, percentage: 0 },
    { stage: 'Teklif', count: 0, percentage: 0 },
    { stage: 'İşe Alım', count: 0, percentage: 0 },
  ];

  const conversionRates = [
    { label: 'Eleme → Mülakat', value: 65 },
    { label: 'Mülakat → Teklif', value: 45 },
    { label: 'Teklif → İşe Alım', value: 85 },
    { label: 'Toplam Dönüşüm', value: 25 },
  ];

  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          İşe Alım Hunisi (Bu Ay)
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={pipelineData}
            layout="vertical"
            margin={{ left: 80, right: 40, top: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="pipelineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" stroke="#64748b" style={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="stage"
              tick={{ fontSize: 12, fill: '#475569' }}
              stroke="#64748b"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #d1fae5',
                borderRadius: '8px',
                fontSize: 12,
              }}
              formatter={(value: any, name: any, props: any) => [
                `${value} aday (${props.payload.percentage}%)`,
                props.payload.stage,
              ]}
            />
            <Bar
              dataKey="count"
              fill="url(#pipelineGradient)"
              radius={[0, 8, 8, 0]}
            >
              <LabelList
                dataKey="count"
                position="right"
                formatter={(value: number) => `${value}`}
                style={{ fontSize: 12, fontWeight: 600, fill: '#059669' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Conversion rates */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {conversionRates.map((rate, idx) => (
            <div key={idx} className="text-center p-3 bg-emerald-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">{rate.label}</p>
              <p className="text-sm font-bold text-emerald-600">{rate.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
