"use client";

import {
  BarChart3,
  FileText,
  Wand2,
  Calendar,
  Mail,
  UserCheck,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface MonthlyStatsWidgetProps {
  data: {
    applications: number;
    applicationsChange: number;
    analyses: number;
    analysesChange: number;
    interviews: number;
    interviewsChange: number;
    offers: number;
    offersChange: number;
    hires: number;
    hiresChange: number;
    conversionRate: number;
    conversionChange: number;
  } | null;
}

export function MonthlyStatsWidget({ data }: MonthlyStatsWidgetProps) {
  const stats = [
    {
      label: "Başvurular",
      value: data?.applications || 0,
      icon: <FileText className="w-4 h-4" />,
      color: "blue",
      change: data?.applicationsChange || 0,
    },
    {
      label: "Analizler",
      value: data?.analyses || 0,
      icon: <Wand2 className="w-4 h-4" />,
      color: "purple",
      change: data?.analysesChange || 0,
    },
    {
      label: "Mülakatlar",
      value: data?.interviews || 0,
      icon: <Calendar className="w-4 h-4" />,
      color: "orange",
      change: data?.interviewsChange || 0,
    },
    {
      label: "Teklifler",
      value: data?.offers || 0,
      icon: <Mail className="w-4 h-4" />,
      color: "indigo",
      change: data?.offersChange || 0,
    },
    {
      label: "İşe Alımlar",
      value: data?.hires || 0,
      icon: <UserCheck className="w-4 h-4" />,
      color: "green",
      change: data?.hiresChange || 0,
    },
    {
      label: "Dönüşüm",
      value: `${data?.conversionRate || 0}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      color: "emerald",
      change: data?.conversionChange || 0,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white shadow-sm rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Aylık İstatistikler
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-3 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div
                className={`inline-flex items-center justify-center w-8 h-8 bg-${stat.color}-100 rounded-lg mb-2`}
              >
                <div className={`text-${stat.color}-600`}>{stat.icon}</div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-600 mb-1">{stat.label}</p>
              {stat.change !== undefined && (
                <div
                  className={`flex items-center justify-center gap-1 text-xs ${
                    stat.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change >= 0 ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
