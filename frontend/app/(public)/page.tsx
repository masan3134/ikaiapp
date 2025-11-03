'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FeatureCard from '@/components/landing/FeatureCard';
import PricingCard from '@/components/landing/PricingCard';

export default function LandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and redirect to dashboard
      fetch('http://localhost:8102/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true);
            router.push('/dashboard');
          } else {
            setCheckingAuth(false);
          }
        })
        .catch(() => {
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                İşe Alım Süreçlerinizi{' '}
                <span className="text-indigo-600">Yapay Zeka</span> ile Dönüştürün
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                CV analizi, mülakat yönetimi ve teklif süreçlerini tek platformda yönetin.
                AI destekli, kullanımı kolay, sonuç odaklı.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  Ücretsiz Başla
                </Link>
                <a
                  href="https://gaiai.ai/ik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-indigo-600 text-lg font-semibold rounded-lg border-2 border-indigo-600 transition-all duration-300 text-center"
                >
                  Demo İzle
                </a>
              </div>
            </div>

            {/* Right: Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                        <div className="w-16 h-2 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-gray-100 rounded"></div>
                    <div className="w-5/6 h-2 bg-gray-100 rounded"></div>
                    <div className="w-4/6 h-2 bg-gray-100 rounded"></div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <div className="flex-1 h-8 bg-indigo-50 rounded"></div>
                    <div className="flex-1 h-8 bg-indigo-50 rounded"></div>
                  </div>
                </div>
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="text-2xl font-bold text-indigo-600">50+</div>
                <div className="text-xs text-gray-600">CV Analizi/Gün</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-xs text-gray-600">Doğruluk Oranı</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Güçlü Özellikler
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              İşe alım süreçlerinizi hızlandıran ve kolaylaştıran özelliklerle donatılmış platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="AI-Powered CV Analizi"
              description="50 CV'yi dakikalar içinde analiz edin. Gemini AI ile doğru adayları hızlıca belirleyin."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Mülakat Yönetimi"
              description="Google Meet entegrasyonu ile kolay randevu planlama. Otomatik hatırlatmalar ve takip."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Teklif Yönetimi"
              description="Teklif oluştur, gönder ve takip et. E-posta entegrasyonu ile otomatik gönderim."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Analitik Dashboard"
              description="Gerçek zamanlı işe alım metrikleri. Detaylı raporlar ve görselleştirme."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              title="Multi-Tenant SaaS"
              description="Her organizasyon izole ortamda. Güvenli ve ölçeklenebilir yapı."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              }
              title="AI Chat Asistanı"
              description="Analiz sonuçları hakkında soru sorun. Milvus vector DB ile semantic arama."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Basit ve Şeffaf Fiyatlandırma
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun planı seçin. Dilediğiniz zaman değiştirebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
              ]}
              ctaText="İletişime Geç"
              ctaLink="mailto:info@gaiai.ai"
            />
          </div>

          <div className="text-center mt-12">
            <Link
              href="/pricing"
              className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center"
            >
              Detaylı fiyatlandırma tablosunu görüntüle
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bugün Başlayın
          </h2>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            İşe alım süreçlerinizi AI ile dönüştürün. Ücretsiz hesap oluşturun, hemen kullanmaya başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Ücretsiz Hesap Oluştur
            </Link>
            <a
              href="mailto:info@gaiai.ai"
              className="px-8 py-4 bg-transparent hover:bg-white/10 text-white text-lg font-semibold rounded-lg border-2 border-white transition-all duration-300"
            >
              Satış Ekibiyle İletişime Geç
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
