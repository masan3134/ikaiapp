"use client";

import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import { Card, CardBody } from "@nextui-org/react";

interface OrganizationStatsWidgetProps {
  data: {
    totalUsers: number;
    activeToday: number;
    plan: string;
  };
  organization: any;
}

export default function OrganizationStatsWidget({
  data,
  organization,
}: OrganizationStatsWidgetProps) {
  const usagePercent = organization?.maxUsers
    ? (data.totalUsers / organization.maxUsers) * 100
    : 0;

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all group">
      <CardBody className="relative overflow-hidden p-6">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-100 rounded-full opacity-20 group-hover:scale-110 transition-transform" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                data.plan === "ENTERPRISE"
                  ? "bg-purple-100 text-purple-700"
                  : data.plan === "PRO"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
              }`}
            >
              {data.plan}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-slate-800 mb-1">
            {data.totalUsers}
            <span className="text-lg text-slate-400">
              /{organization?.maxUsers || 0}
            </span>
          </h3>
          <p className="text-sm text-slate-600 mb-3">Toplam Kullanıcı</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Bugün Aktif</span>
              <span className="font-semibold text-green-600">
                {data.activeToday}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </div>

          <Link
            href="/team"
            className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 w-fit"
          >
            Kullanıcıları Yönet
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
