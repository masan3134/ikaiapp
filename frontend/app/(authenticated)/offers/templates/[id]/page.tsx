'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as templateService from '@/services/templateService';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  async function loadTemplate() {
    try {
      setLoading(true);
      setError('');
      const res = await templateService.fetchTemplateById(templateId);
      setTemplate(res.data);
    } catch (err: any) {
      setError(err.message || 'Şablon yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive() {
    try {
      if (template.isActive) {
        await templateService.deactivateTemplate(templateId);
        alert('Şablon pasif edildi');
      } else {
        await templateService.activateTemplate(templateId);
        alert('Şablon aktif edildi');
      }
      loadTemplate();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm('Bu şablonu silmek istediğinizden emin misiniz?')) return;

    try {
      await templateService.deleteTemplate(templateId);
      alert('Şablon silindi');
      router.push('/offers/templates');
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-700">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
        <button onClick={() => router.push('/offers/templates')} className="mt-4 text-blue-600">
          ← Şablonlara dön
        </button>
      </div>
    );
  }

  if (!template) {
    return <div className="p-6 text-gray-700">Şablon bulunamadı</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => router.push('/offers/templates')} className="text-blue-600 hover:text-blue-800 mb-4">
          ← Şablonlar
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {template.isActive ? 'Aktif' : 'Pasif'}
              </span>
              <span className="text-sm text-gray-600">
                {template.usageCount} kez kullanıldı
              </span>
              {template.category && (
                <span className="text-sm text-gray-600">
                  📁 {template.category.name}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleActive}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                template.isActive
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {template.isActive ? 'Pasif Et' : 'Aktif Et'}
            </button>
            <button
              onClick={() => router.push(`/offers/templates/${templateId}/edit`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              ✏️ Düzenle
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
            >
              🗑️ Sil
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Description */}
          {template.description && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-900">📝 Açıklama</h2>
              <p className="text-gray-700">{template.description}</p>
            </div>
          )}

          {/* Position Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">💼 Pozisyon Detayları</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Pozisyon</span>
                <p className="font-medium text-gray-900">{template.position}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Departman</span>
                <p className="font-medium text-gray-900">{template.department}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Maaş Aralığı</span>
                <p className="font-semibold text-blue-600">
                  ₺{template.salaryMin.toLocaleString('tr-TR')} - ₺{template.salaryMax.toLocaleString('tr-TR')}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Para Birimi</span>
                <p className="font-medium text-gray-900">{template.currency}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Çalışma Şekli</span>
                <p className="font-medium text-gray-900">
                  {template.workType === 'office' ? 'Ofis' : template.workType === 'hybrid' ? 'Hibrit' : 'Uzaktan'}
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          {template.benefits && Object.keys(template.benefits).some((k: any) => template.benefits[k]) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">🎁 Yan Haklar</h2>
              <ul className="space-y-2">
                {template.benefits.insurance && (
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Özel Sağlık Sigortası
                  </li>
                )}
                {template.benefits.meal > 0 && (
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Yemek Kartı (₺{template.benefits.meal}/ay)
                  </li>
                )}
                {template.benefits.transportation && (
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Ulaşım Desteği
                  </li>
                )}
                {template.benefits.gym && (
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Spor Salonu
                  </li>
                )}
                {template.benefits.education && (
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Eğitim Desteği
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Terms */}
          {template.terms && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">📜 Şartlar ve Koşullar</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{template.terms}</p>
            </div>
          )}

          {/* Email Template */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">📧 Email Şablonu</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Konu</span>
                <p className="font-medium text-gray-900">{template.emailSubject}</p>
              </div>
              {template.emailBody && (
                <div>
                  <span className="text-sm text-gray-600">İçerik</span>
                  <div className="mt-2 bg-gray-50 border rounded p-4 text-sm text-gray-700 whitespace-pre-wrap">
                    {template.emailBody}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Usage Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">📊 Kullanım İstatistikleri</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{template.usageCount}</div>
              <div className="text-sm text-gray-600 mt-1">Toplam Kullanım</div>
            </div>
          </div>

          {/* Recent Offers */}
          {template.offers && template.offers.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">📋 Son Teklifler</h2>
              <div className="space-y-3">
                {template.offers.slice(0, 5).map((offer: any) => (
                  <div key={offer.id} className="border-b pb-2">
                    <div className="text-sm font-medium text-gray-900">
                      {offer.candidate?.firstName} {offer.candidate?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(offer.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">ℹ️ Metadata</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Şablon ID:</span>
                <span className="text-gray-900 font-mono text-xs">{template.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Oluşturulma:</span>
                <span className="text-gray-900">
                  {new Date(template.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Son Güncelleme:</span>
                <span className="text-gray-900">
                  {new Date(template.updatedAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
