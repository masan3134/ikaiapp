"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import {
  getCurrentUser,
  updateCurrentUser,
  getUserStats,
  UserProfile,
  UserStats,
} from "@/lib/services/userService";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  User,
  Mail,
  Briefcase,
  Camera,
  Shield,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Save,
  RefreshCw,
  Bell,
  Hash,
  CalendarDays,
} from "lucide-react";

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    avatar: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        getCurrentUser(),
        getUserStats(),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        position: profileData.position || "",
        avatar: profileData.avatar || "",
      });
    } catch (error: any) {
      console.error("[PROFILE] Load error:", error);
      toast.error("Profil yüklenemedi");
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
      toast.success("✅ Profil başarıyla güncellendi!", { duration: 3000 });
    } catch (error: any) {
      console.error("[PROFILE] Update error:", error);
      toast.error(error?.response?.data?.message || "✗ Profil güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8 animate-pulse"
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="w-32 h-32 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-5 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const activityStats = [
    {
      label: "Analizler",
      value: stats?.totalAnalyses || 0,
      icon: BarChart3,
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      href: "/analyses",
    },
    {
      label: "Adaylar",
      value: stats?.totalCandidates || 0,
      icon: Users,
      gradient: "from-purple-500 via-purple-600 to-pink-600",
      href: "/candidates",
    },
    {
      label: "İş İlanları",
      value: stats?.totalJobPostings || 0,
      icon: Briefcase,
      gradient: "from-green-500 via-emerald-600 to-teal-600",
      href: "/job-postings",
    },
    {
      label: "Mülakatlar",
      value: stats?.totalInterviews || 0,
      icon: Calendar,
      gradient: "from-orange-500 via-amber-600 to-yellow-600",
      href: "/interviews",
    },
    {
      label: "Teklifler",
      value: stats?.totalOffers || 0,
      icon: FileText,
      gradient: "from-pink-500 via-rose-600 to-red-600",
      href: "/offers",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header Card - Ultra Modern */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        {/* Gradient Header Background */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 relative">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl ring-4 ring-white">
                {formData.firstName?.[0]?.toUpperCase() ||
                  formData.lastName?.[0]?.toUpperCase() ||
                  authUser?.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
              <button className="absolute bottom-2 right-2 p-3 bg-white rounded-xl shadow-xl border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group-hover:scale-110 duration-300">
                <Camera size={20} className="text-blue-600" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 pt-20 md:pt-0 md:pb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {formData.firstName || formData.lastName
                  ? `${formData.firstName || ""} ${formData.lastName || ""}`.trim()
                  : "İsimsiz Kullanıcı"}
              </h1>
              <p className="text-gray-600 flex items-center gap-2 mb-4 text-lg">
                <Mail size={20} className="text-blue-500" />
                <span>{profile?.email}</span>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-md ${
                    profile?.role === "SUPER_ADMIN"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : profile?.role === "ADMIN"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : profile?.role === "MANAGER"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
                  }`}
                >
                  <Shield size={16} />
                  {profile?.role}
                </span>
                {profile?.isActive ? (
                  <span className="px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-bold ring-2 ring-green-200 flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    Aktif
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-bold ring-2 ring-red-200">
                    ✗ Pasif
                  </span>
                )}
                {formData.position && (
                  <span className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 text-sm font-bold ring-2 ring-blue-200 flex items-center gap-1.5">
                    <Briefcase size={16} />
                    {formData.position}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <User size={16} className="text-blue-600" />
                  </div>
                  Ad *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Adınızı girin"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <User size={16} className="text-blue-600" />
                  </div>
                  Soyad *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Soyadınızı girin"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 text-gray-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Briefcase size={16} className="text-purple-600" />
                </div>
                Pozisyon
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder="Örn: İK Müdürü, İK Uzmanı, Platform Sahibi"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-gray-300 text-gray-900 font-medium"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={loadData}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 font-bold shadow-sm hover:shadow-md"
              >
                <RefreshCw size={20} />
                Değişiklikleri Geri Al
              </button>
              <Button type="submit" loading={saving} disabled={saving} size="lg" className="px-8 py-4">
                {saving ? (
                  "Kaydediliyor..."
                ) : (
                  <>
                    <Save size={20} />
                    Profili Kaydet
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Activity Stats - Premium Grid */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Aktivite İstatistikleriniz
              </h2>
              <p className="text-gray-600 mt-1">
                Platformdaki toplam aktiviteniz
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {activityStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className={`group relative bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl w-fit mb-4 shadow-lg">
                      <Icon size={24} />
                    </div>
                    <p className="text-4xl font-bold mb-2">
                      {stat.value}
                    </p>
                    <p className="text-white/90 font-medium flex items-center justify-between">
                      {stat.label}
                      <ArrowRight
                        size={16}
                        className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Account Info & Quick Links Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Info */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <User className="w-5 h-5 text-white" />
              </div>
              Hesap Bilgileri
            </h3>
            <p className="text-gray-600 mt-1 ml-12">Hesabınızın detay bilgileri</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200/50 hover:shadow-lg transition-all">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Mail size={18} className="text-blue-500" />
                E-posta
              </span>
              <span className="text-sm font-bold text-gray-900">
                {profile?.email}
              </span>
            </div>
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200/50 hover:shadow-lg transition-all">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Hash size={18} className="text-purple-500" />
                Kullanıcı ID
              </span>
              <span className="text-xs font-mono text-gray-600 bg-white px-3 py-1.5 rounded-lg border-2 border-gray-200 shadow-sm">
                {profile?.id?.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200/50 hover:shadow-lg transition-all">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <CalendarDays size={18} className="text-green-500" />
                Kayıt Tarihi
              </span>
              <span className="text-sm font-bold text-gray-900">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200/50 hover:shadow-lg transition-all">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Hesap Durumu
              </span>
              {profile?.isActive ? (
                <span className="text-sm font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  Aktif
                </span>
              ) : (
                <span className="text-sm font-bold text-red-600">Pasif</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Hızlı Bağlantılar
            </h3>
            <p className="text-gray-600 mt-1 ml-12">Diğer ayar sayfalarına git</p>
          </div>
          <div className="p-6 space-y-4">
            <Link
              href="/settings/security"
              className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Shield className="text-white" size={22} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block text-lg">Güvenlik Ayarları</span>
                  <span className="text-xs text-gray-600">Şifre ve oturum yönetimi</span>
                </div>
              </div>
              <ArrowRight
                className="text-blue-500 group-hover:translate-x-2 transition-all"
                size={22}
              />
            </Link>

            <Link
              href="/settings/notifications"
              className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Bell className="text-white" size={22} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block text-lg">Bildirim Tercihleri</span>
                  <span className="text-xs text-gray-600">15 bildirim türü ayarları</span>
                </div>
              </div>
              <ArrowRight
                className="text-purple-500 group-hover:translate-x-2 transition-all"
                size={22}
              />
            </Link>

            <Link
              href="/settings/organization"
              className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Briefcase className="text-white" size={22} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block text-lg">Şirket Ayarları</span>
                  <span className="text-xs text-gray-600">Organizasyon ve marka</span>
                </div>
              </div>
              <ArrowRight
                className="text-green-500 group-hover:translate-x-2 transition-all"
                size={22}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
