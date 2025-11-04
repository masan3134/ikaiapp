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
  Zap,
  Target,
  Activity,
  Star,
  Award,
  Rocket,
  ChevronRight,
  Eye,
  Settings,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Search,
} from "lucide-react";

export default function SettingsOverviewPage() {
  const { user } = useAuthStore();
  const { organization, usage } = useOrganization();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<"overview" | "stats" | "activity">("overview");
  const [searchQuery, setSearchQuery] = useState("");

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
    { name: "Yeni Analiz", href: "/wizard", icon: Sparkles, color: "blue", shortcut: "N" },
    { name: "İş İlanları", href: "/job-postings", icon: Briefcase, color: "green", shortcut: "J" },
    { name: "Adaylar", href: "/candidates", icon: Users, color: "purple", shortcut: "C" },
    { name: "Teklifler", href: "/offers", icon: FileText, color: "orange", shortcut: "O" },
    { name: "Mülakatlar", href: "/interviews", icon: Calendar, color: "pink", shortcut: "I" },
    { name: "Analizler", href: "/analyses", icon: BarChart3, color: "indigo", shortcut: "A" },
  ];

  const settingsSections = [
    {
      title: "Profil",
      description: "Kişisel bilgilerinizi düzenleyin",
      href: "/settings/profile",
      icon: User,
      color: "blue",
      shortcut: "P",
    },
    {
      title: "Şirket",
      description: "Organizasyon ayarları",
      href: "/settings/organization",
      icon: Building2,
      color: "purple",
      shortcut: "S",
    },
    {
      title: "Kullanım & Planlar",
      description: "Faturalama bilgileri",
      href: "/settings/billing",
      icon: TrendingUp,
      color: "green",
      shortcut: "B",
    },
    {
      title: "Bildirimler",
      description: "Bildirim tercihleriniz",
      href: "/settings/notifications",
      icon: Bell,
      color: "orange",
      shortcut: "T",
    },
    {
      title: "Güvenlik",
      description: "Şifre ve oturum yönetimi",
      href: "/settings/security",
      icon: Shield,
      color: "red",
      shortcut: "G",
    },
  ];

  const performanceMetrics = [
    {
      label: "Haftalık Aktivite",
      value: "12",
      change: "+18%",
      trend: "up",
      icon: Activity,
      color: "green",
    },
    {
      label: "Ortalama Response",
      value: "2.4h",
      change: "-8%",
      trend: "down",
      icon: Clock,
      color: "blue",
    },
    {
      label: "Başarı Oranı",
      value: "94%",
      change: "+5%",
      trend: "up",
      icon: Target,
      color: "purple",
    },
    {
      label: "Kalite Skoru",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "yellow",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Command Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Hızlı arama... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedView("overview")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === "overview"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Genel
            </button>
            <button
              onClick={() => setSelectedView("stats")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === "stats"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              İstatistik
            </button>
            <button
              onClick={() => setSelectedView("activity")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === "activity"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Aktivite
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Filter className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={loadStats}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Banner - Compact Version */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Rocket className="w-6 h-6" />
              Merhaba, {user?.firstName || user?.email?.split("@")[0] || "Kullanıcı"}!
            </h2>
            <p className="text-blue-100">
              {organization?.name || "Organizasyon"} • {user?.position || user?.role}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {usage?.plan === "ENTERPRISE" && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                <Crown size={20} />
                <span className="font-medium">ENTERPRISE</span>
              </div>
            )}
            <Link
              href="/wizard"
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Yeni Analiz
            </Link>
          </div>
        </div>
      </div>

      {selectedView === "overview" && (
        <>
          {/* Quick Stats Grid - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: "Analizler",
                value: stats?.totalAnalyses || 0,
                icon: BarChart3,
                color: "blue",
                href: "/analyses",
              },
              {
                title: "Adaylar",
                value: stats?.totalCandidates || 0,
                icon: Users,
                color: "purple",
                href: "/candidates",
              },
              {
                title: "İş İlanları",
                value: stats?.totalJobPostings || 0,
                icon: Briefcase,
                color: "green",
                href: "/job-postings",
              },
              {
                title: "Mülakatlar",
                value: stats?.totalInterviews || 0,
                icon: Calendar,
                color: "orange",
                href: "/interviews",
              },
              {
                title: "Teklifler",
                value: stats?.totalOffers || 0,
                icon: FileText,
                color: "pink",
                href: "/offers",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
                green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
                orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
              }[stat.color];

              return (
                <Link
                  key={stat.title}
                  href={stat.href}
                  className={`bg-gradient-to-br ${colorClasses} rounded-xl shadow-lg p-5 text-white hover:shadow-xl transition-all transform hover:scale-105 group`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-8 h-8 opacity-90" />
                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.title}</div>
                </Link>
              );
            })}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {performanceMetrics.map((metric) => {
              const Icon = metric.icon;
              const trendColor = metric.trend === "up" ? "text-green-600" : "text-blue-600";
              const bgColor = {
                green: "bg-green-50 border-green-200",
                blue: "bg-blue-50 border-blue-200",
                purple: "bg-purple-50 border-purple-200",
                yellow: "bg-yellow-50 border-yellow-200",
              }[metric.color];

              return (
                <div
                  key={metric.label}
                  className={`${bgColor} rounded-xl border p-4 hover:shadow-md transition-all`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className={`text-sm font-medium ${trendColor}`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-600">{metric.label}</div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Analyses */}
              <Card title="Son Analizler">
                {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
                  <div className="space-y-2">
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
                                  {new Date(analysis.createdAt).toLocaleDateString("tr-TR")}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    analysis.status === "COMPLETED"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {analysis.status === "COMPLETED" ? "Tamamlandı" : "İşleniyor"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 mb-4">Henüz analiz oluşturmadınız</p>
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

              {/* Quick Actions Grid */}
              <Card title="Hızlı Eylemler">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    const colorClasses = {
                      blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
                      green: "bg-green-100 text-green-600 hover:bg-green-200",
                      purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
                      orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
                      pink: "bg-pink-100 text-pink-600 hover:bg-pink-200",
                      indigo: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
                    }[action.color];

                    return (
                      <Link
                        key={action.href}
                        href={action.href}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${colorClasses} group`}
                      >
                        <Icon size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-sm text-center">{action.name}</span>
                        <kbd className="text-xs opacity-50 bg-white/50 px-2 py-1 rounded">
                          {action.shortcut}
                        </kbd>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card title="Hesap Durumu">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600" size={20} />
                      <span className="text-sm font-medium text-green-900">Aktif</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-medium text-gray-900">{usage?.plan || "FREE"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rol</span>
                      <span className="font-medium text-gray-900">{user?.role}</span>
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
                          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={14} />
                          <span className="text-yellow-800">{warning.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Achievements */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-gray-900">Başarılar</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-700">İlk Analiz ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-700">10 Aday Eklediniz ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-300" />
                    <span className="text-sm text-gray-400">İlk İşe Alım</span>
                  </div>
                </div>
              </div>
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
                      {usage?.monthlyAnalysisCount || 0} / {usage?.maxAnalysisPerMonth || 10}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        (usage?.percentages?.analysis || 0) >= 80 ? "bg-red-500" : "bg-blue-500"
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
                        (usage?.percentages?.cv || 0) >= 80 ? "bg-red-500" : "bg-green-500"
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
                        (usage?.percentages?.user || 0) >= 80 ? "bg-red-500" : "bg-purple-500"
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
                      <h4 className="font-medium text-gray-900 mb-1">Sınırsız kullanıma geçin</h4>
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

          {/* Settings Navigation - Compact Grid */}
          <Card title="Ayarlar Bölümleri">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const colorClasses = {
                  blue: "border-blue-200 hover:border-blue-400 hover:bg-blue-50/50",
                  purple: "border-purple-200 hover:border-purple-400 hover:bg-purple-50/50",
                  green: "border-green-200 hover:border-green-400 hover:bg-green-50/50",
                  orange: "border-orange-200 hover:border-orange-400 hover:bg-orange-50/50",
                  red: "border-red-200 hover:border-red-400 hover:bg-red-50/50",
                }[section.color];

                const iconColor = {
                  blue: "text-blue-600",
                  purple: "text-purple-600",
                  green: "text-green-600",
                  orange: "text-orange-600",
                  red: "text-red-600",
                }[section.color];

                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    className={`p-4 rounded-lg border-2 ${colorClasses} transition-all group`}
                  >
                    <Icon
                      className={`${iconColor} mb-3 group-hover:scale-110 transition-transform`}
                      size={24}
                    />
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">{section.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{section.description}</p>
                    <kbd className="mt-2 inline-block text-xs opacity-50 bg-white px-2 py-1 rounded">
                      {section.shortcut}
                    </kbd>
                  </Link>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {selectedView === "stats" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">İstatistikler Görünümü</h3>
          <p className="text-gray-600">Detaylı istatistikler burada gösterilecek</p>
        </div>
      )}

      {selectedView === "activity" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aktivite Zaman Çizelgesi</h3>
          <p className="text-gray-600">Son aktiviteleriniz burada gösterilecek</p>
        </div>
      )}
    </div>
  );
}
