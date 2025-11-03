'use client';

import { Award } from 'lucide-react';

export interface ScoreBadgeProps {
  score: number;
  label?: string;
  showSubScores?: boolean;
  experienceScore?: number;
  educationScore?: number;
  technicalScore?: number;
  extraScore?: number;
}

/**
 * Circular score badge with color coding based on compatibility score
 * Green (>70), Yellow (40-69), Red (<40)
 */
export default function ScoreBadge({
  score,
  label,
  showSubScores = false,
  experienceScore,
  educationScore,
  technicalScore,
  extraScore
}: ScoreBadgeProps) {
  const getScoreColor = (value: number): string => {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (value: number): string => {
    if (value >= 80) return 'Güçlü Eşleşme';
    if (value >= 60) return 'İyi Eşleşme';
    return 'Uyum Düşük';
  };

  return (
    <div className="text-center">
      {/* Main Score Circle */}
      <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
        {score}
      </div>
      <div className="text-xs text-gray-600 mt-1">/ 100</div>

      {/* Match Label */}
      <div className="text-sm font-medium text-gray-700 flex items-center justify-center gap-1 mt-2">
        <Award className="w-4 h-4" />
        {label || getScoreLabel(score)}
      </div>

      {/* Sub-scores */}
      {showSubScores && (experienceScore !== undefined || educationScore !== undefined) && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
          {experienceScore !== undefined && (
            <div className="flex justify-between gap-2">
              <span>Deneyim:</span>
              <span className="font-medium">{experienceScore}/40</span>
            </div>
          )}
          {educationScore !== undefined && (
            <div className="flex justify-between gap-2">
              <span>Eğitim:</span>
              <span className="font-medium">{educationScore}/30</span>
            </div>
          )}
          {technicalScore !== undefined && (
            <div className="flex justify-between gap-2">
              <span>Teknik:</span>
              <span className="font-medium">{technicalScore}/20</span>
            </div>
          )}
          {extraScore !== undefined && (
            <div className="flex justify-between gap-2">
              <span>Ek:</span>
              <span className="font-medium">{extraScore}/10</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
