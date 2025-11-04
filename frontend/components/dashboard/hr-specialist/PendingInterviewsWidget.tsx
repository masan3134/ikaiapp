'use client';

import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PendingInterviewsWidgetProps {
  data: Array<{
    id: string;
    scheduledAt: string;
    type: string;
    candidate: {
      name: string;
    };
    jobPosting: {
      title: string;
    } | null;
  }> | null;
}

export function PendingInterviewsWidget({ data }: PendingInterviewsWidgetProps) {
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMM HH:mm', { locale: tr });
    } catch {
      return dateString;
    }
  };

  const getInterviewTypeLabel = (type: string) => {
    switch (type) {
      case 'IN_PERSON':
        return 'Yüz Yüze';
      case 'VIDEO':
        return 'Video';
      case 'PHONE':
        return 'Telefon';
      default:
        return type;
    }
  };

  const getInterviewTypeColor = (type: string) => {
    switch (type) {
      case 'IN_PERSON':
        return 'bg-blue-100 text-blue-700';
      case 'VIDEO':
        return 'bg-purple-100 text-purple-700';
      case 'PHONE':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-orange-600" />
          Bekleyen Mülakatlar
        </h3>

        {!data || data.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Bekleyen mülakat yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.slice(0, 5).map((interview) => (
              <div
                key={interview.id}
                className="p-3 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {interview.candidate.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {interview.jobPosting?.title || 'İlan bilgisi yok'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getInterviewTypeColor(interview.type)}`}>
                    {getInterviewTypeLabel(interview.type)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(interview.scheduledAt)}
                  </span>
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Yeniden Planla
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/interviews"
          className="block text-center mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Tüm Mülakatlar →
        </Link>
      </div>
    </div>
  );
}
