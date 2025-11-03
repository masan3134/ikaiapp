'use client';

import { useState } from 'react';
import { X, Send, Loader2, CheckCircle, Mail, User } from 'lucide-react';
import { generateTest, sendTestEmail } from '@/lib/services/testService';
import { useToast } from '@/lib/hooks/useToast';
import type { AnalysisResult } from '@/lib/services/analysisService';

interface BulkTestSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPostingId: string;
  jobTitle: string;
  candidates: AnalysisResult[];
  analysisId: string; // NEW: For analysis-based MASTER test
}

export default function BulkTestSendModal({
  isOpen,
  onClose,
  jobPostingId,
  jobTitle,
  candidates,
  analysisId // NEW
}: BulkTestSendModalProps) {
  const toast = useToast();
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [testReused, setTestReused] = useState(false);

  if (!isOpen) return null;

  function handleToggleCandidate(candidateId: string) {
    const newSet = new Set(selectedCandidates);
    if (newSet.has(candidateId)) {
      newSet.delete(candidateId);
    } else {
      newSet.add(candidateId);
    }
    setSelectedCandidates(newSet);
  }

  function handleSelectAll() {
    if (selectedCandidates.size === candidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(candidates.map(c => c.candidateId)));
    }
  }

  function handleSelectByScore(minScore: number) {
    const filtered = candidates
      .filter(c => c.compatibilityScore >= minScore)
      .map(c => c.candidateId);
    setSelectedCandidates(new Set(filtered));
  }

  async function handleSendTests() {
    if (selectedCandidates.size === 0) {
      toast.error('Lütfen en az bir aday seçin');
      return;
    }

    try {
      setSending(true);
      setSentCount(0);

      const selectedList = candidates.filter(c => selectedCandidates.has(c.candidateId));

      // Generate test ONCE (will be reused for all candidates)
      // NEW: Pass analysisId for analysis-based MASTER test
      const generateResult = await generateTest({ jobPostingId, analysisId });

      if (!generateResult.success || !generateResult.data) {
        throw new Error('Test oluşturulamadı');
      }

      const { testId, reused } = generateResult.data;
      setTestReused(reused);

      if (process.env.NODE_ENV === 'development') {
        console.log(reused ? '♻️ Mevcut test kullanılıyor' : '🆕 Yeni test oluşturuldu');
      }

      // Send email to each selected candidate
      let successCount = 0;
      for (const result of selectedList) {
        try {
          // Send email with the SAME testId
          const emailResult = await sendTestEmail(testId, {
            recipientEmail: result.candidate.email,
            recipientName: `${result.candidate.firstName} ${result.candidate.lastName}`
          });

          if (emailResult.success) {
            successCount++;
            setSentCount(successCount);
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`Failed to send test to ${result.candidate.email}:`, error);
          }
          // Continue with next candidate even if one fails
        }
      }

      const message = reused
        ? `Mevcut test kullanıldı - ${successCount} adaya email gönderildi!`
        : `Yeni test oluşturuldu - ${successCount} adaya email gönderildi!`;

      toast.success(message);

      // Reset sending state and close modal
      setSending(false);
      setTimeout(() => {
        onClose();
        setSelectedCandidates(new Set());
        setSentCount(0);
        setTestReused(false);
      }, 500);

    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Bulk send error:', error);
      }
      toast.error(error.message || 'Test gönderiminde hata oluştu');
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Test Gönder</h2>
            <p className="text-purple-100 text-sm mt-1">
              {jobTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={sending}
            className="text-white hover:bg-purple-700 rounded-lg p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Quick Actions */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleSelectAll}
              className="px-3 py-2 text-sm font-bold text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              {selectedCandidates.size === candidates.length ? 'Hiçbirini Seçme' : 'Tümünü Seç'}
            </button>
            <button
              onClick={() => handleSelectByScore(70)}
              className="px-3 py-2 text-sm font-bold text-gray-900 bg-green-100 rounded-lg hover:bg-green-200 transition"
            >
              Sadece 70+ Skor
            </button>
            <button
              onClick={() => handleSelectByScore(60)}
              className="px-3 py-2 text-sm font-bold text-gray-900 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
            >
              Sadece 60+ Skor
            </button>
          </div>

          {/* Candidate List */}
          <div className="space-y-3">
            {candidates.map((result) => {
              const isSelected = selectedCandidates.has(result.candidateId);

              return (
                <div
                  key={result.candidateId}
                  onClick={() => handleToggleCandidate(result.candidateId)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-600" />
                        <h3 className="text-base font-bold text-gray-900">
                          {result.candidate.firstName} {result.candidate.lastName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <p className="text-sm text-gray-700 font-medium">
                          {result.candidate.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-gray-900">
                          Skor: {result.compatibilityScore}/100
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          result.matchLabel === 'Güçlü Eşleşme'
                            ? 'bg-green-100 text-green-800'
                            : result.matchLabel === 'İyi Eşleşme'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {result.matchLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <p className="text-sm text-gray-900 font-medium mb-2">
              <strong className="text-blue-700">Test Sistemi:</strong>
            </p>
            <ul className="space-y-1 text-sm text-gray-800">
              <li>• Bu iş ilanı için <strong>TEK BİR TEST</strong> oluşturulur ve tüm adaylara gönderilir</li>
              <li>• Test sorularını yapay zeka ilanı detaylı analiz ederek oluşturur</li>
              <li>• 10 soru (Teknik, Senaryosal, Deneyim) - 30 dakika - 3 deneme hakkı</li>
              <li>• Geçerlilik: 2 gün - Sonra yeni test oluşturulur</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t-2 border-gray-200 p-6 flex items-center justify-between">
          <div className="text-sm font-bold text-gray-900">
            {selectedCandidates.size} aday seçildi
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={sending}
              className="px-6 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              İptal
            </button>
            <button
              onClick={handleSendTests}
              disabled={sending || selectedCandidates.size === 0}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gönderiliyor... ({sentCount}/{selectedCandidates.size})
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Test Gönder ({selectedCandidates.size})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
