"use client";

import { User } from "lucide-react";
import Link from "next/link";

interface ProfileCompletionWidgetProps {
  data: {
    completion: number;
    missingFields: number;
  };
}

export function ProfileCompletionWidget({
  data,
}: ProfileCompletionWidgetProps) {
  const { completion, missingFields } = data;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-slate-600" />
        Profil Tamamlanma
      </h3>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-600">Tamamlanma</span>
          <span className="text-sm font-semibold text-slate-800">
            {completion}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-slate-500 to-slate-700 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {missingFields > 0 && (
        <p className="text-sm text-slate-600 mb-3">
          {missingFields} alan eksik
        </p>
      )}

      <Link
        href="/settings/profile"
        className="block w-full bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors text-center text-sm font-medium"
      >
        Profili Tamamla
      </Link>
    </div>
  );
}
