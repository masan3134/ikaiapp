"use client";

import { useState, useEffect } from "react";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useToast } from "@/lib/hooks/useToast";
import { updateOrganization } from "@/lib/services/organizationService";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Building2,
  Palette,
  Crown,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2,
  Save,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";

function OrganizationSettingsPage() {
  const { organization, usage, loading, refreshOrganization } =
    useOrganization();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    primaryColor: "#3B82F6",
    industry: "",
    size: "",
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        logo: organization.logo || "",
        primaryColor: organization.primaryColor || "#3B82F6",
        industry: organization.industry || "",
        size: organization.size || "",
      });
    }
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateOrganization(formData);
      toast.success("✅ Organizasyon bilgileri başarıyla kaydedildi!", {
        duration: 3000,
      });
      await refreshOrganization();
    } catch (error: any) {
      console.error("[SETTINGS] Update failed:", error);
      toast.error(error?.response?.data?.message || "✗ Güncelleme başarısız");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        logo: organization.logo || "",
        primaryColor: organization.primaryColor || "#3B82F6",
        industry: organization.industry || "",
        size: organization.size || "",
      });
      toast.success("Form sıfırlandı");
    }
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
      {/* Organization Branding */}
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md">
            <Building2 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Organizasyon Bilgileri
            </h2>
            <p className="text-sm text-gray-600">
              Şirketinizin temel bilgilerini güncelleyin
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
            >
              <Building2 size={16} className="text-blue-600" />
              Organizasyon Adı *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300"
              placeholder="Şirket adınızı girin"
              required
            />
          </div>

          {/* Logo & Color Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div>
              <label
                htmlFor="logo"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <Sparkles size={16} className="text-purple-600" />
                Logo URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  id="logo"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-gray-300"
                />
                {formData.logo && (
                  <div className="relative w-12 h-12 rounded-lg border-2 border-gray-200 overflow-hidden bg-white shadow-sm">
                    <img
                      src={formData.logo}
                      alt="Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Primary Color */}
            <div>
              <label
                htmlFor="primaryColor"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <Palette size={16} className="text-pink-600" />
                Ana Renk
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                  className="h-12 w-16 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-all"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all hover:border-gray-300 font-mono"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#3B82F6"
                />
                <div
                  className="w-12 h-12 rounded-lg shadow-md border-2 border-white ring-2 ring-gray-200"
                  style={{ backgroundColor: formData.primaryColor }}
                />
              </div>
            </div>
          </div>

          {/* Industry & Size Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Industry */}
            <div>
              <label
                htmlFor="industry"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <Building2 size={16} className="text-green-600" />
                Sektör
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-gray-300 bg-white"
              >
                <option value="">Seçiniz</option>
                <option value="technology">💻 Teknoloji</option>
                <option value="finance">💰 Finans</option>
                <option value="healthcare">🏥 Sağlık</option>
                <option value="education">📚 Eğitim</option>
                <option value="retail">🛒 Perakende</option>
                <option value="manufacturing">🏭 İmalat</option>
                <option value="other">🔧 Diğer</option>
              </select>
            </div>

            {/* Size */}
            <div>
              <label
                htmlFor="size"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <Users size={16} className="text-orange-600" />
                Şirket Büyüklüğü
              </label>
              <select
                id="size"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-300 bg-white"
              >
                <option value="">Seçiniz</option>
                <option value="1-10">👥 1-10 çalışan</option>
                <option value="11-50">👨‍👩‍👧 11-50 çalışan</option>
                <option value="51-200">👨‍👩‍👧‍👦 51-200 çalışan</option>
                <option value="201-500">🏢 201-500 çalışan</option>
                <option value="501+">🏙️ 501+ çalışan</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 font-medium shadow-sm"
            >
              <RefreshCw size={18} />
              Değişiklikleri Geri Al
            </button>
            <Button type="submit" loading={saving} size="lg">
              {saving ? (
                "Kaydediliyor..."
              ) : (
                <>
                  <Save size={18} />
                  Değişiklikleri Kaydet
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Plan & Usage */}
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
            <Crown className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Abonelik ve Kullanım
            </h2>
            <p className="text-sm text-gray-600">
              Planınız ve aylık kullanım durumunuz
            </p>
          </div>
        </div>

        {/* Current Plan Badge */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-full shadow-lg ${
                organization?.plan === "FREE"
                  ? "bg-gray-500"
                  : organization?.plan === "PRO"
                    ? "bg-blue-500"
                    : "bg-purple-500"
              }`}
            >
              {organization?.plan === "FREE" && (
                <Sparkles className="text-white" size={28} />
              )}
              {organization?.plan === "PRO" && (
                <TrendingUp className="text-white" size={28} />
              )}
              {organization?.plan === "ENTERPRISE" && (
                <Crown className="text-white" size={28} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Mevcut Plan
              </p>
              <h3
                className={`text-3xl font-bold ${
                  organization?.plan === "FREE"
                    ? "text-gray-800"
                    : organization?.plan === "PRO"
                      ? "text-blue-800"
                      : "text-purple-800"
                }`}
              >
                {organization?.plan || "FREE"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {organization?.plan === "FREE" &&
                  "Ücretsiz plan - Temel özellikler"}
                {organization?.plan === "PRO" &&
                  "Profesyonel plan - Sınırsız kullanım"}
                {organization?.plan === "ENTERPRISE" &&
                  "Kurumsal plan - Tam özellikler"}
              </p>
            </div>
          </div>
          {organization?.plan === "FREE" && (
            <Button variant="primary" size="lg">
              <Crown size={18} />
              PRO'ya Yükselt
            </Button>
          )}
        </div>

        {/* Usage Stats */}
        {usage && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Analyses */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                  <BarChart3 className="text-white" size={18} />
                </div>
                <p className="text-sm font-medium text-blue-700">
                  Aylık Analizler
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {usage.analyses.used}
                </span>
                <span className="text-lg text-gray-500">
                  / {usage.analyses.limit}
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-3 mb-2 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all shadow-sm"
                  style={{
                    width: `${Math.min((usage.analyses.used / usage.analyses.limit) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs font-medium text-blue-600 flex items-center gap-1">
                <CheckCircle2 size={12} />
                {usage.analyses.remaining} kalan
              </p>
            </div>

            {/* CVs */}
            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                  <Users className="text-white" size={18} />
                </div>
                <p className="text-sm font-medium text-green-700">
                  Aylık CV Yükleme
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {usage.cvs.used}
                </span>
                <span className="text-lg text-gray-500">
                  / {usage.cvs.limit}
                </span>
              </div>
              <div className="w-full bg-green-100 rounded-full h-3 mb-2 shadow-inner">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all shadow-sm"
                  style={{
                    width: `${Math.min((usage.cvs.used / usage.cvs.limit) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                <CheckCircle2 size={12} />
                {usage.cvs.remaining} kalan
              </p>
            </div>

            {/* Users */}
            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                  <Users className="text-white" size={18} />
                </div>
                <p className="text-sm font-medium text-purple-700">
                  Kullanıcılar
                </p>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {usage.users.used}
                </span>
                <span className="text-lg text-gray-500">
                  / {usage.users.limit}
                </span>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-3 mb-2 shadow-inner">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all shadow-sm"
                  style={{
                    width: `${Math.min((usage.users.used / usage.users.limit) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs font-medium text-purple-600 flex items-center gap-1">
                <CheckCircle2 size={12} />
                {usage.users.remaining} kalan
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Branding Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg shadow-md">
            <Palette className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Marka Kimliği</h2>
            <p className="text-sm text-gray-600">Logo ve renk ayarlarınız</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Industry */}
          <div>
            <label
              htmlFor="industry"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
            >
              <Building2 size={16} className="text-green-600" />
              Sektör
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-gray-300 bg-white"
            >
              <option value="">Seçiniz</option>
              <option value="technology">💻 Teknoloji</option>
              <option value="finance">💰 Finans</option>
              <option value="healthcare">🏥 Sağlık</option>
              <option value="education">📚 Eğitim</option>
              <option value="retail">🛒 Perakende</option>
              <option value="manufacturing">🏭 İmalat</option>
              <option value="other">🔧 Diğer</option>
            </select>
          </div>

          {/* Size */}
          <div>
            <label
              htmlFor="size"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
            >
              <Users size={16} className="text-orange-600" />
              Şirket Büyüklüğü
            </label>
            <select
              id="size"
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-300 bg-white"
            >
              <option value="">Seçiniz</option>
              <option value="1-10">👥 1-10 çalışan</option>
              <option value="11-50">👨‍👩‍👧 11-50 çalışan</option>
              <option value="51-200">👨‍👩‍👧‍👦 51-200 çalışan</option>
              <option value="201-500">🏢 201-500 çalışan</option>
              <option value="501+">🏙️ 501+ çalışan</option>
            </select>
          </div>
        </div>

        {/* Submit (for branding section) */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2 border-gray-100 mt-6">
          <button
            type="button"
            onClick={resetForm}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 font-medium shadow-sm"
          >
            <RefreshCw size={18} />
            Geri Al
          </button>
          <Button onClick={handleSubmit} loading={saving} size="lg">
            {saving ? (
              "Kaydediliyor..."
            ) : (
              <>
                <Save size={18} />
                Kaydet
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default withRoleProtection(OrganizationSettingsPage, {
  allowedRoles: RoleGroups.ADMINS,
  redirectTo: "/dashboard",
});
