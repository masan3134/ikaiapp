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
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 animate-pulse border border-gray-200"
            >
              <div className="h-10 w-10 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
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
    <div className="space-y-8">
      {/* Command Bar - Modern Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-5">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Hızlı arama... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border-2 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-900 font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedView("overview")}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                selectedView === "overview"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Genel
            </button>
            <button
              onClick={() => setSelectedView("stats")}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                selectedView === "stats"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              İstatistik
            </button>
            <button
              onClick={() => setSelectedView("activity")}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                selectedView === "activity"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Aktivite
            </button>
            <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all">
              <Filter className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={loadStats}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:rotate-180 duration-500"
            >
              <RefreshCw className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Banner - Ultra Modern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-xl">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  Merhaba, {user?.firstName || user?.email?.split("@")[0] || "Kullanıcı"}!
                  {usage?.plan === "ENTERPRISE" && (
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/20 backdrop-blur-sm rounded-full text-lg">
                      <Crown className="w-5 h-5 text-amber-300" />
                      <span className="text-amber-100 font-semibold">ENTERPRISE</span>
                    </span>
                  )}
                </h1>
                <p className="text-xl text-blue-100">
                  {organization?.name || "Organizasyon"} • {user?.position || user?.role}
                </p>
              </div>
            </div>
            <Link
              href="/wizard"
              className="px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all font-bold text-lg flex items-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105 duration-300"
            >
              <Plus className="w-6 h-6" />
              Yeni Analiz
            </Link>
          </div>
        </div>
      </div>

      {selectedView === "overview" && (
        <>
          {/* Quick Stats Grid - Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Analizler",
                value: stats?.totalAnalyses || 0,
                icon: BarChart3,
                gradient: "from-blue-500 via-blue-600 to-indigo-600",
                href: "/analyses",
              },
              {
                title: "Adaylar",
                value: stats?.totalCandidates || 0,
                icon: Users,
                gradient: "from-purple-500 via-purple-600 to-pink-600",
                href: "/candidates",
              },
              {
                title: "İş İlanları",
                value: stats?.totalJobPostings || 0,
                icon: Briefcase,
                gradient: "from-green-500 via-emerald-600 to-teal-600",
                href: "/job-postings",
              },
              {
                title: "Mülakatlar",
                value: stats?.totalInterviews || 0,
                icon: Calendar,
                gradient: "from-orange-500 via-amber-600 to-yellow-600",
                href: "/interviews",
              },
              {
                title: "Teklifler",
                value: stats?.totalOffers || 0,
                icon: FileText,
                gradient: "from-pink-500 via-rose-600 to-red-600",
                href: "/offers",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.title}
                  href={stat.href}
                  className={`relative group bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Icon className="w-7 h-7" />
                      </div>
                      <ChevronRight className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-white/90 font-medium">{stat.title}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Performance Metrics - Modern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => {
              const Icon = metric.icon;
              const bgGradient = {
                green: "from-green-50 to-emerald-50",
                blue: "from-blue-50 to-cyan-50",
                purple: "from-purple-50 to-pink-50",
                yellow: "from-yellow-50 to-amber-50",
              }[metric.color];
              const iconColor = {
                green: "text-green-600",
                blue: "text-blue-600",
                purple: "text-purple-600",
                yellow: "text-yellow-600",
              }[metric.color];
              const badgeColor = {
                green: "bg-green-100 text-green-700",
                blue: "bg-blue-100 text-blue-700",
                purple: "bg-purple-100 text-purple-700",
                yellow: "bg-yellow-100 text-yellow-700",
              }[metric.color];

              return (
                <div
                  key={metric.label}
                  className={`bg-gradient-to-br ${bgGradient} rounded-2xl border-2 border-gray-200/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 bg-white rounded-xl shadow-sm ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${badgeColor}`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{metric.label}</div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Analyses */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200/50">
                  <h2 className="text-2xl font-bold text-gray-900">Son Analizler</h2>
                  <p className="text-gray-600 mt-1">En güncel analiz sonuçlarınız</p>
                </div>
                <div className="p-6">
                  {stats?.recentAnalyses && stats.recentAnalyses.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentAnalyses.map((analysis) => (
                        <Link
                          key={analysis.id}
                          href={`/analyses/${analysis.id}`}
                          className="block p-5 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border-2 border-gray-200/50 hover:border-blue-300 hover:shadow-lg transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                                <BarChart3 className="text-blue-600 w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                                  {analysis.jobPosting.title}
                                </h4>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-sm text-gray-600 flex items-center gap-2">
                                    <Clock size={14} />
                                    {new Date(analysis.createdAt).toLocaleDateString("tr-TR")}
                                  </span>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      analysis.status === "COMPLETED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {analysis.status === "COMPLETED" ? "✓ Tamamlandı" : "⏳ İşleniyor"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all w-6 h-6" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-gray-600 mb-6 text-lg">Henüz analiz oluşturmadınız</p>
                      <Link
                        href="/wizard"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                      >
                        <Sparkles size={20} />
                        İlk Analizinizi Oluşturun
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200/50">
                  <h2 className="text-2xl font-bold text-gray-900">Hızlı Eylemler</h2>
                  <p className="text-gray-600 mt-1">Sık kullanılan işlemler</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      const colorClasses = {
                        blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                        green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
                        purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
                        orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
                        pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
                        indigo: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
                      }[action.color];

                      return (
                        <Link
                          key={action.href}
                          href={action.href}
                          className={`relative group bg-gradient-to-br ${colorClasses} rounded-xl p-5 text-white hover:shadow-lg transition-all hover:-translate-y-1`}
                        >
                          <div className="flex flex-col items-center gap-3 text-center">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                              <Icon size={24} />
                            </div>
                            <span className="font-bold text-sm">{action.name}</span>
                            <kbd className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-mono">
                              {action.shortcut}
                            </kbd>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-8">
              {/* Account Status */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border-2 border-green-200/50 overflow-hidden">
                <div className="p-6 bg-white/50 border-b border-green-200/50">
                  <h3 className="text-xl font-bold text-gray-900">Hesap Durumu</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <CheckCircle2 className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Durum</p>
                      <p className="text-lg font-bold text-green-600">Aktif</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Plan</span>
                      <span className="font-bold text-gray-900">{usage?.plan || "FREE"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Rol</span>
                      <span className="font-bold text-gray-900">{user?.role}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Üyelik</span>
                      <span className="font-bold text-gray-900">
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
                    <div className="mt-4 pt-4 border-t border-green-200/50">
                      {usage.warnings.map((warning, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200 text-xs"
                        >
                          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-yellow-800 font-medium">{warning.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl border-2 border-amber-200/50 overflow-hidden">
                <div className="p-6 bg-white/50 border-b border-amber-200/50">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-amber-600" />
                    <h3 className="text-xl font-bold text-gray-900">Başarılar</h3>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-gray-700">İlk Analiz ✓</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-gray-700">10 Aday Eklediniz ✓</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100/50 rounded-xl opacity-50">
                    <Star className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-500">İlk İşe Alım</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Overview (if limited plan) */}
          {usage?.plan !== "ENTERPRISE" && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="p-6 border-b border-gray-200/50">
                <h2 className="text-2xl font-bold text-gray-900">Aylık Kullanım Özeti</h2>
                <p className="text-gray-600 mt-1">Mevcut ay limitlierleriniz</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Analizler</span>
                      <span className="text-sm font-bold text-gray-900">
                        {usage?.monthlyAnalysisCount || 0} / {usage?.maxAnalysisPerMonth || 10}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          (usage?.percentages?.analysis || 0) >= 80
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : "bg-gradient-to-r from-blue-500 to-blue-600"
                        }`}
                        style={{
                          width: `${Math.min(usage?.percentages?.analysis || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">CV'ler</span>
                      <span className="text-sm font-bold text-gray-900">
                        {usage?.monthlyCvCount || 0} / {usage?.maxCvPerMonth || 50}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          (usage?.percentages?.cv || 0) >= 80
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        style={{
                          width: `${Math.min(usage?.percentages?.cv || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">Kullanıcılar</span>
                      <span className="text-sm font-bold text-gray-900">
                        {usage?.totalUsers || 1} / {usage?.maxUsers || 2}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          (usage?.percentages?.user || 0) >= 80
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : "bg-gradient-to-r from-purple-500 to-purple-600"
                        }`}
                        style={{
                          width: `${Math.min(usage?.percentages?.user || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {usage?.plan === "FREE" && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-1">
                        <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                          <Zap className="w-6 h-6" />
                          Sınırsız kullanıma geçin
                        </h4>
                        <p className="text-blue-100">
                          PRO plan ile limitsiz analiz, CV ve kullanıcı ekleyin
                        </p>
                      </div>
                      <Link
                        href="/settings/billing"
                        className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-bold whitespace-nowrap shadow-xl hover:scale-105 duration-300"
                      >
                        Planları İncele
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Navigation - Premium Grid */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900">Ayarlar Bölümleri</h2>
              <p className="text-gray-600 mt-1">Diğer ayar sayfalarına hızlı erişim</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  const gradients = {
                    blue: "from-blue-500 to-blue-600",
                    purple: "from-purple-500 to-purple-600",
                    green: "from-green-500 to-green-600",
                    orange: "from-orange-500 to-orange-600",
                    red: "from-red-500 to-red-600",
                  }[section.color];

                  return (
                    <Link
                      key={section.href}
                      href={section.href}
                      className="group p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200/50 hover:border-gray-300 hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${gradients} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 text-center text-sm">{section.title}</h3>
                      <p className="text-xs text-gray-600 text-center line-clamp-2 mb-2">{section.description}</p>
                      <div className="text-center">
                        <kbd className="inline-block text-xs bg-gray-200/50 px-2.5 py-1 rounded-lg font-mono font-bold text-gray-600">
                          {section.shortcut}
                        </kbd>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {selectedView === "stats" && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">İstatistikler Görünümü</h3>
          <p className="text-gray-600 text-lg">Detaylı istatistikler burada gösterilecek</p>
        </div>
      )}

      {selectedView === "activity" && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <Activity className="w-12 h-12 text-purple-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Aktivite Zaman Çizelgesi</h3>
          <p className="text-gray-600 text-lg">Son aktiviteleriniz burada gösterilecek</p>
        </div>
      )}
    </div>
  );
}
