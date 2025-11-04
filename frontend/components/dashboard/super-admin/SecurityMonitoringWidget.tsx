"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

interface SecurityMonitoringWidgetProps {
  data: {
    securityScore: number;
    failedLogins: number;
    suspiciousActivity: number;
    rateLimitHits: number;
    lastEvent: string;
  };
}

export default function SecurityMonitoringWidget({
  data,
}: SecurityMonitoringWidgetProps) {
  const security = data || {
    securityScore: 95,
    failedLogins: 0,
    suspiciousActivity: 0,
    rateLimitHits: 0,
    lastEvent: "",
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          Güvenlik İzleme
        </h3>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm text-slate-700">Güvenlik Skoru</span>
            <span className="text-2xl font-bold text-green-600">
              {security.securityScore}/100
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Failed Logins (24h)</span>
            <span
              className={`font-semibold ${
                security.failedLogins > 10 ? "text-red-600" : "text-green-600"
              }`}
            >
              {security.failedLogins}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Suspicious Activity</span>
            <span
              className={`font-semibold ${
                security.suspiciousActivity > 0
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {security.suspiciousActivity}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">API Rate Limits Hit</span>
            <span className="font-semibold text-slate-800">
              {security.rateLimitHits}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 mb-1">Son Güvenlik Olayı</p>
          <p className="text-sm text-slate-800">
            {security.lastEvent || "Olay yok ✅"}
          </p>
        </div>

        <Link
          href="/super-admin/security-logs"
          className="block text-center mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Güvenlik Logları →
        </Link>
      </div>
    </div>
  );
}
