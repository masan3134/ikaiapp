'use client';

import { useState, useEffect } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useToast } from '@/lib/hooks/useToast';
import { updateOrganization } from '@/lib/services/organizationService';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Building2, Upload, Crown } from 'lucide-react';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';

function OrganizationSettingsPage() {
  const { organization, usage, loading, refreshOrganization, refreshUsage } = useOrganization();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    primaryColor: '#3B82F6',
    industry: '',
    size: ''
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        logo: organization.logo || '',
        primaryColor: organization.primaryColor || '#3B82F6',
        industry: '',
        size: ''
      });
    }
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    console.log('[SETTINGS] Saving organization:', formData);

    try {
      const result = await updateOrganization(formData);
      console.log('[SETTINGS] Update successful:', result);
      toast.success('Organizasyon bilgileri güncellendi');
      await refreshOrganization();
      console.log('[SETTINGS] Organization refreshed');
    } catch (error: any) {
      console.error('[SETTINGS] Update failed:', error);
      toast.error(error?.response?.data?.message || 'Güncelleme başarısız');
    } finally {
      setSaving(false);
    }
  };

  const planColors = {
    FREE: 'bg-gray-100 text-gray-800',
    PRO: 'bg-blue-100 text-blue-800',
    ENTERPRISE: 'bg-purple-100 text-purple-800'
  };

  const planIcons = {
    FREE: null,
    PRO: <Crown size={16} className="text-blue-600" />,
    ENTERPRISE: <Crown size={16} className="text-purple-600" />
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Info Form */}
      <Card title="Organizasyon Bilgileri" subtitle="Organizasyonunuzun temel bilgilerini güncelleyin">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Organizasyon Adı
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.logo && (
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="w-10 h-10 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
              Ana Renk
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                id="primaryColor"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              Sektör
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seçiniz</option>
              <option value="technology">Teknoloji</option>
              <option value="finance">Finans</option>
              <option value="healthcare">Sağlık</option>
              <option value="education">Eğitim</option>
              <option value="retail">Perakende</option>
              <option value="manufacturing">İmalat</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          {/* Size */}
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
              Şirket Büyüklüğü
            </label>
            <select
              id="size"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seçiniz</option>
              <option value="1-10">1-10 çalışan</option>
              <option value="11-50">11-50 çalışan</option>
              <option value="51-200">51-200 çalışan</option>
              <option value="201-500">201-500 çalışan</option>
              <option value="501+">501+ çalışan</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              Değişiklikleri Kaydet
            </Button>
          </div>
        </form>
      </Card>

      {/* Plan Information */}
      <Card title="Abonelik Planı" subtitle="Mevcut plan ve kullanım bilgileriniz">
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Building2 size={24} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Mevcut Plan</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${planColors[organization?.plan || 'FREE']}`}>
                    {planIcons[organization?.plan || 'FREE']}
                    {organization?.plan || 'FREE'}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Planı Yükselt
            </Button>
          </div>

          {/* Usage Stats */}
          {usage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Analyses */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Analizler</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{usage.analyses.used}</span>
                  <span className="text-sm text-gray-500">/ {usage.analyses.limit}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(usage.analyses.used / usage.analyses.limit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {usage.analyses.remaining} kalan
                </p>
              </div>

              {/* CVs */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">CV'ler</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{usage.cvs.used}</span>
                  <span className="text-sm text-gray-500">/ {usage.cvs.limit}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${(usage.cvs.used / usage.cvs.limit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {usage.cvs.remaining} kalan
                </p>
              </div>

              {/* Users */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Kullanıcılar</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{usage.users.used}</span>
                  <span className="text-sm text-gray-500">/ {usage.users.limit}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${(usage.users.used / usage.users.limit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {usage.users.remaining} kalan
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default withRoleProtection(OrganizationSettingsPage, {
  allowedRoles: RoleGroups.ADMINS,
  redirectTo: '/dashboard'
});
