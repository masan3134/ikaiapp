'use client';

import { useState, useEffect } from 'react';
import {
  getPreferences,
  updatePreferences,
  type NotificationPreference
} from '@/lib/api/notifications';
import { CheckCircleIcon, BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

/**
 * Notification Preferences Page (NEW SYSTEM - v2.0)
 *
 * Features:
 * - 15 notification types with individual toggles
 * - In-app notification toggle per type
 * - Email notification toggle per type
 * - Save button with loading state
 * - Reset to defaults
 * - Success/error messages
 * - Stats display
 *
 * Route: /settings/notifications
 *
 * Created by: Worker #2
 * Date: 2025-11-04
 * Replaces: Old 4-toggle system
 */

const notificationTypeLabels: Record<string, { label: string; description: string; category: string }> = {
  // Analysis (3)
  ANALYSIS_STARTED: {
    label: 'Analiz Başlatıldı',
    description: 'CV analizi başladığında bildirim al',
    category: 'CV Analizi'
  },
  ANALYSIS_COMPLETED: {
    label: 'Analiz Tamamlandı',
    description: 'CV analizi tamamlandığında sonuçları gör',
    category: 'CV Analizi'
  },
  ANALYSIS_FAILED: {
    label: 'Analiz Başarısız',
    description: 'CV analizi başarısız olduğunda bilgilendir',
    category: 'CV Analizi'
  },

  // Candidate (1)
  CANDIDATE_UPLOADED: {
    label: 'Aday Eklendi',
    description: 'Yeni aday sisteme eklendiğinde',
    category: 'Adaylar'
  },

  // Offer (5)
  OFFER_CREATED: {
    label: 'Teklif Oluşturuldu',
    description: 'Yeni iş teklifi oluşturulduğunda',
    category: 'İş Teklifleri'
  },
  OFFER_SENT: {
    label: 'Teklif Gönderildi',
    description: 'Teklif adaya e-posta ile gönderildiğinde',
    category: 'İş Teklifleri'
  },
  OFFER_ACCEPTED: {
    label: '✅ Teklif Kabul Edildi',
    description: 'Aday teklifi kabul ettiğinde (önemli!)',
    category: 'İş Teklifleri'
  },
  OFFER_REJECTED: {
    label: '❌ Teklif Reddedildi',
    description: 'Aday teklifi reddettiğinde',
    category: 'İş Teklifleri'
  },
  OFFER_EXPIRED: {
    label: 'Teklif Süresi Doldu',
    description: 'Teklif 7 gün sonra süresi dolduğunda',
    category: 'İş Teklifleri'
  },

  // Interview (3)
  INTERVIEW_SCHEDULED: {
    label: 'Mülakat Planlandı',
    description: 'Yeni mülakat planlandığında',
    category: 'Mülakatlar'
  },
  INTERVIEW_COMPLETED: {
    label: 'Mülakat Tamamlandı',
    description: 'Mülakat tamamlandığında',
    category: 'Mülakatlar'
  },
  INTERVIEW_CANCELLED: {
    label: 'Mülakat İptal Edildi',
    description: 'Mülakat iptal edildiğinde',
    category: 'Mülakatlar'
  },

  // System (3)
  USER_INVITED: {
    label: 'Kullanıcı Davet Edildi',
    description: 'Yeni kullanıcı organizasyona davet edildiğinde',
    category: 'Sistem'
  },
  USAGE_LIMIT_WARNING: {
    label: '⚠️ Limit Uyarısı (%80)',
    description: 'Aylık kullanım limitinin %80\'ine ulaşıldığında',
    category: 'Sistem'
  },
  USAGE_LIMIT_REACHED: {
    label: '🚨 Limit Doldu',
    description: 'Aylık kullanım limiti dolduğunda (önemli!)',
    category: 'Sistem'
  }
};

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await getPreferences();
      setPreferences(prefs);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Tercihler yüklenemedi' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (type: string, field: 'enabled' | 'emailEnabled') => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.type === type
          ? { ...pref, [field]: !pref[field] }
          : pref
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      await updatePreferences(preferences);

      setMessage({ type: 'success', text: '✅ Tercihler başarıyla kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Tercihler kaydedilemedi' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    setPreferences(prev =>
      prev.map(pref => ({
        ...pref,
        enabled: true,
        emailEnabled: false
      }))
    );
  };

  const enabledCount = preferences.filter(p => p.enabled).length;
  const emailEnabledCount = preferences.filter(p => p.emailEnabled).length;

  // Group by category
  const categories = ['CV Analizi', 'Adaylar', 'İş Teklifleri', 'Mülakatlar', 'Sistem'];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bildirim Ayarları
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Hangi bildirimleri almak istediğinizi seçin. Her bildirim türü için uygulama içi ve e-posta tercihlerini ayrı ayrı ayarlayabilirsiniz.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'}`}>
          {message.type === 'success' && <CheckCircleIcon className="h-5 w-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <BellIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uygulama İçi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {enabledCount} / {preferences.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <EnvelopeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">E-posta</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emailEnabledCount} / {preferences.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kategoriler</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences by Category */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map(category => {
            const categoryPrefs = preferences.filter(p =>
              notificationTypeLabels[p.type]?.category === category
            );

            if (categoryPrefs.length === 0) return null;

            return (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Category Header */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                    {category}
                  </h3>
                </div>

                {/* Preferences */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {categoryPrefs.map((pref, index) => {
                    const typeInfo = notificationTypeLabels[pref.type];

                    return (
                      <div
                        key={pref.type}
                        className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-6">
                          {/* Info */}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {typeInfo?.label || pref.type}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {typeInfo?.description || ''}
                            </p>
                          </div>

                          {/* Toggles */}
                          <div className="flex items-center gap-6">
                            {/* In-App Toggle */}
                            <div className="flex flex-col items-center gap-1">
                              <label className="text-xs text-gray-600 dark:text-gray-400">Uygulama</label>
                              <button
                                onClick={() => handleToggle(pref.type, 'enabled')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pref.enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pref.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                              </button>
                            </div>

                            {/* Email Toggle */}
                            <div className="flex flex-col items-center gap-1">
                              <label className="text-xs text-gray-600 dark:text-gray-400">E-posta</label>
                              <button
                                onClick={() => handleToggle(pref.type, 'emailEnabled')}
                                disabled={!pref.enabled}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pref.emailEnabled && pref.enabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'} ${!pref.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pref.emailEnabled && pref.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <button
          onClick={handleResetToDefaults}
          disabled={loading || saving}
          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Varsayılanlara Dön
        </button>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-5 w-5" />
              Tercihleri Kaydet
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <span className="text-lg">💡</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Bildirim Tercihleri Hakkında
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• E-posta bildirimleri sadece uygulama içi bildirimi açık olan tipler için gönderilebilir</li>
              <li>• Önemli olaylar (Teklif Kabul/Red, Limit Doldu) için e-posta bildirimi önerilir</li>
              <li>• Tercihleriniz anında uygulanır, yeniden giriş yapmanıza gerek yoktur</li>
              <li>• SUPER_ADMIN tüm organizasyonlardan bildirimleri görür</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
