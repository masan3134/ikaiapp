import type { Metadata } from 'next';
import Link from 'next/link';
import PricingCard from '@/components/landing/PricingCard';

export const metadata: Metadata = {
  title: 'Fiyatlandırma - İKAI HR',
  description: 'İKAI HR fiyatlandırma planları. İhtiyacınıza uygun planı seçin ve işe alım süreçlerinizi dönüştürün.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fiyatlandırma</h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
            İhtiyacınıza uygun planı seçin. Her zaman değiştirebilir veya iptal edebilirsiniz.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <PricingCard
              plan="FREE"
              price="₺0"
              period="/ay"
              features={[
                '10 analiz/ay',
                '50 CV yükleme/ay',
                '2 kullanıcı',
                'Temel özellikler',
                'Email destek',
                'Mülakat yönetimi',
                'Teklif oluşturma',
              ]}
              ctaText="Ücretsiz Başla"
              ctaLink="/register"
            />
            <PricingCard
              plan="PRO"
              price="₺99"
              period="/ay"
              features={[
                'Sınırsız analiz',
                'Sınırsız CV yükleme',
                '10 kullanıcı',
                'Tüm özellikler',
                'Öncelikli destek',
                'AI Chat Asistanı',
                'Detaylı analitik',
                'Google Meet entegrasyonu',
                'Özel raporlar',
              ]}
              highlighted={true}
              ctaText="PRO'ya Geç"
              ctaLink="/register"
            />
            <PricingCard
              plan="ENTERPRISE"
              price="İletişim"
              features={[
                'Özel limitler',
                'Sınırsız kullanıcı',
                'Özel entegrasyonlar',
                'Dedicated support',
                'SLA garantisi',
                'On-premise seçeneği',
                'Özel AI modeli',
                'API erişimi',
                'Eğitim ve danışmanlık',
              ]}
              ctaText="İletişime Geç"
              ctaLink="mailto:info@gaiai.ai"
            />
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Özellik Karşılaştırması</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Özellik</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">FREE</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-indigo-600 bg-indigo-50">PRO</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">ENTERPRISE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Aylık Analiz Limiti</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">10</td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-indigo-600 bg-indigo-50">Sınırsız</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">Özel</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">CV Yükleme Limiti</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">50/ay</td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-indigo-600 bg-indigo-50">Sınırsız</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">Sınırsız</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Kullanıcı Sayısı</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">2</td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-indigo-600 bg-indigo-50">10</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">Sınırsız</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">AI-Powered CV Analizi</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center bg-indigo-50">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Mülakat Yönetimi</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center bg-indigo-50">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Teklif Yönetimi</td>
                    <td className="px-6 py-4 text-center">✓</td>
                    <td className="px-6 py-4 text-center bg-indigo-50">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Google Meet Entegrasyonu</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center bg-indigo-50">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">AI Chat Asistanı</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center bg-indigo-50">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Detaylı Analitik</td>
                    <td className="px-6 py-4 text-center">Temel</td>
                    <td className="px-6 py-4 text-center bg-indigo-50">Gelişmiş</td>
                    <td className="px-6 py-4 text-center">Özel</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">API Erişimi</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center bg-indigo-50">-</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Özel Entegrasyonlar</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center bg-indigo-50">-</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">SLA Garantisi</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center bg-indigo-50">-</td>
                    <td className="px-6 py-4 text-center">99.9%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Destek</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">Email</td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-indigo-600 bg-indigo-50">Öncelikli</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Sıkça Sorulan Sorular
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ücretsiz plan sınırlamaları nelerdir?
                </h3>
                <p className="text-gray-600 text-sm">
                  Free plan ile ayda 10 analiz ve 50 CV yükleyebilirsiniz. 2 kullanıcı ekleyebilir ve temel özellikleri kullanabilirsiniz.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Planımı dilediğim zaman değiştirebilir miyim?
                </h3>
                <p className="text-gray-600 text-sm">
                  Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklikler anında geçerli olur.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ödeme yöntemleri nelerdir?
                </h3>
                <p className="text-gray-600 text-sm">
                  Kredi kartı, banka kartı ve havale ile ödeme yapabilirsiniz. Enterprise planlar için özel faturalandırma seçenekleri mevcuttur.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Verilerim güvende mi?
                </h3>
                <p className="text-gray-600 text-sm">
                  Tüm verileriniz şifrelenmiş olarak saklanır. Multi-tenant mimarisi ile her organizasyon tamamen izole ortamda çalışır.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hala karar veremediniz mi?
            </h2>
            <p className="text-gray-600 mb-6">
              Ücretsiz planla başlayın, istediğiniz zaman yükseltin.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
