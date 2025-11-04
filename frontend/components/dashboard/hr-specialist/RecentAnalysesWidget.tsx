"use client";

import { Zap, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface RecentAnalysesWidgetProps {
  data: Array<{
    id: string;
    createdAt: string;
    jobPosting: {
      title: string;
    };
    candidateCount: number;
    topScore: number;
  }> | null;
}

export function RecentAnalysesWidget({ data }: RecentAnalysesWidgetProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM", { locale: tr });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-emerald-600" />
          Son Analizler
        </h3>

        <div className="space-y-3">
          {data && data.length > 0 ? (
            data.slice(0, 5).map((analysis) => (
              <Link
                key={analysis.id}
                href={`/analyses/${analysis.id}`}
                className="block p-3 rounded-lg hover:bg-emerald-50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-emerald-600">
                    {analysis.jobPosting.title}
                  </h4>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                    {formatDate(analysis.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {analysis.candidateCount} aday
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    En iyi: {analysis.topScore}%
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">Henüz analiz yok</p>
            </div>
          )}
        </div>

        {data && data.length > 0 && (
          <Link
            href="/analyses"
            className="block text-center mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Tümünü Gör →
          </Link>
        )}
      </div>
    </div>
  );
}
