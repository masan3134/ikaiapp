'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface UsageMetricsChartProps {
  data: Array<{
    date: string;
    analyses: number;
    cvs: number;
    activeUsers: number;
  }>;
  usage: any;
}

export default function UsageMetricsChart({ data, usage }: UsageMetricsChartProps) {
  const [activeMetric, setActiveMetric] = useState<'analyses' | 'cvs' | 'activeUsers'>('analyses');

  // Fallback data if empty
  const chartData = data.length > 0 ? data : [
    { date: '1 Kas', analyses: 0, cvs: 0, activeUsers: 0 },
    { date: '2 Kas', analyses: 0, cvs: 0, activeUsers: 0 },
    { date: '3 Kas', analyses: 0, cvs: 0, activeUsers: 0 },
    { date: '4 Kas', analyses: 0, cvs: 0, activeUsers: 0 }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Kullanım Metrikleri (30 Gün)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveMetric('analyses')}
              className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                activeMetric === 'analyses'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Analiz
            </button>
            <button
              onClick={() => setActiveMetric('cvs')}
              className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                activeMetric === 'cvs'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              CV
            </button>
            <button
              onClick={() => setActiveMetric('activeUsers')}
              className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                activeMetric === 'activeUsers'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Kullanıcı
            </button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="analysisGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="cvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e9d5ff',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="analyses"
              stroke="#a855f7"
              fill="url(#analysisGrad)"
              name="Analizler"
            />
            <Area
              type="monotone"
              dataKey="cvs"
              stroke="#3b82f6"
              fill="url(#cvGrad)"
              name="CV'ler"
            />
            <Area
              type="monotone"
              dataKey="activeUsers"
              stroke="#10b981"
              fill="url(#userGrad)"
              name="Aktif Kullanıcılar"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-purple-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-slate-600 mb-1">Analiz Limiti</p>
            <p className="text-sm font-bold text-purple-600">
              {usage?.monthlyAnalysisCount || 0}/{usage?.maxAnalysisPerMonth || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 mb-1">CV Limiti</p>
            <p className="text-sm font-bold text-blue-600">
              {usage?.monthlyCvCount || 0}/{usage?.maxCvPerMonth || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 mb-1">Kullanıcı Limiti</p>
            <p className="text-sm font-bold text-green-600">
              {usage?.totalUsers || 0}/{usage?.maxUsers || 0}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
