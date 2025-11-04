"use client";

import { Scale, Info } from "lucide-react";

interface ScoringProfileProps {
  profile: {
    experienceWeight: number;
    educationWeight: number;
    technicalWeight: number;
    softSkillsWeight: number;
    extraWeight: number;
    rationale: string;
  };
}

/**
 * V7.1: Display dynamic scoring weights determined for this specific role
 */
export default function ScoringProfileCard({ profile }: ScoringProfileProps) {
  const weights = [
    {
      key: "experienceWeight",
      label: "Deneyim",
      value: profile.experienceWeight,
      color: "bg-blue-500",
    },
    {
      key: "educationWeight",
      label: "Eğitim",
      value: profile.educationWeight,
      color: "bg-purple-500",
    },
    {
      key: "technicalWeight",
      label: "Teknik",
      value: profile.technicalWeight,
      color: "bg-green-500",
    },
    {
      key: "softSkillsWeight",
      label: "Soft Skills",
      value: profile.softSkillsWeight,
      color: "bg-orange-500",
    },
    {
      key: "extraWeight",
      label: "Diğer",
      value: profile.extraWeight,
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-5 border border-indigo-200">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-indigo-600" />
        <h4 className="font-semibold text-indigo-900 text-sm">
          Dinamik Değerlendirme Profili
        </h4>
        <div className="group relative ml-auto">
          <Info className="w-4 h-4 text-indigo-400 cursor-help" />
          <div className="hidden group-hover:block absolute right-0 top-6 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs z-10">
            <p className="text-gray-700">
              AI bu iş ilanı için hangi kriterlerin ne kadar önemli olduğunu
              analiz etti ve değerlendirme ağırlıklarını otomatik olarak
              belirledi.
            </p>
          </div>
        </div>
      </div>

      {/* Weights Visualization */}
      <div className="space-y-3 mb-4">
        {weights.map((w) => (
          <div key={w.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">
                {w.label}
              </span>
              <span className="text-xs font-bold text-gray-900">
                {Math.round(w.value * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${w.color} transition-all duration-500`}
                style={{ width: `${w.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Rationale */}
      <div className="bg-white/70 rounded-md p-3 border border-indigo-100">
        <p className="text-xs text-gray-700 italic leading-relaxed">
          <span className="font-semibold text-indigo-700">
            AI'nın Açıklaması:
          </span>{" "}
          {profile.rationale}
        </p>
      </div>
    </div>
  );
}
