'use client';

import { useState, useEffect } from 'react';
import { FileText, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getAnalysesByCandidate } from '@/lib/services/analysisService';
import { formatDate } from '@/lib/utils/dateFormat';
import AnalysisDetailModal from '../modals/AnalysisDetailModal';
import type { Analysis } from '../../types';

interface AnalysesTabProps {
  candidateId: string;
}

export default function AnalysesTab({ candidateId }: AnalysesTabProps) {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadAnalyses();
  }, [candidateId]);

  async function loadAnalyses() {
    try {
      setLoading(true);
      const result = await getAnalysesByCandidate(candidateId);
      if (result.analyses) {
        setAnalyses(result.analyses);
      }
    } catch (error) {
      console.error('Analyses load error:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleAnalysisClick(analysis: Analysis) {
    setSelectedAnalysis(analysis);
    setShowModal(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-gray-200">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-base font-semibold text-gray-900">
          Bu aday için henüz analiz yapılmamış.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          Wizard sayfasından yeni analiz oluşturabilirsiniz
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Analiz Geçmişi</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                  İş İlanı
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                  Tarih
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                  Durum
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                  Skor
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                  Etiket
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyses.map((analysis) => {
                const result = analysis.analysisResults?.find(
                  (r) => r.candidateId === candidateId
                );

                return (
                  <tr
                    key={analysis.id}
                    onClick={() => handleAnalysisClick(analysis)}
                    className="hover:bg-blue-50 cursor-pointer transition"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {analysis.jobPosting.title}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatDate(analysis.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {analysis.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Tamamlandı
                        </span>
                      ) : analysis.status === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                          <XCircle className="w-3 h-3" />
                          Başarısız
                        </span>
                      ) : analysis.status === 'PROCESSING' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          <Clock className="w-3 h-3" />
                          İşleniyor
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                          <Clock className="w-3 h-3" />
                          Beklemede
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {result?.compatibilityScore !== undefined ? (
                        <span className="font-semibold text-gray-900">
                          {result.compatibilityScore}/100
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {result?.matchLabel ? (
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs ${
                            result.matchLabel === 'Güçlü Eşleşme'
                              ? 'bg-green-100 text-green-700'
                              : result.matchLabel === 'İyi Eşleşme'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {result.matchLabel}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedAnalysis && (
        <AnalysisDetailModal
          analysis={selectedAnalysis}
          candidateId={candidateId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
