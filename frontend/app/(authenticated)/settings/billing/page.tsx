'use client';

import { useEffect } from 'react';
import { Check, X, Zap, TrendingUp, Crown, AlertCircle } from 'lucide-react';
import { useAsync } from '@/lib/hooks/useAsync';
import { getOrganizationUsage, UsageData } from '@/lib/services/organizationService';
import { Card } from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
import { RoleGroups } from '@/lib/constants/roles';

interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

const planFeatures: PlanFeature[] = [
  {
    name: 'Aylık Analiz',
    free: '10',
    pro: 'Sınırsız',
    enterprise: 'Sınırsız'
  },
  {
    name: 'Aylık CV Yükleme',
    free: '50',
    pro: 'Sınırsız',
    enterprise: 'Sınırsız'
  },
  {
    name: 'Kullanıcı Sayısı',
    free: '2',
    pro: 'Sınırsız',
    enterprise: 'Sınırsız'
  },
  {
    name: 'AI Analiz',
    free: true,
    pro: true,
    enterprise: true
  },
  {
    name: 'Toplu CV Yükleme',
    free: true,
    pro: true,
    enterprise: true
  },
  {
    name: 'Mülakat Yönetimi',
    free: true,
    pro: true,
    enterprise: true
  },
  {
    name: 'Teklif Yönetimi',
    free: true,
    pro: true,
    enterprise: true
  },
  {
    name: 'Öncelikli Destek',
    free: false,
    pro: true,
    enterprise: true
  },
  {
    name: 'Özel Entegrasyon',
    free: false,
    pro: false,
    enterprise: true
  },
  {
    name: 'Özel Eğitim',
    free: false,
    pro: false,
    enterprise: true
  }
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Faturalandırma ve Planlar</h1>
        <LoadingSkeleton variant="grid" rows={2} columns={3} />
      </div>
    );
  }

  if (error || !usage) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Faturalandırma ve Planlar</h1>
        <Card>
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-sm text-gray-600 mb-4">Bilgiler yüklenemedi</p>
            <button
              onClick={() => execute()}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Tekrar Dene
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Faturalandırma ve Planlar</h1>
        <p className="text-gray-600 mt-1">Planınızı yönetin ve kullanım detaylarınızı görüntüleyin</p>
      </div>

      {/* Current Plan */}
      <Card title="Mevcut Planınız" className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${
              usage.plan === 'FREE' ? 'bg-gray-100' :
              usage.plan === 'PRO' ? 'bg-blue-100' : 'bg-purple-100'
            }`}>
              {usage.plan === 'FREE' && <Zap className="text-gray-600" size={24} />}
              {usage.plan === 'PRO' && <TrendingUp className="text-blue-600" size={24} />}
              {usage.plan === 'ENTERPRISE' && <Crown className="text-purple-600" size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{usage.plan} Plan</h3>
              <p className="text-sm text-gray-600">
                {usage.plan === 'FREE' && 'Ücretsiz plan - Temel özellikler'}
                {usage.plan === 'PRO' && 'Profesyonel plan - Sınırsız kullanım'}
                {usage.plan === 'ENTERPRISE' && 'Kurumsal plan - Tam özellikler'}
              </p>
            </div>
          </div>
          {usage.plan === 'FREE' && (
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              PRO'ya Yükselt
            </button>
          )}
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Aylık Analiz</p>
            <p className="text-2xl font-bold text-gray-900">
              {usage.monthlyAnalysisCount} / {usage.maxAnalysisPerMonth}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(usage.percentages.analysis, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Aylık CV</p>
            <p className="text-2xl font-bold text-gray-900">
              {usage.monthlyCvCount} / {usage.maxCvPerMonth}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${Math.min(usage.percentages.cv, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Kullanıcılar</p>
            <p className="text-2xl font-bold text-gray-900">
              {usage.totalUsers} / {usage.maxUsers}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${Math.min(usage.percentages.user, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Plan Comparison */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Karşılaştırması</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FREE Plan */}
          <div className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
            usage.plan === 'FREE' ? 'border-blue-500' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-gray-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">FREE</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">₺0</span>
              <span className="text-gray-600">/ay</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">10 aylık analiz</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">50 aylık CV</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">2 kullanıcı</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">Temel özellikler</span>
              </li>
            </ul>
            {usage.plan === 'FREE' ? (
              <div className="text-center py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                Mevcut Plan
              </div>
            ) : (
              <button className="w-full py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Ücretsiz Başla
              </button>
            )}
          </div>

          {/* PRO Plan */}
          <div className={`bg-white rounded-lg shadow-sm border-2 p-6 relative ${
            usage.plan === 'PRO' ? 'border-blue-500' : 'border-blue-200'
          }`}>
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              ÖNERİLEN
            </div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">PRO</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">₺499</span>
              <span className="text-gray-600">/ay</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">Sınırsız analiz</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">Sınırsız CV</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">Sınırsız kullanıcı</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">Öncelikli destek</span>
              </li>
            </ul>
            {usage.plan === 'PRO' ? (
              <div className="text-center py-2 bg-blue-100 rounded-lg text-sm font-medium text-blue-700">
                Mevcut Plan
              </div>
            ) : (
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                PRO'ya Yükselt
              </button>
            )}
          </div>

          {/* ENTERPRISE Plan */}
          <div className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
            usage.plan === 'ENTERPRISE' ? 'border-purple-500' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="text-purple-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">ENTERPRISE</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">Özel</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">Tüm PRO özellikleri</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">Özel entegrasyon</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">Özel eğitim</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-gray-700">Özel SLA</span>
              </li>
            </ul>
            {usage.plan === 'ENTERPRISE' ? (
              <div className="text-center py-2 bg-purple-100 rounded-lg text-sm font-medium text-purple-700">
                Mevcut Plan
              </div>
            ) : (
              <button className="w-full py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                İletişime Geç
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <Card title="Detaylı Özellik Karşılaştırması">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Özellik</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">FREE</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-blue-900">PRO</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-purple-900">ENTERPRISE</th>
              </tr>
            </thead>
            <tbody>
              {planFeatures.map((feature, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">{feature.name}</td>
                  <td className="py-3 px-4 text-center">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? (
                        <Check className="mx-auto text-green-600" size={18} />
                      ) : (
                        <X className="mx-auto text-gray-400" size={18} />
                      )
                    ) : (
                      <span className="text-sm text-gray-700">{feature.free}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof feature.pro === 'boolean' ? (
                      feature.pro ? (
                        <Check className="mx-auto text-green-600" size={18} />
                      ) : (
                        <X className="mx-auto text-gray-400" size={18} />
                      )
                    ) : (
                      <span className="text-sm font-medium text-blue-700">{feature.pro}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof feature.enterprise === 'boolean' ? (
                      feature.enterprise ? (
                        <Check className="mx-auto text-green-600" size={18} />
                      ) : (
                        <X className="mx-auto text-gray-400" size={18} />
                      )
                    ) : (
                      <span className="text-sm font-medium text-purple-700">{feature.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Contact CTA */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Sorularınız mı var?</h3>
        <p className="text-gray-600 mb-6">
          Planlar hakkında daha fazla bilgi almak veya özel bir teklif için bizimle iletişime geçin
        </p>
        <a
          href="mailto:info@gaiai.ai"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
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
