"use client";

import { Briefcase, ArrowUp, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ActiveJobPostingsWidgetProps {
  data: {
    activePostings: number;
    todayApplications: number;
  } | null;
}

export function ActiveJobPostingsWidget({
  data,
}: ActiveJobPostingsWidgetProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl hover:shadow-md transition-all group cursor-pointer">
      <div className="p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-100 rounded-full opacity-20 group-hover:scale-110 transition-transform" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs text-emerald-600 font-medium px-2 py-1 bg-emerald-50 rounded-full">
              Aktif
            </span>
          </div>

          <h3 className="text-3xl font-bold text-slate-800 mb-1">
            {data?.activePostings || 0}
          </h3>
          <p className="text-sm text-slate-600 mb-3">Aktif İş İlanı</p>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ArrowUp className="w-3 h-3 text-green-500" />
            <span>{data?.todayApplications || 0} başvuru bugün</span>
          </div>

          <Link
            href="/job-postings"
            className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 inline-flex"
          >
            Tümünü Gör
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
