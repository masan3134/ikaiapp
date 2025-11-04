"use client";

import {
  BarChart3,
  Wand2,
  FileText,
  Briefcase,
  Mail,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface PlatformAnalyticsWidgetProps {
  data: {
    totalAnalyses: number;
    totalCVs: number;
    totalJobPostings: number;
    totalOffers: number;
    analysesGrowth?: number;
    cvsGrowth?: number;
    jobsGrowth?: number;
    offersGrowth?: number;
  };
}

export default function PlatformAnalyticsWidget({
  data,
}: PlatformAnalyticsWidgetProps) {
  const stats = [
    {
      label: "Toplam Analiz",
      value: data.totalAnalyses?.toLocaleString() || "0",
      icon: <Wand2 className="w-5 h-5" />,
      color: "purple",
      change: data.analysesGrowth || 0,
    },
    {
      label: "Toplam CV",
      value: data.totalCVs?.toLocaleString() || "0",
      icon: <FileText className="w-5 h-5" />,
      color: "blue",
      change: data.cvsGrowth || 0,
    },
    {
      label: "İş İlanları",
      value: data.totalJobPostings?.toLocaleString() || "0",
      icon: <Briefcase className="w-5 h-5" />,
      color: "green",
      change: data.jobsGrowth || 0,
    },
    {
      label: "Gönderilen Teklifler",
      value: data.totalOffers?.toLocaleString() || "0",
      icon: <Mail className="w-5 h-5" />,
      color: "orange",
      change: data.offersGrowth || 0,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-lg transition-all rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Platform Analitikleri
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`p-3 bg-white rounded-lg border border-${stat.color}-100`}
            >
              <div
                className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-2`}
              >
                <div className={`text-${stat.color}-600`}>{stat.icon}</div>
              </div>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-600 mb-1">{stat.label}</p>
              <div
                className={`flex items-center gap-1 text-xs ${
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
