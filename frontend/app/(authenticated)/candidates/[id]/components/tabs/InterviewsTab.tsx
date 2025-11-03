'use client';

import { useState, useEffect } from 'react';
import { Video, Loader2, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Star, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateFormat';
import interviewService from '@/lib/services/interviewService';
import type { Interview } from '../../types';

interface InterviewsTabProps {
  candidateId: string;
}

export default function InterviewsTab({ candidateId }: InterviewsTabProps) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInterviews();
  }, [candidateId]);

  async function loadInterviews() {
    try {
      setLoading(true);
      const data = await interviewService.getInterviews({ candidateId });
      if (data && Array.isArray(data)) {
        setInterviews(data);
      }
    } catch (error) {
      console.error('Interviews load error:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: Interview['status']) {
    const badges: Record<string, { icon: any; colors: string; text: string }> = {
      scheduled: { icon: Calendar, colors: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Planlandı' },
      completed: { icon: CheckCircle, colors: 'bg-green-100 text-green-700 border-green-200', text: 'Tamamlandı' },
      cancelled: { icon: XCircle, colors: 'bg-red-100 text-red-700 border-red-200', text: 'İptal Edildi' },
      no_show: { icon: AlertCircle, colors: 'bg-orange-100 text-orange-700 border-orange-200', text: 'Gelmedi' },
    };
    const statusLower = status?.toLowerCase() || 'scheduled';
    const badge = badges[statusLower] || badges.scheduled;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${badge.colors} border rounded-full text-xs font-semibold`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.text}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {interviews.length > 0 ? (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    {interview.jobPosting?.title || 'Pozisyon Belirtilmemiş'}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {interview.jobPosting?.department || '-'}
                  </p>
                </div>
                {getStatusBadge(interview.status)}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Tarih & Saat</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatDate(interview.date)} · {interview.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Süre</p>
                    <p className="text-sm font-bold text-gray-900">{interview.duration} dakika</p>
                  </div>
                </div>
              </div>

              {/* Meet Link */}
              {interview.meetLink && (
                <a
                  href={interview.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md mb-4"
                >
                  <Video className="w-4 h-4" />
                  Google Meet'e Katıl
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Rating */}
              {interview.rating && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">Değerlendirme</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < interview.rating!
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {interview.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {interview.notes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    Notlar
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">{interview.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Henüz Mülakat Planlanmamış
          </h3>
          <p className="text-sm text-gray-600">
            Mülakatlar sayfasından yeni mülakat oluşturabilirsiniz
          </p>
        </div>
      )}
    </div>
  );
}
