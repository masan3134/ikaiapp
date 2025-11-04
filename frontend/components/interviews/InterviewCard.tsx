"use client";

import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  ChevronRight,
} from "lucide-react";

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: string;
  status: string;
  interviewer: string;
  location: string;
}

interface CardProps {
  interview: Interview;
  onClick?: () => void;
}

export default function InterviewCard({ interview, onClick }: CardProps) {
  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    scheduled: "Planlandı",
    completed: "Tamamlandı",
    cancelled: "İptal Edildi",
  };

  const typeIcons = {
    video: <Video size={16} className="text-blue-600" />,
    "in-person": <MapPin size={16} className="text-green-600" />,
    phone: <Clock size={16} className="text-orange-600" />,
  };

  return (
    <div
      onClick={onClick}
      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {interview.candidateName}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[interview.status as keyof typeof statusColors]}`}
            >
              {statusLabels[interview.status as keyof typeof statusLabels]}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{interview.position}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                {new Date(interview.date).toLocaleDateString("tr-TR")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{interview.time}</span>
            </div>
            <div className="flex items-center gap-2">
              {typeIcons[interview.type as keyof typeof typeIcons]}
              <span>{interview.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{interview.interviewer}</span>
            </div>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400 mt-2" />
      </div>
    </div>
  );
}
