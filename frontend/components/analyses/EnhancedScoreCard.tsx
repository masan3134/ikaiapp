'use client';

import { Award, Briefcase, GraduationCap, Wrench, Users, Star } from 'lucide-react';

interface EnhancedScoreProps {
  scores: {
    experienceScore?: number;
    educationScore?: number;
    technicalScore?: number;
    softSkillsScore?: number;
    extraScore?: number;
    finalCompatibilityScore: number;
  };
  matchLabel?: string;
}

/**
 * V7.1: Display all component scores (0-100 each) and weighted final score
 */
export default function EnhancedScoreCard({ scores, matchLabel }: EnhancedScoreProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 85) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-blue-50 border-blue-200';
    if (score >= 55) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const scoreItems = [
    {
      icon: Briefcase,
      label: 'Deneyim',
      score: scores.experienceScore,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: GraduationCap,
      label: 'Eğitim',
      score: scores.educationScore,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Wrench,
      label: 'Teknik',
      score: scores.technicalScore,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Users,
      label: 'Soft Skills',
      score: scores.softSkillsScore,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Star,
      label: 'Diğer',
      score: scores.extraScore,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Final Score - Large Display */}
      <div className={`rounded-xl p-6 border-2 ${getScoreBgColor(scores.finalCompatibilityScore)}`}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className={`w-6 h-6 ${getScoreColor(scores.finalCompatibilityScore)}`} />
            <span className="text-sm font-medium text-gray-600">Nihai Uygunluk Skoru</span>
          </div>
          <div className={`text-5xl font-bold mb-2 ${getScoreColor(scores.finalCompatibilityScore)}`}>
            {scores.finalCompatibilityScore}
            <span className="text-2xl">/100</span>
          </div>
          {matchLabel && (
            <div className="inline-block px-4 py-2 bg-white/80 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
              {matchLabel}
            </div>
          )}
        </div>
      </div>

      {/* Component Scores Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {scoreItems.map((item) => {
          const Icon = item.icon;
          return item.score !== undefined && item.score !== null ? (
            <div
              key={item.label}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center mb-2`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className={`text-2xl font-bold mb-1 ${getScoreColor(item.score)}`}>
                  {item.score}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {item.label}
                </div>
              </div>
            </div>
          ) : null;
        })}
      </div>

      {/* Score Explanation */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          <span className="font-semibold">Not:</span> V7.1 sisteminde tüm skorlar 0-100 aralığındadır ve pozisyona göre ağırlıklandırılır.
        </p>
      </div>
    </div>
  );
}
