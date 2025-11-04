"use client";

import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ActivityTimelineChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function ActivityTimelineChart({ data }: ActivityTimelineChartProps) {
  const activityData = data && data.length > 0 ? data : [];

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
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#cbd5e1" }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#cbd5e1" }}
            label={{
              value: "Aktivite",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "#64748b" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#334155", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#64748b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorActivity)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {activityData.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Son 7 gün</span>
          <span>
            Toplam aktivite:{" "}
            {activityData.reduce((sum, item) => sum + item.count, 0)}
          </span>
        </div>
      )}
    </div>
  );
}
