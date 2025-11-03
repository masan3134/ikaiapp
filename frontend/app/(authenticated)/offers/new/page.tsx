'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as offerService from '@/services/offerService';
import * as templateService from '@/services/templateService';
import { fetchCandidates } from '@/services/candidates';
import { fetchJobPostings } from '@/services/jobPostings';

export default function NewOfferPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const [formData, setFormData] = useState({
    candidateId: '',
    jobPostingId: '',
    position: '',
    department: '',
    salary: 0,
    currency: 'TRY',
    startDate: '',
    workType: 'office',
    benefits: {
      insurance: false,
      meal: 0,
      transportation: false,
      gym: false,
      education: false
    },
    terms: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoadingData(true);
      const [candidatesData, jobPostingsData, templatesData] = await Promise.all([
        fetchCandidates({ page: 1, limit: 100 }),
        fetchJobPostings({ page: 1, limit: 100 }),
        templateService.fetchTemplates({ isActive: true })
      ]);
      setCandidates(candidatesData.data || []);
      setJobPostings(jobPostingsData.data || []);
      setTemplates(templatesData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  }

  function handleTemplateSelect(templateId: string) {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Feature #8: Auto-fill from template
      setFormData({
        ...formData,
        position: template.position,
        department: template.department,
        salary: template.salaryMin,
        currency: template.currency,
        workType: template.workType,
        benefits: { ...template.benefits },
        terms: template.terms
      });
    } else {
      setSelectedTemplate(null);
    }
  }

  function handleCandidateChange(candidateId: string) {
    setFormData({ ...formData, candidateId });
  }

  function handleJobPostingChange(jobPostingId: string) {
    const jobPosting = jobPostings.find(jp => jp.id === jobPostingId);
    if (jobPosting) {
      setFormData({
        ...formData,
        jobPostingId,
        position: jobPosting.title || formData.position,
        department: jobPosting.department || formData.department
      });
    } else {
      setFormData({ ...formData, jobPostingId });
    }
  }

  function handleBenefitChange(key: string, value: any) {
    setFormData({
      ...formData,
      benefits: {
        ...formData.benefits,
        [key]: value
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!formData.candidateId) {
      alert('Lütfen aday seçin');
      return;
    }

    if (!formData.position || !formData.department) {
      alert('Lütfen pozisyon ve departman girin');
      return;
    }

    if (formData.salary <= 0) {
      alert('Lütfen geçerli bir maaş girin');
      return;
    }

    if (!formData.startDate) {
      alert('Lütfen başlangıç tarihi seçin');
      return;
    }

    try {
      setSubmitting(true);

      // Feature #14: Create from template if selected
      let offer;
      if (selectedTemplate) {
        offer = await templateService.createOfferFromTemplate(selectedTemplate.id, formData);
        offer = offer.data; // Extract from response
      } else {
        offer = await offerService.createOffer(formData);
      }

      alert('Teklif başarıyla oluşturuldu!');
      router.push(`/offers/${offer.id}`);
    } catch (error: any) {
      alert(error.message || 'Teklif oluşturulurken hata oluştu');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingData) {
    return (
      <div className="p-6">
        <div className="animate-pulse text-gray-700">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Geri
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Teklif Oluştur</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 0: Template Selection (Feature #8) */}
        {templates.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">📋 Şablon Seç (Opsiyonel)</h2>
            <select
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
            >
              <option value="">Şablon kullanmadan oluştur</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} - {t.position} (₺{t.salaryMin.toLocaleString()}-₺{t.salaryMax.toLocaleString()})
                </option>
              ))}
            </select>
            {selectedTemplate && (
              <p className="mt-2 text-sm text-blue-700">
                ✅ Şablon seçildi: {selectedTemplate.name} - Tüm alanlar otomatik doldu
              </p>
            )}
          </div>
        )}

        {/* Section 1: Aday Seçimi */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">1. Aday Seçimi</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aday <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.candidateId}
              onChange={(e) => handleCandidateChange(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Aday seçin...</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} - {c.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2: İlan Seçimi */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">2. İlan Seçimi (Opsiyonel)</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İş İlanı
            </label>
            <select
              value={formData.jobPostingId}
              onChange={(e) => handleJobPostingChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">İlan seçin (opsiyonel)</option>
              {jobPostings.map((jp) => (
                <option key={jp.id} value={jp.id}>
                  {jp.title} - {jp.department}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-600">
              İlan seçerseniz pozisyon ve departman otomatik dolar
            </p>
          </div>
        </div>

        {/* Section 3: Teklif Detayları */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">3. Teklif Detayları</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pozisyon <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Örn: Senior Software Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departman <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Örn: Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maaş <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="50000"
                />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlangıç Tarihi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Çalışma Şekli
            </label>
            <div className="flex gap-4">
              <label className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name="workType"
                  value="office"
                  checked={formData.workType === 'office'}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  className="mr-2"
                />
                Ofis
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name="workType"
                  value="hybrid"
                  checked={formData.workType === 'hybrid'}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  className="mr-2"
                />
                Hibrit
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name="workType"
                  value="remote"
                  checked={formData.workType === 'remote'}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  className="mr-2"
                />
                Uzaktan
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Yan Haklar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">4. Yan Haklar</h2>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.benefits.insurance}
                onChange={(e) => handleBenefitChange('insurance', e.target.checked)}
                className="mr-3 h-4 w-4"
              />
              <span className="text-sm text-gray-700">Özel Sağlık Sigortası</span>
            </label>

            <div>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={formData.benefits.meal > 0}
                  onChange={(e) => handleBenefitChange('meal', e.target.checked ? 1000 : 0)}
                  className="mr-3 h-4 w-4"
                />
                <span className="text-sm text-gray-700">Yemek Kartı</span>
              </label>
              {formData.benefits.meal > 0 && (
                <input
                  type="number"
                  value={formData.benefits.meal}
                  onChange={(e) => handleBenefitChange('meal', parseInt(e.target.value) || 0)}
                  className="ml-7 border border-gray-300 rounded px-3 py-1 w-32"
                  placeholder="₺/ay"
                />
              )}
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.benefits.transportation}
                onChange={(e) => handleBenefitChange('transportation', e.target.checked)}
                className="mr-3 h-4 w-4"
              />
              <span className="text-sm text-gray-700">Ulaşım Desteği</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.benefits.gym}
                onChange={(e) => handleBenefitChange('gym', e.target.checked)}
                className="mr-3 h-4 w-4"
              />
              <span className="text-sm text-gray-700">Spor Salonu Üyeliği</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.benefits.education}
                onChange={(e) => handleBenefitChange('education', e.target.checked)}
                className="mr-3 h-4 w-4"
              />
              <span className="text-sm text-gray-700">Eğitim Desteği</span>
            </label>
          </div>
        </div>

        {/* Section 5: Şartlar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">5. Şartlar ve Koşullar</h2>
          <textarea
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Örn: Çalışma saatleri 09:00-18:00. Deneme süresi 3 ay. Yıllık izin 14 gün."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {submitting ? 'Oluşturuluyor...' : 'Teklif Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
}
