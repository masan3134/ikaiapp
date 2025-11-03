'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils/dateFormat';
import type { Analysis } from '../../types';

interface AnalysisDetailModalProps {
  analysis: Analysis;
  candidateId: string;
  onClose: () => void;
}

export default function AnalysisDetailModal({
  analysis,
  candidateId,
  onClose,
}: AnalysisDetailModalProps) {
  const result = analysis.analysisResults?.find((r) => r.candidateId === candidateId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analiz Detayı</h2>
            <p className="text-sm text-gray-700 font-medium mt-1">
              {analysis.jobPosting.title} - {analysis.jobPosting.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {result ? (
            <>
              {/* Score Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Uygunluk Puanı</h3>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600">
                      {result.compatibilityScore}
                    </div>
                    <div className="text-sm font-bold text-gray-700">/ 100</div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span
                        className={`inline-block px-4 py-2 rounded-lg text-base font-bold ${
                          result.matchLabel === 'Güçlü Eşleşme'
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : result.matchLabel === 'İyi Eşleşme'
                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                            : 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                        }`}
                      >
                        {result.matchLabel || 'Değerlendiriliyor'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub Scores */}
              <div className="grid md:grid-cols-3 gap-4">
                {result.experienceScore !== null && result.experienceScore !== undefined && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {result.experienceScore}/100
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-1">💼 Deneyim</div>
                  </div>
                )}
                {result.educationScore !== null && result.educationScore !== undefined && (
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {result.educationScore}/100
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-1">🎓 Eğitim</div>
                  </div>
                )}
                {result.technicalScore !== null && result.technicalScore !== undefined && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {result.technicalScore}/100
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-1">🔧 Teknik</div>
                  </div>
                )}
                {result.softSkillsScore !== null && result.softSkillsScore !== undefined && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-700">
                      {result.softSkillsScore}/100
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-1">👥 Soft Skills</div>
                  </div>
                )}
                {result.extraScore !== null && result.extraScore !== undefined && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-700">
                      {result.extraScore}/100
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-1">⭐ Ekstra</div>
                  </div>
                )}
              </div>

              {/* Strategic Summary */}
              {result.strategicSummary && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    🎯 Stratejik Değerlendirme
                  </h3>
                  <div className="space-y-4">
                    {/* Recommendation Badge */}
                    <div
                      className={`inline-block px-6 py-3 rounded-lg font-bold text-white ${
                        result.compatibilityScore >= 85
                          ? 'bg-green-600'
                          : result.compatibilityScore >= 70
                          ? 'bg-blue-600'
                          : 'bg-orange-600'
                      }`}
                    >
                      {result.strategicSummary.finalRecommendation}
                    </div>

                    {/* Executive Summary */}
                    {result.strategicSummary.executiveSummary && (
                      <div className="bg-white rounded-lg p-4 border border-indigo-200">
                        <h4 className="font-bold text-gray-900 mb-2 text-sm">📋 Yönetici Özeti</h4>
                        <p className="text-sm text-gray-800 leading-relaxed italic">
                          {result.strategicSummary.executiveSummary}
                        </p>
                      </div>
                    )}

                    {/* Key Strengths */}
                    {result.strategicSummary.keyStrengths &&
                      result.strategicSummary.keyStrengths.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-300">
                          <h4 className="font-bold text-green-900 mb-2 text-sm">✅ Güçlü Yönler</h4>
                          <ul className="space-y-2">
                            {result.strategicSummary.keyStrengths
                              .slice(0, 3)
                              .map((strength: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="text-sm text-gray-800 flex items-start gap-2"
                                >
                                  <span className="text-green-600 font-bold flex-shrink-0">
                                    {idx + 1}.
                                  </span>
                                  <span>
                                    {strength.substring(0, 200)}
                                    {strength.length > 200 ? '...' : ''}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                    {/* Key Risks */}
                    {result.strategicSummary.keyRisks &&
                      result.strategicSummary.keyRisks.length > 0 && (
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-300">
                          <h4 className="font-bold text-orange-900 mb-2 text-sm">⚠️ Riskler</h4>
                          <ul className="space-y-2">
                            {result.strategicSummary.keyRisks
                              .slice(0, 2)
                              .map((risk: string, idx: number) => (
                                <li key={idx} className="text-sm text-gray-800">
                                  • {risk.substring(0, 150)}
                                  {risk.length > 150 ? '...' : ''}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Positive Comments */}
              {result.positiveComments && result.positiveComments.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Olumlu Yönler
                  </h3>
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-5">
                    <ul className="space-y-2">
                      {result.positiveComments.map((comment: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-base text-gray-900 font-medium">{comment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Negative Comments */}
              {result.negativeComments && result.negativeComments.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-orange-600" />
                    Gelişim Alanları
                  </h3>
                  <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-5">
                    <ul className="space-y-2">
                      {result.negativeComments.map((comment: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-base text-gray-900 font-medium">{comment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Analysis Info */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-5">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-bold text-gray-900">Analiz Tarihi:</span>
                    <span className="ml-2 text-gray-800 font-medium">
                      {formatDate(analysis.createdAt)}
                    </span>
                  </div>
                  {analysis.completedAt && (
                    <div>
                      <span className="font-bold text-gray-900">Tamamlanma:</span>
                      <span className="ml-2 text-gray-800 font-medium">
                        {formatDate(analysis.completedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-base font-semibold text-gray-900">
                Bu analiz için sonuç bulunamadı.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
