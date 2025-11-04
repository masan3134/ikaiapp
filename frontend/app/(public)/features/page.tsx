import type { Metadata } from "next";
import Link from "next/link";
import FeatureCard from "@/components/landing/FeatureCard";

export const metadata: Metadata = {
  title: "Özellikler - İKAI HR",
  description:
    "İKAI HR platformunun güçlü özellikleri. AI-powered CV analizi, mülakat yönetimi, teklif sistemi ve daha fazlası.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Güçlü Özellikler
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto">
            İşe alım süreçlerinizi AI ile dönüştüren, hızlandıran ve
            kolaylaştıran kapsamlı özellikler
          </p>
        </div>
      </section>

      {/* AI CV Analysis */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
                AI-Powered
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Yapay Zeka ile CV Analizi
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Gemini 2.0 Flash AI kullanarak 50'ye kadar CV'yi dakikalar
                içinde analiz edin. Manuel inceleme saatlerce sürerken, AI
                asistanımız saniyeler içinde en uygun adayları belirler.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    50 CV'yi dakikalar içinde batch analiz
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Otomatik skor hesaplama (0-100)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Detaylı özet ve öneriler (Türkçe)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Yetenek eşleştirme ve eksik beceri tespiti
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 shadow-xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="font-semibold text-gray-900">
                    CV Analizi
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    25/50 tamamlandı
                  </span>
                </div>
                <div className="space-y-3">
                  {[92, 88, 85].map((score, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
                        <div>
                          <div className="w-24 h-3 bg-gray-200 rounded"></div>
                          <div className="w-16 h-2 bg-gray-100 rounded mt-1"></div>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          score >= 90
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Management */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 shadow-xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="font-semibold text-gray-900">
                    Yaklaşan Mülakatlar
                  </span>
                  <span className="text-sm text-blue-600 font-medium">
                    5 randevu
                  </span>
                </div>
                <div className="space-y-3">
                  {["14:00", "15:30", "16:00"].map((time, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <div className="font-medium text-gray-900">
                            {time}
                          </div>
                          <div className="text-xs text-gray-500">
                            Google Meet
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        Katıl
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Entegrasyon
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Mülakat Yönetimi
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Google Meet entegrasyonu ile kolay randevu planlama. Otomatik
                hatırlatmalar, takvim senkronizasyonu ve tek tıkla katılım
                linkler.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Google Meet otomatik link oluşturma
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Email ile otomatik davetiye gönderimi
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Mülakat notları ve geri bildirim sistemi
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Test oluşturma ve değerlendirme
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Management */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
                Otomasyon
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Teklif Yönetimi
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Profesyonel iş teklifleri oluşturun, email ile gönderin ve
                durumunu takip edin. Adaylar tek tıkla teklifi kabul edebilir.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Özelleştirilebilir teklif şablonları
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Otomatik email gönderimi (BullMQ queue)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Teklif durumu takibi (Gönderildi, Kabul Edildi, Reddedildi)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-600 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Public link ile aday self-service
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 shadow-xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="text-center pb-4 border-b">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    İş Teklifi
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Senior Frontend Developer
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Maaş</span>
                    <span className="font-semibold">₺35,000/ay</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Başlangıç</span>
                    <span className="font-semibold">01.12.2025</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lokasyon</span>
                    <span className="font-semibold">Remote</span>
                  </div>
                  <div className="pt-3 space-y-2">
                    <button className="w-full py-2 bg-green-600 text-white rounded-lg font-medium">
                      Teklifi Kabul Et
                    </button>
                    <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                      İncele
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
              İçgörüler
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gerçek Zamanlı Analitik Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              İşe alım metriklerinizi görselleştirin. Detaylı raporlar ve
              grafiklerle süreçlerinizi optimize edin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              title="İşe Alım Metrikleri"
              description="Toplam aday, analiz, mülakat ve teklif sayıları. Durum bazlı breakdown."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              }
              title="Zaman Serisi Grafikleri"
              description="Haftalık ve aylık trendler. Analiz, mülakat ve teklif grafiği."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              title="Özel Raporlar"
              description="Excel export, filtreleme ve detaylı aday raporları. Custom date range."
            />
          </div>
        </div>
      </section>

      {/* Multi-Tenant & Security */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              Güvenlik & Mimari
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multi-Tenant SaaS Architecture
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Her organizasyon tamamen izole ortamda çalışır. Verileriniz
              güvende, ölçeklenebilir ve hızlı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              title="Row-Level Security"
              description="Her query organizasyon bazlı filtreli. Veri sızıntısı imkansız."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              }
              title="Usage Tracking"
              description="Plan bazlı limitler. Gerçek zamanlı kullanım takibi."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              title="Team Management"
              description="Rol bazlı erişim kontrolü. Admin, Manager, Member."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="High Performance"
              description="Redis cache, BullMQ queues, PostgreSQL. Blazing fast."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Hemen Başlayın
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Ücretsiz hesap oluşturun, tüm özellikleri keşfedin.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </section>
    </div>
  );
}
