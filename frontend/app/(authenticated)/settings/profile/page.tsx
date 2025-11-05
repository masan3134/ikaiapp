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
    <div className="space-y-4">
      {/* Profile Header Card - COMPACT */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Gradient Header - SMALLER */}
        <div className="h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar + Info - COMPACT */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 relative">
            {/* Avatar - SMALLER */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white">
                {formData.firstName?.[0]?.toUpperCase() ||
                  formData.lastName?.[0]?.toUpperCase() ||
                  authUser?.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all">
                <Camera size={16} className="text-blue-600" />
              </button>
            </div>

            {/* Info - COMPACT */}
            <div className="flex-1 w-full md:pb-2 text-center md:text-left">
              {/* Name - SMALLER */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {formData.firstName || formData.lastName
                  ? `${formData.firstName || ""} ${formData.lastName || ""}`.trim()
                  : "İsimsiz Kullanıcı"}
              </h1>

              {/* Email - COMPACT */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Mail size={16} className="text-blue-500 shrink-0" />
                <span className="text-gray-600 text-sm font-medium">{profile?.email}</span>
              </div>

              {/* Badges - SMALLER */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${
                    profile?.role === "SUPER_ADMIN"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : profile?.role === "ADMIN"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : profile?.role === "MANAGER"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
                  }`}
                >
                  <Shield size={14} />
                  {profile?.role}
                </span>
                {profile?.isActive ? (
                  <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    Aktif
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-bold">
                    Pasif
                  </span>
                )}
                {formData.position && (
                  <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5">
                    <Briefcase size={14} />
                    {formData.position}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form - COMPACT */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                  <User size={14} className="text-blue-600" />
                  Ad *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Adınızı girin"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                  <User size={14} className="text-blue-600" />
                  Soyad *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Soyadınızı girin"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                  <Briefcase size={14} className="text-purple-600" />
                  Pozisyon
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="İK Müdürü"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={loadData}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 font-medium text-sm"
              >
                <RefreshCw size={16} />
                Geri Al
              </button>
              <Button type="submit" loading={saving} disabled={saving} className="px-4 py-2">
                {saving ? (
                  "Kaydediliyor..."
                ) : (
                  <>
                    <Save size={16} />
                    Profili Kaydet
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Activity Stats - COMPACT */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200/50 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={18} />
          <h2 className="text-lg font-bold text-gray-900">Aktivite</h2>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-5 gap-3">
            {activityStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className={`group relative bg-gradient-to-br ${stat.gradient} rounded-xl p-3 text-white hover:shadow-lg transition-all duration-300 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <Icon size={16} className="mb-2 opacity-80" />
                    <p className="text-2xl font-bold mb-1">
                      {stat.value}
                    </p>
                    <p className="text-white/80 text-xs font-medium">
                      {stat.label}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Account Info & Quick Links - COMPACT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Account Info - COMPACT */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200/50 flex items-center gap-2">
            <User className="text-blue-600" size={18} />
            <h3 className="text-lg font-bold text-gray-900">Hesap Bilgileri</h3>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/50 transition-all">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                E-posta
              </span>
              <span className="text-xs font-bold text-gray-900">
                {profile?.email}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200/50 transition-all">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                <Hash size={16} className="text-purple-500" />
                Kullanıcı ID
              </span>
              <span className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                {profile?.id?.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50 transition-all">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                <CalendarDays size={16} className="text-green-500" />
                Kayıt Tarihi
              </span>
              <span className="text-xs font-bold text-gray-900">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/50 transition-all">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                Hesap Durumu
              </span>
              {profile?.isActive ? (
                <span className="text-xs font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Aktif
                </span>
              ) : (
                <span className="text-xs font-bold text-red-600">Pasif</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links - COMPACT */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200/50 flex items-center gap-2">
            <Sparkles className="text-purple-600" size={18} />
            <h3 className="text-lg font-bold text-gray-900">Hızlı Bağlantılar</h3>
          </div>
          <div className="p-4 space-y-2">
            <Link
              href="/settings/security"
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg shadow group-hover:scale-105 transition-transform">
                  <Shield className="text-white" size={16} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block text-sm">Güvenlik Ayarları</span>
                  <span className="text-xs text-gray-600">Şifre ve oturum yönetimi</span>
                </div>
              </div>
              <ArrowRight
                className="text-blue-500 group-hover:translate-x-1 transition-all"
                size={16}
              />
            </Link>

            <Link
              href="/settings/notifications"
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg shadow group-hover:scale-105 transition-transform">
                  <Bell className="text-white" size={16} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block text-sm">Bildirim Tercihleri</span>
                  <span className="text-xs text-gray-600">15 bildirim türü ayarları</span>
                </div>
              </div>
              <ArrowRight
                className="text-purple-500 group-hover:translate-x-1 transition-all"
                size={16}
              />
            </Link>

            <Link
              href="/settings/organization"
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg shadow group-hover:scale-105 transition-transform">
                  <Briefcase className="text-white" size={16} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block text-sm">Şirket Ayarları</span>
                  <span className="text-xs text-gray-600">Organizasyon ve marka</span>
                </div>
              </div>
              <ArrowRight
                className="text-green-500 group-hover:translate-x-1 transition-all"
                size={16}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
