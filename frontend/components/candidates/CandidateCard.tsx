"use client";

import { memo } from "react";
import { Eye, Download, Trash2, Calendar, Mail, Phone } from "lucide-react";
import type { Candidate } from "@/lib/services/candidateService";
import CandidateAvatar from "./CandidateAvatar";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/dateFormat";
import { getFullName, fixFileNameEncoding } from "@/lib/utils/stringUtils";

export interface CandidateCardProps {
  candidate: Candidate;
  onView: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
  onDownload: (candidate: Candidate) => void;
}

/**
 * Mobile-friendly card view for candidates
 * Memoized for performance
 */
const CandidateCard = memo(function CandidateCard({
  candidate,
  onView,
  onDelete,
  onDownload,
}: CandidateCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onView(candidate)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <CandidateAvatar
          firstName={candidate.firstName}
          lastName={candidate.lastName}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {getFullName(candidate.firstName, candidate.lastName)}
          </h3>
          <Badge variant="info" size="sm">
            {candidate._count?.analysisResults || 0} analiz
          </Badge>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        {candidate.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{candidate.email}</span>
          </div>
        )}
        {candidate.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{candidate.phone}</span>
          </div>
        )}
      </div>

      {/* File & Date */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pt-3 border-t border-gray-100">
        <span
          className="truncate"
          title={fixFileNameEncoding(candidate.sourceFileName)}
        >
          {fixFileNameEncoding(candidate.sourceFileName)}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(candidate.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(candidate);
          }}
          className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          <span>Detay</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(candidate);
          }}
          className="flex-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
        >
          <Download className="w-4 h-4" />
          <span>İndir</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(candidate);
          }}
          className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export default CandidateCard;
