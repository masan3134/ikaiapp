'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOfferWizardStore } from '@/lib/store/offerWizardStore';
import { getAuthToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Step3_Summary() {
  const router = useRouter();
  const {
    selectedCandidate,
    selectedJobPosting,
    selectedTemplate,
    formData,
    sendMode,
    setSendMode,
    setLoading,
    setError,
    resetWizard,
  } = useOfferWizardStore();

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!selectedCandidate) {
      setError('Aday seçimi zorunludur');
      return;
    }

    try {
      setSubmitting(true);
      setLoading(true);
      const token = getAuthToken();

      const payload = {
        candidateId: selectedCandidate.id,
        jobPostingId: selectedJobPosting?.id || null,
        templateId: selectedTemplate?.id || null,
        sendMode,
        ...formData,
      };

      const response = await fetch(`${API_URL}/api/v1/offers/wizard`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Teklif oluşturulamadı');
      }

      const result = await response.json();
      const offer = result.data;

      resetWizard();
      router.push(`/offers/${offer.id}?success=${sendMode === 'direct' ? 'sent' : 'created'}`);
    } catch (error: any) {
      setError(error.message || 'Bir hata oluştu');
      setSubmitting(false);
      setLoading(false);
    }
  }

  if (!selectedCandidate) {
    return <div>Aday seçimi gerekli</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Özet ve Gönder</h2>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">📋 Teklif Özeti</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Aday</p>
            <p className="font-medium text-gray-900">
              {selectedCandidate.firstName} {selectedCandidate.lastName} ({selectedCandidate.email})
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Pozisyon</p>
            <p className="font-medium text-gray-900">
              {formData.position} - {formData.department}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Maaş</p>
            <p className="font-medium text-gray-900">
              {formData.salary.toLocaleString()} {formData.currency}/ay
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Başlangıç Tarihi</p>
            <p className="font-medium text-gray-900">{new Date(formData.startDate).toLocaleDateString('tr-TR')}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Çalışma Şekli</p>
            <p className="font-medium text-gray-900">
              {formData.workType === 'office' ? 'Ofis' : formData.workType === 'hybrid' ? 'Hibrit' : 'Uzaktan'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Yan Haklar</p>
            <div className="text-gray-900">
              {formData.benefits.insurance && <p>✅ Özel Sağlık Sigortası</p>}
              {formData.benefits.meal > 0 && <p>✅ Yemek Kartı ({formData.benefits.meal.toLocaleString()} TRY/ay)</p>}
              {formData.benefits.transportation && <p>✅ Ulaşım Desteği</p>}
              {formData.benefits.gym && <p>✅ Spor Salonu</p>}
              {formData.benefits.education && <p>✅ Eğitim Desteği</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Send Mode */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">🚀 Gönderim Seçeneği</h3>
        <div className="space-y-3">
          <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400">
            <input
              type="radio"
              name="sendMode"
              value="draft"
              checked={sendMode === 'draft'}
              onChange={(e) => setSendMode('draft')}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">Taslak Olarak Kaydet (Onaya Gönder)</p>
              <p className="text-sm text-gray-600">Manager onayından sonra gönderilir</p>
            </div>
          </label>

          <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400">
            <input
              type="radio"
              name="sendMode"
              value="direct"
              checked={sendMode === 'direct'}
              onChange={(e) => setSendMode('direct')}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">Direkt Gönder (Sadece ADMIN)</p>
              <p className="text-sm text-gray-600">Hemen adaya email ile gönderilir</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Gönderiliyor...' : sendMode === 'draft' ? '💾 Taslak Kaydet' : '🚀 Gönder'}
        </button>
      </div>
    </div>
  );
}
