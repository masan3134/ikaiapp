'use client';

import { TrendingUp, TrendingDown, BarChart3, Users } from 'lucide-react';
import type { AnalysisResult } from '@/lib/services/analysisService';

export interface AnalysisStatsProps {
  results: AnalysisResult[];
}

/**
 * Summary statistics for analysis results
 * Shows highest score, average score, and candidate count
 */
export default function AnalysisStats({ results }: AnalysisStatsProps) {
  if (!results || results.length === 0) {
    return null;
  }

  // Calculate statistics
  const scores = results.map(r => r.compatibilityScore);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const candidateCount = results.length;

  // Find candidates with highest/lowest scores
  const topCandidate = results.find(r => r.compatibilityScore === highestScore);
  const bottomCandidate = results.find(r => r.compatibilityScore === lowestScore);

  const stats = [
    {
      label: 'En Yüksek Puan',
      value: highestScore,
      subtext: topCandidate ? `${topCandidate.candidate.firstName} ${topCandidate.candidate.lastName}` : '',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Ortalama Puan',
      value: averageScore,
      subtext: `${candidateCount} adayın ortalaması`,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'En Düşük Puan',
      value: lowestScore,
      subtext: bottomCandidate ? `${bottomCandidate.candidate.firstName} ${bottomCandidate.candidate.lastName}` : '',
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{stat.label}</span>
            <div className={stat.color}>{stat.icon}</div>
          </div>
          <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          {stat.subtext && (
            <p className="text-xs text-gray-600 mt-1 truncate" title={stat.subtext}>
              {stat.subtext}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
