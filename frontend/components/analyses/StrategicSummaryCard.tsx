"use client";

import {
  Target,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Clock,
  Award,
} from "lucide-react";

interface StrategicSummaryProps {
  summary: {
    executiveSummary: string;
    keyStrengths: string[];
    keyRisks: string[];
    interviewQuestions: string[];
    finalRecommendation: string;
    hiringTimeline: string;
  };
}

/**
 * V7.1: Display strategic hiring recommendations
 * This is the crown jewel of the V7.1 analysis
 */
export default function StrategicSummaryCard({
  summary,
}: StrategicSummaryProps) {
  const getRecommendationStyle = (rec: string) => {
    if (rec.includes("Olağanüstü") || rec.includes("Mükemmel")) {
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    }
    if (rec.includes("Güçlü") || rec.includes("İyi")) {
      return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
    }
    if (rec.includes("Kabul Edilebilir")) {
      return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
    }
    return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
  };

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-indigo-200 overflow-hidden">
      {/* Header with Recommendation */}
      <div
        className={`p-5 ${getRecommendationStyle(summary.finalRecommendation)}`}
      >
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Stratejik Değerlendirme</h3>
            <p className="text-sm opacity-90">{summary.finalRecommendation}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Executive Summary */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-indigo-600" />
            <h4 className="font-semibold text-gray-900 text-sm">
              Yönetici Özeti
            </h4>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <p className="text-sm text-gray-800 leading-relaxed italic">
              {summary.executiveSummary}
            </p>
          </div>
        </div>

        {/* Key Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900 text-sm">
              核心 Güçlü Yönler
            </h4>
          </div>
          <div className="space-y-3">
            {summary.keyStrengths.map((strength, idx) => (
              <div
                key={idx}
                className="bg-green-50 rounded-lg p-4 border border-green-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed flex-1">
                    {strength}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Risks */}
        {summary.keyRisks && summary.keyRisks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-gray-900 text-sm">
                Riskler ve Azaltma Stratejileri
              </h4>
            </div>
            <div className="space-y-3">
              {summary.keyRisks.map((risk, idx) => (
                <div
                  key={idx}
                  className="bg-orange-50 rounded-lg p-4 border border-orange-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ⚠
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed flex-1">
                      {risk}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interview Questions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900 text-sm">
              Önerilen Görüşme Soruları
            </h4>
          </div>
          <div className="space-y-2">
            {summary.interviewQuestions.map((question, idx) => (
              <div
                key={idx}
                className="bg-blue-50 rounded-lg p-4 border border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    S{idx + 1}
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed flex-1">
                    {question}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hiring Timeline */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <h4 className="font-semibold text-sm">İşe Alım Zaman Çizelgesi</h4>
          </div>
          <p className="text-sm leading-relaxed opacity-95">
            {summary.hiringTimeline}
          </p>
        </div>
      </div>
    </div>
  );
}
