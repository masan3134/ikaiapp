"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { useOrganization } from "@/contexts/OrganizationContext";
import { getUserStats, UserStats } from "@/lib/services/userService";
import { Card } from "@/components/ui/Card";
import {
  BarChart3,
  Users,
  Briefcase,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Crown,
  CheckCircle2,
  AlertCircle,
  User,
  Building2,
  Bell,
  Shield,
} from "lucide-react";

export default function SettingsOverviewPage() {
  const { user } = useAuthStore();
  const { organization, usage } = useOrganization();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getUserStats();
      setStats(data);
    } catch (error) {
      console.error("[OVERVIEW] Stats load error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const quickActions = [
    { name: "Yeni Analiz", href: "/wizard", icon: Sparkles, color: "blue" },
    {
      name: "İş İlanları",
      href: "/job-postings",
      icon: Briefcase,
      color: "green",
    },
    { name: "Adaylar", href: "/candidates", icon: Users, color: "purple" },
    { name: "Teklifler", href: "/offers", icon: FileText, color: "orange" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Merhaba,{" "}
              {user?.firstName || user?.email?.split("@")[0] || "Kullanıcı"}! 👋
            </h2>
            <p className="text-blue-100 text-lg">
              {organization?.name || "Organizasyon"} -{" "}
              {user?.position || user?.role}
            </p>
          </div>
          {usage?.plan === "ENTERPRISE" && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <Crown size={20} />
              <span className="font-medium">ENTERPRISE</span>
            </div>
          )}
        </div>
      </div>

      {/* Activity Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Analyses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <Link
              href="/analyses"
              className="text-blue-600 hover:text-blue-700"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Analizler</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalAnalyses || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Toplam analiz sayısı</p>
        </div>

        {/* Candidates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="text-purple-600" size={24} />
            </div>
            <Link
              href="/candidates"
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Adaylar</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalCandidates || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Toplam aday sayısı</p>
        </div>

        {/* Job Postings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
              <Briefcase className="text-green-600" size={24} />
            </div>
            <Link
              href="/job-postings"
              className="text-green-600 hover:text-green-700"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            İş İlanları
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalJobPostings || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Aktif ilan sayısı</p>
        </div>

        {/* Interviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg group-hover:scale-110 transition-transform">
              <Calendar className="text-orange-600" size={24} />
            </div>
            <Link
              href="/interviews"
              className="text-orange-600 hover:text-orange-700"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Mülakatlar</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalInterviews || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Planlanan mülakat</p>
        </div>

        {/* Offers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-100 rounded-lg group-hover:scale-110 transition-transform">
              <FileText className="text-pink-600" size={24} />
            </div>
            <Link href="/offers" className="text-pink-600 hover:text-pink-700">
              <ArrowRight size={18} />
            </Link>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Teklifler</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalOffers || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Gönderilen teklif</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - 2/3 width */}
        <div className="lg:col-span-2">
          <Card title="Son Analizler">
            {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAnalyses.map((analysis) => (
                  <Link
                    key={analysis.id}
                    href={`/analyses/${analysis.id}`}
                    className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                          <BarChart3 className="text-blue-600" size={18} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {analysis.jobPosting.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(analysis.createdAt).toLocaleDateString(
                                "tr-TR"
                              )}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                analysis.status === "COMPLETED"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {analysis.status === "COMPLETED"
                                ? "Tamamlandı"
                                : "İşleniyor"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                        size={20}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 mb-4">
                  Henüz analiz oluşturmadınız
                </p>
                <Link
                  href="/wizard"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Sparkles size={16} />
                  İlk Analizinizi Oluşturun
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card title="Hızlı Eylemler">
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const colorClasses = {
                  blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
                  green: "bg-green-100 text-green-600 hover:bg-green-200",
                  purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
                  orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
                }[action.color];

                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${colorClasses}`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{action.name}</span>
                    <ArrowRight size={16} className="ml-auto" />
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Account Status */}
          <Card title="Hesap Durumu">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span className="text-sm font-medium text-green-900">
                    Aktif
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900">
                    {usage?.plan || "FREE"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rol</span>
                  <span className="font-medium text-gray-900">
                    {user?.role}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Üyelik</span>
                  <span className="font-medium text-gray-900">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "short",
                        })
                      : "-"}
                  </span>
                </div>
              </div>

              {usage?.warnings && usage.warnings.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  {usage.warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 bg-yellow-50 rounded text-xs"
                    >
                      <AlertCircle
                        className="text-yellow-600 flex-shrink-0 mt-0.5"
                        size={14}
                      />
                      <span className="text-yellow-800">{warning.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Usage Overview (if limited plan) */}
      {usage?.plan !== "ENTERPRISE" && (
        <Card title="Aylık Kullanım Özeti">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Analizler</span>
                <span className="text-sm font-medium text-gray-900">
                  {usage?.monthlyAnalysisCount || 0} /{" "}
                  {usage?.maxAnalysisPerMonth || 10}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    (usage?.percentages?.analysis || 0) >= 80
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min(usage?.percentages?.analysis || 0, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">CV'ler</span>
                <span className="text-sm font-medium text-gray-900">
                  {usage?.monthlyCvCount || 0} / {usage?.maxCvPerMonth || 50}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    (usage?.percentages?.cv || 0) >= 80
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(usage?.percentages?.cv || 0, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Kullanıcılar</span>
                <span className="text-sm font-medium text-gray-900">
                  {usage?.totalUsers || 1} / {usage?.maxUsers || 2}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    (usage?.percentages?.user || 0) >= 80
                      ? "bg-red-500"
                      : "bg-purple-500"
                  }`}
                  style={{
                    width: `${Math.min(usage?.percentages?.user || 0, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {usage?.plan === "FREE" && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Sınırsız kullanıma geçin
                  </h4>
                  <p className="text-sm text-gray-600">
                    PRO plan ile limitsiz analiz, CV ve kullanıcı ekleyin
                  </p>
                </div>
                <Link
                  href="/settings/billing"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                  Planları İncele
                </Link>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Settings Navigation */}
      <Card title="Ayarlar Bölümleri">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/settings/profile"
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
          >
            <User
              className="text-blue-600 mb-3 group-hover:scale-110 transition-transform"
              size={24}
            />
            <h3 className="font-medium text-gray-900 mb-1">Profil</h3>
            <p className="text-sm text-gray-600">
              Kişisel bilgilerinizi düzenleyin
            </p>
          </Link>

          <Link
            href="/settings/organization"
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all group"
          >
            <Building2
              className="text-purple-600 mb-3 group-hover:scale-110 transition-transform"
              size={24}
            />
            <h3 className="font-medium text-gray-900 mb-1">Şirket</h3>
            <p className="text-sm text-gray-600">Organizasyon ayarları</p>
          </Link>

          <Link
            href="/settings/billing"
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-green-400 hover:bg-green-50/50 transition-all group"
          >
            <TrendingUp
              className="text-green-600 mb-3 group-hover:scale-110 transition-transform"
              size={24}
            />
            <h3 className="font-medium text-gray-900 mb-1">
              Kullanım & Planlar
            </h3>
            <p className="text-sm text-gray-600">Faturalama bilgileri</p>
          </Link>

          <Link
            href="/settings/notifications"
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all group"
          >
            <Bell
              className="text-orange-600 mb-3 group-hover:scale-110 transition-transform"
              size={24}
            />
            <h3 className="font-medium text-gray-900 mb-1">Bildirimler</h3>
            <p className="text-sm text-gray-600">Bildirim tercihleriniz</p>
          </Link>

          <Link
            href="/settings/security"
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-red-400 hover:bg-red-50/50 transition-all group"
          >
            <Shield
              className="text-red-600 mb-3 group-hover:scale-110 transition-transform"
              size={24}
            />
            <h3 className="font-medium text-gray-900 mb-1">Güvenlik</h3>
            <p className="text-sm text-gray-600">Şifre ve oturum yönetimi</p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
