'use client';

import { useEffect } from 'react';
import { Check, X, Zap, TrendingUp, Crown, AlertCircle, Sparkles, BarChart3, Mail } from 'lucide-react';
import { useAsync } from '@/lib/hooks/useAsync';
import { getOrganizationUsage, UsageData } from '@/lib/services/organizationService';
import { Card } from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import Button from '@/components/ui/Button';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';

interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

const planFeatures: PlanFeature[] = [
  { name: 'Aylık Analiz', free: '10', pro: 'Sınırsız', enterprise: 'Sınırsız' },
  { name: 'Aylık CV Yükleme', free: '50', pro: 'Sınırsız', enterprise: 'Sınırsız' },
  { name: 'Kullanıcı Sayısı', free: '2', pro: 'Sınırsız', enterprise: 'Sınırsız' },
  { name: 'AI Analiz', free: true, pro: true, enterprise: true },
  { name: 'Toplu CV Yükleme', free: true, pro: true, enterprise: true },
  { name: 'Mülakat Yönetimi', free: true, pro: true, enterprise: true },
  { name: 'Teklif Yönetimi', free: true, pro: true, enterprise: true },
  { name: 'Öncelikli Destek', free: false, pro: true, enterprise: true },
  { name: 'Özel Entegrasyon', free: false, pro: false, enterprise: true },
  { name: 'Özel Eğitim', free: false, pro: false, enterprise: true }
];

function BillingPage() {
  const { data: usage, loading, error, execute } = useAsync<UsageData>(getOrganizationUsage);

  useEffect(() => {
    execute().catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Usage fetch error:', err);
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
    <div className="space-y-6">
      {/* Current Usage Overview */}
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md">
            <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Aylık Kullanım Durumu</h2>
            <p className="text-sm text-gray-600">Mevcut ay için kullanım istatistikleriniz</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Analyses */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-500 rounded-lg shadow-md">
                <BarChart3 className="text-white" size={20} />
              </div>
              <p className="font-bold text-blue-800">Analizler</p>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-gray-900">{usage.monthlyAnalysisCount}</span>
              <span className="text-xl text-gray-500">/ {usage.maxAnalysisPerMonth}</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3.5 mb-3 shadow-inner">
              <div
                className={`h-3.5 rounded-full transition-all shadow-sm ${
                  usage.percentages.analysis >= 80 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{ width: `${Math.min(usage.percentages.analysis, 100)}%` }}
              />
            </div>
            <p className="text-sm font-medium text-blue-700">
              {usage.percentages.analysis >= 80 ? '⚠️ Limite yaklaşıyorsunuz' : `✓ ${100 - Math.floor(usage.percentages.analysis)}% kalan`}
            </p>
          </div>

          {/* CVs */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-green-500 rounded-lg shadow-md">
                <Sparkles className="text-white" size={20} />
              </div>
              <p className="font-bold text-green-800">CV Yüklemeleri</p>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-gray-900">{usage.monthlyCvCount}</span>
              <span className="text-xl text-gray-500">/ {usage.maxCvPerMonth}</span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-3.5 mb-3 shadow-inner">
              <div
                className={`h-3.5 rounded-full transition-all shadow-sm ${
                  usage.percentages.cv >= 80 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}
                style={{ width: `${Math.min(usage.percentages.cv, 100)}%` }}
              />
            </div>
            <p className="text-sm font-medium text-green-700">
              {usage.percentages.cv >= 80 ? '⚠️ Limite yaklaşıyorsunuz' : `✓ ${100 - Math.floor(usage.percentages.cv)}% kalan`}
            </p>
          </div>

          {/* Users */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-purple-500 rounded-lg shadow-md">
                <Crown className="text-white" size={20} />
              </div>
              <p className="font-bold text-purple-800">Kullanıcılar</p>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-gray-900">{usage.totalUsers}</span>
              <span className="text-xl text-gray-500">/ {usage.maxUsers}</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-3.5 mb-3 shadow-inner">
              <div
                className={`h-3.5 rounded-full transition-all shadow-sm ${
                  usage.percentages.user >= 80 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'
                }`}
                style={{ width: `${Math.min(usage.percentages.user, 100)}%` }}
              />
            </div>
            <p className="text-sm font-medium text-purple-700">
              {usage.percentages.user >= 80 ? '⚠️ Limite yaklaşıyorsunuz' : `✓ ${100 - Math.floor(usage.percentages.user)}% kalan`}
            </p>
          </div>
        </div>

        {/* Upgrade CTA */}
        {usage.plan === 'FREE' && (
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
              <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-50 shadow-lg">
                Planları İncele
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE Plan */}
        <div className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all hover:shadow-xl ${
          usage.plan === 'FREE' ? 'border-blue-400 ring-4 ring-blue-100' : 'border-gray-200'
        }`}>
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
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">10 aylık analiz</span></li>
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">50 aylık CV</span></li>
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">2 kullanıcı</span></li>
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700">Temel özellikler</span></li>
          </ul>
          {usage.plan === 'FREE' ? (
            <div className="text-center py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg text-sm font-bold text-blue-700">
              ✓ Mevcut Plan
            </div>
          ) : (
            <button className="w-full py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all">
              Ücretsiz Başla
            </button>
          )}
        </div>

        {/* PRO Plan */}
        <div className={`bg-white rounded-xl shadow-md border-2 p-6 relative transition-all hover:shadow-xl ${
          usage.plan === 'PRO' ? 'border-blue-400 ring-4 ring-blue-100' : 'border-blue-200'
        }`}>
          <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
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
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700 font-medium">Sınırsız analiz</span></li>
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700 font-medium">Sınırsız CV</span></li>
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700 font-medium">Sınırsız kullanıcı</span></li>
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700 font-medium">Öncelikli destek</span></li>
          </ul>
          {usage.plan === 'PRO' ? (
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

        {/* ENTERPRISE Plan */}
        <div className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all hover:shadow-xl ${
          usage.plan === 'ENTERPRISE' ? 'border-purple-400 ring-4 ring-purple-100' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Crown className="text-purple-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-purple-900">ENTERPRISE</h3>
          </div>
          <div className="mb-6">
            <span className="text-5xl font-bold text-purple-900">Özel</span>
            <p className="text-sm text-purple-600 mt-1">Fiyatlandırma için iletişime geçin</p>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700 font-medium">Tüm PRO özellikleri</span></li>
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700 font-medium">Özel entegrasyon</span></li>
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700 font-medium">Özel eğitim</span></li>
            <li className="flex items-start gap-2"><Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} /><span className="text-sm text-gray-700 font-medium">Özel SLA</span></li>
          </ul>
          {usage.plan === 'ENTERPRISE' ? (
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

      {/* Feature Comparison */}
      <Card title="Plan Karşılaştırması" subtitle="Tüm plan özelliklerini detaylı inceleyin">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-900">Özellik</th>
                <th className="text-center py-4 px-4 text-sm font-bold text-gray-700">FREE</th>
                <th className="text-center py-4 px-4 text-sm font-bold text-blue-700 bg-blue-50">PRO</th>
                <th className="text-center py-4 px-4 text-sm font-bold text-purple-700 bg-purple-50">ENTERPRISE</th>
              </tr>
            </thead>
            <tbody>
              {planFeatures.map((feature, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-gray-700">{feature.name}</td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? <Check className="mx-auto text-green-600" size={20} /> : <X className="mx-auto text-gray-400" size={20} />
                    ) : (
                      <span className="text-sm font-medium text-gray-700">{feature.free}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center bg-blue-50/50">
                    {typeof feature.pro === 'boolean' ? (
                      feature.pro ? <Check className="mx-auto text-green-600" size={20} /> : <X className="mx-auto text-gray-400" size={20} />
                    ) : (
                      <span className="text-sm font-bold text-blue-700">{feature.pro}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center bg-purple-50/50">
                    {typeof feature.enterprise === 'boolean' ? (
                      feature.enterprise ? <Check className="mx-auto text-green-600" size={20} /> : <X className="mx-auto text-gray-400" size={20} />
                    ) : (
                      <span className="text-sm font-bold text-purple-700">{feature.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8 text-center shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Sorularınız mı var?</h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Planlar hakkında daha fazla bilgi almak veya özel bir teklif için bizimle iletişime geçin
        </p>
        <a
          href="mailto:info@gaiai.ai"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-lg hover:shadow-xl"
        >
          <Mail size={20} />
          Bize Ulaşın
        </a>
      </div>
    </div>
  );
}

export default withRoleProtection(BillingPage, {
  allowedRoles: RoleGroups.ADMINS,
  redirectTo: '/dashboard'
});
