'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getCurrentUser, updateCurrentUser, UserProfile } from '@/lib/services/userService';
import { useToast } from '@/lib/hooks/useToast';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { User, Mail, Briefcase, Camera, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    avatar: ''
  });

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUser();
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        position: data.position || '',
        avatar: data.avatar || ''
      });
    } catch (error: any) {
      console.error('[PROFILE] Load error:', error);
      toast.error('Profil yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await updateCurrentUser(formData);
      setProfile(updated);
      toast.success('Profil başarıyla güncellendi');
    } catch (error: any) {
      console.error('[PROFILE] Update error:', error);
      toast.error(error?.response?.data?.message || 'Profil güncellenemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {formData.firstName?.[0]?.toUpperCase() || formData.lastName?.[0]?.toUpperCase() || authUser?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
              <Camera size={16} className="text-gray-600" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {formData.firstName || formData.lastName
                ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
                : 'İsimsiz Kullanıcı'}
            </h2>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Mail size={16} />
              {profile?.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                profile?.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                profile?.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                profile?.role === 'MANAGER' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                <Shield size={12} />
                {profile?.role}
              </span>
              {profile?.isActive ? (
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                  Aktif
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                  Pasif
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Ad
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Adınızı girin"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Soyad
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Soyadınızı girin"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase size={16} className="inline mr-1" />
              Pozisyon
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Örn: İK Müdürü, İK Uzmanı"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="inline mr-1" />
              E-posta (Değiştirilemez)
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              E-posta adresinizi değiştirmek için destek ekibi ile iletişime geçin
            </p>
          </div>

          {/* Role (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield size={16} className="inline mr-1" />
              Rol (Değiştirilemez)
            </label>
            <input
              type="text"
              value={profile?.role || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Rolünüzü değiştirmek için yöneticinizle iletişime geçin
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={loadProfile}
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
              {saving ? 'Kaydediliyor...' : 'Profili Kaydet'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Additional Info Card */}
      <Card title="Hesap Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Kayıt Tarihi</p>
            <p className="text-sm font-medium text-gray-900">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '-'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Hesap Durumu</p>
            <p className="text-sm font-medium text-gray-900">
              {profile?.isActive ? (
                <span className="text-green-600">✓ Aktif</span>
              ) : (
                <span className="text-red-600">✗ Pasif</span>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Password Change Card */}
      <Card title="Şifre Değiştirme">
        <p className="text-sm text-gray-600 mb-4">
          Şifrenizi değiştirmek için lütfen destek ekibi ile iletişime geçin.
        </p>
        <a
          href="mailto:info@gaiai.ai?subject=Şifre Değiştirme Talebi"
          className="inline-block px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
        >
          Destek Ekibine Ulaş
        </a>
      </Card>
    </div>
  );
}
