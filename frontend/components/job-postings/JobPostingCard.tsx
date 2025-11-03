'use client';

import { Briefcase, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import type { JobPosting } from '@/lib/services/jobPostingService';
import { formatDate } from '@/lib/utils/dateFormat';
import { truncate } from '@/lib/utils/stringUtils';
import Badge from '@/components/ui/Badge';

export interface JobPostingCardProps {
  jobPosting: JobPosting;
  onView: (jobPosting: JobPosting) => void;
  onEdit: (jobPosting: JobPosting) => void;
  onDelete: (jobPosting: JobPosting) => void;
}

export default function JobPostingCard({
  jobPosting,
  onView,
  onEdit,
  onDelete
}: JobPostingCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
      onClick={() => onView(jobPosting)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {jobPosting.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{jobPosting.department}</span>
          </div>
        </div>
      </div>

      {/* Details Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 line-clamp-3">
          {truncate(jobPosting.details, 150)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Badge variant="info" size="sm">
            {jobPosting._count?.analyses || 0} analiz
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(jobPosting.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(jobPosting);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Detayları Gör"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(jobPosting);
            }}
            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Düzenle"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(jobPosting);
            }}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
