'use client';

import { MoreVertical, Trash2, Edit, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import InterviewCard from './InterviewCard';

interface Interview {
  id: string;
  type: string;
  date: string;
  time: string;
  status: string;
  location?: string;
  meetLink?: string;
  candidates: Array<{
    candidate: {
      firstName: string;
      lastName: string;
      email: string;
      desiredPosition?: string;
    }
  }>;
  interviewer: {
    email: string;
  };
}

interface ListProps {
  interviews: Interview[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export default function InterviewList({ interviews, loading, onDelete, onStatusChange }: ListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Mülakatlar yükleniyor...</p>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz mülakat yok</h3>
        <p className="text-gray-600">Yeni mülakat oluşturarak başlayın</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {interviews.map((interview) => {
        const candidateName = interview.candidates[0] 
          ? `${interview.candidates[0].candidate.firstName} ${interview.candidates[0].candidate.lastName}`
          : 'Aday Yok';
        const position = interview.candidates[0]?.candidate.desiredPosition || 'Pozisyon belirtilmemiş';
        
        return (
          <div key={interview.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
            <div className="p-6 flex items-start justify-between">
              <InterviewCard
                interview={{
                  id: interview.id,
                  candidateName,
                  position,
                  date: interview.date,
                  time: interview.time,
                  type: interview.type,
                  status: interview.status,
                  interviewer: interview.interviewer.email,
                  location: interview.location || interview.meetLink || 'Belirtilmemiş'
                }}
              />
              
              <div className="relative ml-4">
                <button
                  onClick={() => setActiveMenu(activeMenu === interview.id ? null : interview.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} className="text-gray-400" />
                </button>

                {activeMenu === interview.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        onStatusChange?.(interview.id, interview.status === 'scheduled' ? 'completed' : 'scheduled');
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <CheckCircle size={16} />
                      {interview.status === 'scheduled' ? 'Tamamlandı İşaretle' : 'Planlanmış'}
                    </button>
                    <button
                      onClick={() => {
                        onStatusChange?.(interview.id, 'cancelled');
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-orange-600"
                    >
                      <Edit size={16} />
                      İptal Et
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(interview.id);
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600"
                    >
                      <Trash2 size={16} />
                      Sil
                    </button>
                  </div>
                )}
              </div>
            </div>

            {interview.candidates.length > 1 && (
              <div className="px-6 pb-4 text-sm text-gray-600">
                +{interview.candidates.length - 1} diğer aday
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
