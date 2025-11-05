"use client";

import { useEffect } from "react";
import {
  Check,
  X,
  Zap,
  TrendingUp,
  Crown,
  AlertCircle,
  Sparkles,
  BarChart3,
  Mail,
} from "lucide-react";
import { useAsync } from "@/lib/hooks/useAsync";
import {
  getOrganizationUsage,
  UsageData,
} from "@/lib/services/organizationService";
import { Card } from "@/components/ui/Card";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Button from "@/components/ui/Button";
import { withRoleProtection } from "@/lib/hoc/withRoleProtection";
import { RoleGroups } from "@/lib/constants/roles";

interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

const planFeatures: PlanFeature[] = [
  { name: "Aylık Analiz", free: "10", pro: "Sınırsız", enterprise: "Sınırsız" },
  {
    name: "Aylık CV Yükleme",
    free: "50",
    pro: "Sınırsız",
    enterprise: "Sınırsız",
  },
  {
    name: "Kullanıcı Sayısı",
    free: "2",
    pro: "Sınırsız",
    enterprise: "Sınırsız",
  },
  { name: "AI Analiz", free: true, pro: true, enterprise: true },
  { name: "Toplu CV Yükleme", free: true, pro: true, enterprise: true },
  { name: "Mülakat Yönetimi", free: true, pro: true, enterprise: true },
  { name: "Teklif Yönetimi", free: true, pro: true, enterprise: true },
  { name: "Öncelikli Destek", free: false, pro: true, enterprise: true },
  { name: "Özel Entegrasyon", free: false, pro: false, enterprise: true },
  { name: "Özel Eğitim", free: false, pro: false, enterprise: true },
];

function BillingPage() {
  const {
    data: usage,
    loading,
    error,
    execute,
  } = useAsync<UsageData>(getOrganizationUsage);

  useEffect(() => {
    execute().catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Usage fetch error:", err);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="grid" rows={2} columns={3} />
      </div>
    );
  }

  if (error || !usage) {
    return (
      <Card>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-16 w-16 text-orange-500 mb-4" />
          <p className="text-gray-600 mb-4">Bilgiler yüklenemedi</p>
          <Button onClick={() => execute()} variant="secondary">
            Tekrar Dene
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Usage Overview - GLASSMORPHISM COMPACT */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-4">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Aylık Kullanım Durumu
            </h2>
            <p className="text-xs text-gray-600 font-medium">
              Mevcut ay için kullanım istatistikleriniz
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Analyses - ENHANCED */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <BarChart3 className="text-white" size={22} />
              </div>
              <p className="font-bold text-blue-900 text-lg">Analizler</p>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-gray-900">
                {usage.monthlyAnalysisCount}
              </span>
              <span className="text-xl text-gray-500">
                / {usage.maxAnalysisPerMonth}
              </span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3.5 mb-3 shadow-inner">
              <div
                className={`h-3.5 rounded-full transition-all shadow-sm ${
                  usage.percentages.analysis >= 80
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
                style={{
                  width: `${Math.min(usage.percentages.analysis, 100)}%`,
                }}
              />
            </div>
            <p className="text-sm font-medium text-blue-700">
              {usage.percentages.analysis >= 80
                ? "⚠️ Limite yaklaşıyorsunuz"
                : `✓ ${100 - Math.floor(usage.percentages.analysis)}% kalan`}
            </p>
          </div>

          {/* CVs - ENHANCED */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Sparkles className="text-white" size={22} />
              </div>
              <p className="font-bold text-green-900 text-lg">CV Yüklemeleri</p>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-gray-900">
                {usage.monthlyCvCount}
              </span>
              <span className="text-xl text-gray-500">
                / {usage.maxCvPerMonth}
              </span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-3.5 mb-3 shadow-inner">
              <div
                className={`h-3.5 rounded-full transition-all shadow-sm ${
                  usage.percentages.cv >= 80
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-gradient-to-r from-green-500 to-green-600"
                }`}
                style={{ width: `${Math.min(usage.percentages.cv, 100)}%` }}
              />
            </div>
            <p className="text-sm font-medium text-green-700">
              {usage.percentages.cv >= 80
                ? "⚠️ Limite yaklaşıyorsunuz"
                : `✓ ${100 - Math.floor(usage.percentages.cv)}% kalan`}
            </p>
          </div>

          {/* Users - ENHANCED */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Crown className="text-white" size={22} />
              </div>
              <p className="font-bold text-purple-900 text-lg">Kullanıcılar</p>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-gray-900">
                {usage.totalUsers}
              </span>
              <span className="text-xl text-gray-500">/ {usage.maxUsers}</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-3.5 mb-3 shadow-inner">
              <div
                className={`h-3.5 rounded-full transition-all shadow-sm ${
                  usage.percentages.user >= 80
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-gradient-to-r from-purple-500 to-purple-600"
                }`}
                style={{ width: `${Math.min(usage.percentages.user, 100)}%` }}
              />
            </div>
            <p className="text-sm font-medium text-purple-700">
              {usage.percentages.user >= 80
                ? "⚠️ Limite yaklaşıyorsunuz"
                : `✓ ${100 - Math.floor(usage.percentages.user)}% kalan`}
            </p>
          </div>
        </div>

        {/* Upgrade CTA */}
        {usage.plan === "FREE" && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Crown size={24} />
                  Sınırsız Kullanıma Geçin
                </h3>
                <p className="text-blue-50">
                  PRO plan ile limitsiz analiz, CV ve kullanıcı. Sadece ₺499/ay
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-50 shadow-lg"
              >
                Planları İncele
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Plan Cards - PREMIUM COMPACT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* FREE Plan */}
        <div
          className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border-2 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
            usage.plan === "FREE"
              ? "border-blue-500 ring-4 ring-blue-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Zap className="text-gray-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">FREE</h3>
          </div>
          <div className="mb-6">
            <span className="text-5xl font-bold text-gray-900">₺0</span>
            <span className="text-gray-600 text-lg">/ay</span>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700">10 aylık analiz</span>
            </li>
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700">50 aylık CV</span>
            </li>
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700">2 kullanıcı</span>
            </li>
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700">Temel özellikler</span>
            </li>
          </ul>
          {usage.plan === "FREE" ? (
            <div className="text-center py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg text-sm font-bold text-blue-700">
              ✓ Mevcut Plan
            </div>
          ) : (
            <button className="w-full py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all">
              Ücretsiz Başla
            </button>
          )}
        </div>

        {/* PRO Plan - PREMIUM */}
        <div
          className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border-2 p-8 relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
            usage.plan === "PRO"
              ? "border-blue-500 ring-4 ring-blue-100"
              : "border-blue-300"
          }`}
        >
          <div className="absolute -top-4 right-6 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white text-sm font-bold px-5 py-2 rounded-full shadow-xl">
            ⭐ ÖNERİLEN
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-blue-900">PRO</h3>
          </div>
          <div className="mb-6">
            <span className="text-5xl font-bold text-blue-900">₺499</span>
            <span className="text-blue-600 text-lg">/ay</span>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700 font-medium">
                Sınırsız analiz
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700 font-medium">
                Sınırsız CV
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700 font-medium">
                Sınırsız kullanıcı
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700 font-medium">
                Öncelikli destek
              </span>
            </li>
          </ul>
          {usage.plan === "PRO" ? (
            <div className="text-center py-3 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-lg text-sm font-bold text-blue-700">
              ✓ Mevcut Plan
            </div>
          ) : (
            <Button className="w-full" size="lg">
              <Crown size={18} />
              PRO'ya Yükselt
            </Button>
          )}
        </div>

        {/* ENTERPRISE Plan - PREMIUM */}
        <div
          className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border-2 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
            usage.plan === "ENTERPRISE"
              ? "border-purple-500 ring-4 ring-purple-100"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Crown className="text-purple-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-purple-900">ENTERPRISE</h3>
          </div>
          <div className="mb-6">
            <span className="text-5xl font-bold text-purple-900">Özel</span>
            <p className="text-sm text-purple-600 mt-1">
              Fiyatlandırma için iletişime geçin
            </p>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700 font-medium">
                Tüm PRO özellikleri
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700 font-medium">
                Özel entegrasyon
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700 font-medium">
                Özel eğitim
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={18}
              />
              <span className="text-sm text-gray-700 font-medium">
                Özel SLA
              </span>
            </li>
          </ul>
          {usage.plan === "ENTERPRISE" ? (
            <div className="text-center py-3 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg text-sm font-bold text-purple-700">
              ✓ Mevcut Plan
            </div>
          ) : (
            <button className="w-full py-3 border-2 border-purple-500 text-purple-700 rounded-lg font-bold hover:bg-purple-50 hover:border-purple-600 transition-all">
              İletişime Geç
            </button>
          )}
        </div>
      </div>

      {/* Feature Comparison - GLASSMORPHISM COMPACT */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Plan Karşılaştırması</h2>
          <p className="text-xs text-gray-600 font-medium mt-1">Tüm plan özelliklerini detaylı inceleyin</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border-2 border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-900">
                  Özellik
                </th>
                <th className="text-center py-4 px-4 text-sm font-bold text-gray-700">
                  FREE
                </th>
                <th className="text-center py-4 px-4 text-sm font-bold text-blue-700 bg-blue-50">
                  PRO
                </th>
                <th className="text-center py-4 px-4 text-sm font-bold text-purple-700 bg-purple-50">
                  ENTERPRISE
                </th>
              </tr>
            </thead>
            <tbody>
              {planFeatures.map((feature, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm font-medium text-gray-700">
                    {feature.name}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.free === "boolean" ? (
                      feature.free ? (
                        <Check className="mx-auto text-green-600" size={20} />
                      ) : (
                        <X className="mx-auto text-gray-400" size={20} />
                      )
                    ) : (
                      <span className="text-sm font-medium text-gray-700">
                        {feature.free}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center bg-blue-50/50">
                    {typeof feature.pro === "boolean" ? (
                      feature.pro ? (
                        <Check className="mx-auto text-green-600" size={20} />
                      ) : (
                        <X className="mx-auto text-gray-400" size={20} />
                      )
                    ) : (
                      <span className="text-sm font-bold text-blue-700">
                        {feature.pro}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center bg-purple-50/50">
                    {typeof feature.enterprise === "boolean" ? (
                      feature.enterprise ? (
                        <Check className="mx-auto text-green-600" size={20} />
                      ) : (
                        <X className="mx-auto text-gray-400" size={20} />
                      )
                    ) : (
                      <span className="text-sm font-bold text-purple-700">
                        {feature.enterprise}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact CTA - ULTRA MODERN */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

        <div className="relative p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Sorularınız mı var?
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Planlar hakkında daha fazla bilgi almak veya özel bir teklif için
            bizimle iletişime geçin
          </p>
          <a
            href="mailto:info@gaiai.ai"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 rounded-2xl hover:bg-gray-50 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 duration-300"
          >
            <Mail size={24} />
            Bize Ulaşın
          </a>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(BillingPage, {
  allowedRoles: RoleGroups.ADMINS,
  redirectTo: "/dashboard",
});
