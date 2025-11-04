"use client";

import { memo } from "react";
import { Briefcase, Calendar, Users, Eye, Trash2 } from "lucide-react";
import type { Analysis } from "@/lib/services/analysisService";
import AnalysisStatusBadge from "./AnalysisStatusBadge";
import { formatDateTime } from "@/lib/utils/dateFormat";

export interface AnalysisCardProps {
  analysis: Analysis;
  onView: (analysis: Analysis) => void;
  onDelete: (analysis: Analysis) => void;
}

const AnalysisCard = memo(function AnalysisCard({
  analysis,
  onView,
  onDelete,
}: AnalysisCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onView(analysis)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {analysis.jobPosting.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>{analysis.jobPosting.department}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{analysis._count?.analysisResults || 0} aday</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDateTime(analysis.createdAt)}</span>
            </div>
          </div>
        </div>
        <div>
          <AnalysisStatusBadge
            status={analysis.status}
            hasError={!!analysis.errorMessage}
            hasResults={(analysis._count?.analysisResults || 0) > 0}
          />
        </div>
      </div>

      {/* Completion Time - Only if fully successful */}
      {analysis.status === "COMPLETED" &&
        analysis.completedAt &&
        !analysis.errorMessage && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              ✓ Tamamlandı: {formatDateTime(analysis.completedAt)}
            </p>
          </div>
        )}

      {/* Partial Success Warning */}
      {analysis.status === "COMPLETED" &&
        analysis.errorMessage &&
        (analysis._count?.analysisResults || 0) > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-900">
              ⚠ Kısmi Başarılı
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              {analysis._count?.analysisResults || 0} aday başarılı, bazı
              adaylar başarısız oldu.
            </p>
          </div>
        )}

      {/* Full Error Message */}
      {analysis.status === "FAILED" && analysis.errorMessage && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm font-medium text-red-900">Hata:</p>
          <p className="text-sm text-red-700 mt-1">{analysis.errorMessage}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        {analysis.status === "COMPLETED" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(analysis);
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Eye className="w-4 h-4" />
            Sonuçları Gör
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(analysis);
          }}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Sil</span>
        </button>
      </div>
    </div>
  );
});

export default AnalysisCard;
