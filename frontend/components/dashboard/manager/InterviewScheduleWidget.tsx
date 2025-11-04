"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";

interface InterviewScheduleWidgetProps {
  data: {
    upcomingInterviews: Array<{
      id: string;
      scheduledAt: string;
      candidate: {
        name: string;
      };
      jobPosting: {
        title: string;
      };
    }>;
  } | null;
}

export function InterviewScheduleWidget({
  data,
}: InterviewScheduleWidgetProps) {
  const upcomingInterviews = data?.upcomingInterviews || [];

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const months = [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
      ];
      const month = months[date.getMonth()];
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return { month, day, time: `${hours}:${minutes}` };
    } catch {
      return { month: "---", day: "--", time: "--:--" };
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          Mülakat Takvimi
        </h3>

        <div className="space-y-3">
          {upcomingInterviews.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Yakın zamanda mülakat yok
              </p>
            </div>
          ) : (
            upcomingInterviews.slice(0, 4).map((interview) => {
              const dateInfo = formatDate(interview.scheduledAt);
              return (
                <div
                  key={interview.id}
                  className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-blue-600 font-medium">
                        {dateInfo.month}
                      </span>
                      <span className="text-lg font-bold text-blue-700">
                        {dateInfo.day}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {interview.candidate?.name || "Aday"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {interview.jobPosting?.title || "Pozisyon"}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {dateInfo.time}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Link
          href="/interviews"
          className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Tüm Mülakatlar →
        </Link>
      </div>
    </div>
  );
}
