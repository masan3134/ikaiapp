'use client';

import { useState, useEffect } from 'react';
import { getNotificationPreferences, updateNotificationPreferences, NotificationPreferences } from '@/lib/services/userService';
import { useToast } from '@/lib/hooks/useToast';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Bell, Mail, CheckCircle, Users, FileText } from 'lucide-react';

export default function NotificationsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    analysisNotifications: true,
    teamNotifications: true,
    offerNotifications: true
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await getNotificationPreferences();
      setPreferences(data);
    } catch (error: any) {
      console.error('[NOTIFICATIONS] Load error:', error);
      toast.error('Bildirim ayarları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateNotificationPreferences(preferences);
      toast.success('Bildirim ayarları kaydedildi');
    } catch (error: any) {
      console.error('[NOTIFICATIONS] Update error:', error);
      toast.error(error?.response?.data?.message || 'Ayarlar kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Notification Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="p-3 bg-blue-100 rounded-full">
            <Bell className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bildirim Tercihleri</h2>
            <p className="text-sm text-gray-600">Hangi bildirimleri almak istediğinizi seçin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center h-6 mt-1">
              <input
                id="email-notifications"
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="email-notifications" className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer">
                <Mail size={18} className="text-blue-600" />
                E-posta Bildirimleri
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Sistem güncellemeleri ve önemli duyurular hakkında e-posta alın
              </p>
            </div>
          </div>

          {/* Analysis Completion Notifications */}
          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center h-6 mt-1">
              <input
                id="analysis-notifications"
                type="checkbox"
                checked={preferences.analysisNotifications}
                onChange={() => handleToggle('analysisNotifications')}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="analysis-notifications" className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer">
                <CheckCircle size={18} className="text-green-600" />
                Analiz Tamamlama Bildirimleri
              </label>
              <p className="text-sm text-gray-600 mt-1">
                CV analizleriniz tamamlandığında bildirim alın
              </p>
            </div>
          </div>

          {/* Team Notifications */}
          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center h-6 mt-1">
              <input
                id="team-notifications"
                type="checkbox"
                checked={preferences.teamNotifications}
                onChange={() => handleToggle('teamNotifications')}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="team-notifications" className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer">
                <Users size={18} className="text-purple-600" />
                Takım Bildirimleri
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Yeni takım üyeleri ve rol değişiklikleri hakkında bildirim alın
              </p>
            </div>
          </div>

          {/* Offer Notifications */}
          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center h-6 mt-1">
              <input
                id="offer-notifications"
                type="checkbox"
                checked={preferences.offerNotifications}
                onChange={() => handleToggle('offerNotifications')}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="offer-notifications" className="flex items-center gap-2 font-medium text-gray-900 cursor-pointer">
                <FileText size={18} className="text-orange-600" />
                Teklif Bildirimleri
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Teklif durumu değişiklikleri ve adaylardan gelen yanıtlar hakkında bildirim alın
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={loadPreferences}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              İptal
            </button>
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Info Card */}
      <Card title="Bildirim Kanalları">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="text-blue-600 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">E-posta</h4>
              <p className="text-sm text-gray-600">
                Bildirimler hesabınıza kayıtlı e-posta adresine gönderilir
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bell className="text-purple-600 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Uygulama İçi</h4>
              <p className="text-sm text-gray-600">
                Önemli bildirimler dashboard'da görüntülenir (yakında)
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
