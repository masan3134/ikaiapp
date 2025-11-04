"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  FileText,
  Download,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/services/analysisService";
import CandidateAvatar from "@/components/candidates/CandidateAvatar";
import ScoreBadge from "./ScoreBadge";
import { getFullName, fixFileNameEncoding } from "@/lib/utils/stringUtils";
import EnhancedScoreCard from "./EnhancedScoreCard";
import ScoringProfileCard from "./ScoringProfileCard";
import CareerTrajectoryCard from "./CareerTrajectoryCard";
import StrategicSummaryCard from "./StrategicSummaryCard";

export interface AnalysisResultCardProps {
  result: AnalysisResult;
  rank: number;
  onDownload: (result: AnalysisResult) => void;
  defaultExpanded?: boolean;
}

/**
 * Expandable card showing single candidate's analysis result
 * Includes rank, score, contact info, and detailed comments
 */
export default function AnalysisResultCard({
  result,
  rank,
  onDownload,
  defaultExpanded = false,
}: AnalysisResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getScoreBgColor = (score: number): string => {
    if (score >= 70) return "bg-green-50 border-green-200";
    if (score >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getRankBadgeColor = (score: number): string => {
    if (score >= 70) return "bg-green-100 text-green-600";
    if (score >= 40) return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  const fullName = getFullName(
    result.candidate.firstName,
    result.candidate.lastName
  );

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${getScoreBgColor(result.compatibilityScore)}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Rank Badge */}
          <div
            className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${getRankBadgeColor(result.compatibilityScore)}`}
          >
            #{rank}
          </div>

          {/* Candidate Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <CandidateAvatar
                firstName={result.candidate.firstName}
                lastName={result.candidate.lastName}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {fullName}
                  </h3>
                  {result.candidate.isDeleted && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded flex-shrink-0">
                      Arşivlenmiş
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
                  {result.candidate.email && (
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{result.candidate.email}</span>
                    </span>
                  )}
                  {result.candidate.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      {result.candidate.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CV File */}
            <div className="flex items-center gap-2 mt-2">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span
                className="text-sm text-gray-600 truncate"
                title={fixFileNameEncoding(result.candidate.sourceFileName)}
              >
                {fixFileNameEncoding(result.candidate.sourceFileName)}
              </span>
              <button
                onClick={() => onDownload(result)}
                className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 flex-shrink-0"
              >
                <Download className="w-3 h-3" />
                İndir
              </button>
            </div>
          </div>
        </div>

        {/* Score Badge */}
        <div className="ml-4 flex-shrink-0">
          <ScoreBadge
            score={result.compatibilityScore}
            label={result.matchLabel}
            showSubScores={true}
            experienceScore={result.experienceScore}
            educationScore={result.educationScore}
            technicalScore={result.technicalScore}
            extraScore={result.extraScore}
          />
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2 border-t border-gray-200 transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            <span>Detayları Gizle</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            <span>Detayları Göster</span>
          </>
        )}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-6">
          {/* V7.1: Enhanced Score Display */}
          <EnhancedScoreCard
            scores={{
              experienceScore: result.experienceScore,
              educationScore: result.educationScore,
              technicalScore: result.technicalScore,
              softSkillsScore: result.softSkillsScore,
              extraScore: result.extraScore,
              finalCompatibilityScore: result.compatibilityScore,
            }}
            matchLabel={result.matchLabel}
          />

          {/* V7.1: Strategic Summary (Crown Jewel!) */}
          {result.strategicSummary && (
            <StrategicSummaryCard summary={result.strategicSummary} />
          )}

          {/* V7.1: Scoring Profile */}
          {result.scoringProfile && (
            <ScoringProfileCard profile={result.scoringProfile} />
          )}

          {/* V7.1: Career Trajectory */}
          {result.careerTrajectory && (
            <CareerTrajectoryCard trajectory={result.careerTrajectory} />
          )}

          {/* V7.1: Detailed Summaries */}
          {(result.experienceSummary || result.educationSummary) && (
            <div className="grid md:grid-cols-2 gap-4">
              {result.experienceSummary && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                    Detaylı Deneyim Analizi
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {result.experienceSummary}
                  </p>
                </div>
              )}

              {result.educationSummary && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2 text-sm">
                    Detaylı Eğitim Analizi
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {result.educationSummary}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Legacy: Fallback to candidate fields if V7.1 summaries not available */}
          {!result.experienceSummary &&
            !result.educationSummary &&
            (result.candidate.experience || result.candidate.education) && (
              <div className="grid md:grid-cols-2 gap-4">
                {result.candidate.experience && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Deneyim
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {result.candidate.experience}
                    </p>
                  </div>
                )}

                {result.candidate.education && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Eğitim
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {result.candidate.education}
                    </p>
                  </div>
                )}
              </div>
            )}

          {/* AI Comments */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Positive Comments */}
            {result.positiveComments && result.positiveComments.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900 text-sm">
                    Güçlü Yönler
                  </h4>
                </div>
                <ul className="space-y-2">
                  {result.positiveComments.map((comment, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-green-800 flex items-start gap-2"
                    >
                      <span className="text-green-600 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      <span>{comment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Negative Comments */}
            {result.negativeComments && result.negativeComments.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-900 text-sm">
                    Gelişim Alanları
                  </h4>
                </div>
                <ul className="space-y-2">
                  {result.negativeComments.map((comment, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-red-800 flex items-start gap-2"
                    >
                      <span className="text-red-600 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      <span>{comment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* General Comment */}
          {result.candidate.generalComment && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                Genel Değerlendirme
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {result.candidate.generalComment}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
