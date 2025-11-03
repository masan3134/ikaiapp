'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as templateService from '@/services/templateService';

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    position: '',
    department: '',
    salaryMin: 0,
    salaryMax: 0,
    currency: 'TRY',
    workType: 'office',
    benefits: {
      insurance: false,
      meal: 0,
      transportation: false,
      gym: false,
      education: false
    },
    terms: '',
    emailSubject: '',
    emailBody: ''
  });

  useEffect(() => {
    loadData();
  }, [templateId]);

  async function loadData() {
    try {
      setLoading(true);
      const [templateRes, categoriesRes] = await Promise.all([
        templateService.fetchTemplateById(templateId),
        templateService.fetchCategories()
      ]);

      const template = templateRes.data;
      setCategories(categoriesRes.data || []);

      setFormData({
        name: template.name,
        description: template.description || '',
        categoryId: template.categoryId || '',
        position: template.position,
        department: template.department,
        salaryMin: template.salaryMin,
        salaryMax: template.salaryMax,
        currency: template.currency,
        workType: template.workType,
        benefits: template.benefits,
        terms: template.terms,
        emailSubject: template.emailSubject,
        emailBody: template.emailBody || ''
      });
    } catch (error) {
      console.error(error);
      alert('Şablon yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name || !formData.position || !formData.department) {
      alert('Lütfen gerekli alanları doldurun');
      return;
    }

    if (formData.salaryMin <= 0 || formData.salaryMax <= 0 || formData.salaryMin > formData.salaryMax) {
      alert('Lütfen geçerli maaş aralığı girin');
      return;
    }

    try {
      setSubmitting(true);
      await templateService.updateTemplate(templateId, formData);
      alert('Şablon güncellendi!');
      router.push(`/offers/templates/${templateId}`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-700">Yükleniyor...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800 mb-4">
          ← Geri
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Şablon Düzenle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info - Same as new/page.tsx */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Şablon Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Position Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pozisyon Detayları</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pozisyon *</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departman *</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Maaş *</label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: parseInt(e.target.value) || 0 })}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Maaş *</label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: parseInt(e.target.value) || 0 })}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Varsayılan Yan Haklar</h2>
          <div className="space-y-3">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={formData.benefits.insurance}
                onChange={(e) => setFormData({
                  ...formData,
                  benefits: { ...formData.benefits, insurance: e.target.checked }
                })}
                className="mr-3"
              />
              Özel Sağlık Sigortası
            </label>

            <div>
              <label className="flex items-center text-gray-700 mb-2">
                <input
                  type="checkbox"
                  checked={formData.benefits.meal > 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    benefits: { ...formData.benefits, meal: e.target.checked ? 1000 : 0 }
                  })}
                  className="mr-3"
                />
                Yemek Kartı
              </label>
              {formData.benefits.meal > 0 && (
                <input
                  type="number"
                  value={formData.benefits.meal}
                  onChange={(e) => setFormData({
                    ...formData,
                    benefits: { ...formData.benefits, meal: parseInt(e.target.value) || 0 }
                  })}
                  className="ml-7 border rounded px-3 py-1 w-32"
                />
              )}
            </div>

            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={formData.benefits.transportation}
                onChange={(e) => setFormData({
                  ...formData,
                  benefits: { ...formData.benefits, transportation: e.target.checked }
                })}
                className="mr-3"
              />
              Ulaşım Desteği
            </label>

            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={formData.benefits.gym}
                onChange={(e) => setFormData({
                  ...formData,
                  benefits: { ...formData.benefits, gym: e.target.checked }
                })}
                className="mr-3"
              />
              Spor Salonu
            </label>

            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={formData.benefits.education}
                onChange={(e) => setFormData({
                  ...formData,
                  benefits: { ...formData.benefits, education: e.target.checked }
                })}
                className="mr-3"
              />
              Eğitim Desteği
            </label>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Şartlar ve Koşullar</h2>
          <textarea
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            rows={6}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Email Template */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Şablonu</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Konusu</label>
              <input
                type="text"
                value={formData.emailSubject}
                onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email İçeriği</label>
              <textarea
                value={formData.emailBody}
                onChange={(e) => setFormData({ ...formData, emailBody: e.target.value })}
                rows={4}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-700"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </form>
    </div>
  );
}
