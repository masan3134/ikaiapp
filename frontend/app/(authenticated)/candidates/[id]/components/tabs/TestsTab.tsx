'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getTestSubmissionsByEmail } from '@/lib/services/testService';
import { formatDate } from '@/lib/utils/dateFormat';
import TestDetailModal from '../modals/TestDetailModal';
import type { TestSubmission } from '../../types';

interface TestsTabProps {
  candidateEmail: string;
}

export default function TestsTab({ candidateEmail }: TestsTabProps) {
  const [tests, setTests] = useState<TestSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (candidateEmail) {
      loadTests();
    }
  }, [candidateEmail]);

  async function loadTests() {
    try {
      setLoading(true);
      const result = await getTestSubmissionsByEmail(candidateEmail);
      if (result.success && result.submissions) {
        setTests(result.submissions);
      }
    } catch (error) {
      console.error('Tests load error:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleTestClick(test: TestSubmission) {
    setSelectedTest(test);
    setShowModal(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-purple-600" />
            Test Gönderme Hakkında
          </h3>
          <p className="text-sm text-gray-800 font-medium">
            Test göndermek için <strong>Analizler</strong> sayfasından bir analiz seçin ve
            <strong className="text-purple-700"> "Test Gönder"</strong> butonunu kullanın.
            Toplu olarak birden fazla adaya test gönderebilirsiniz.
          </p>
        </div>

        {/* Test History */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-900">Test Geçmişi</h3>

          {tests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                      İş İlanı
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                      Gönderilme
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                      Durum
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                      Skor
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">
                      Deneme
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tests.map((test) => {
                    const isCompleted = test.score !== null;
                    const isExpired = new Date(test.test?.expiresAt || '') < new Date();

                    return (
                      <tr
                        key={test.id}
                        onClick={() => handleTestClick(test)}
                        className="hover:bg-blue-50 cursor-pointer transition"
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {test.test?.jobPosting?.title || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatDate(test.completedAt)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              <CheckCircle className="w-3 h-3" />
                              Tamamlandı
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                              <XCircle className="w-3 h-3" />
                              Süresi Doldu
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                              <Clock className="w-3 h-3" />
                              Beklemede
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {test.score !== null ? (
                            <span className="font-bold text-gray-900 text-base">
                              {test.score}/100
                            </span>
                          ) : (
                            <span className="text-gray-500 font-medium">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {test.attemptNumber || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-gray-200">
              <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-base font-semibold text-gray-900">
                Henüz test gönderilmemiş
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Yukarıdaki formu kullanarak test oluşturabilirsiniz
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedTest && (
        <TestDetailModal test={selectedTest} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
