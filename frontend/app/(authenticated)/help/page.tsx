'use client';

import { HelpCircle, Book, MessageCircle, Mail, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const helpCategories = [
    {
      title: 'Başlangıç Rehberi',
      description: 'Platforma ilk adımlarınızı atmak için',
      icon: <Book className="w-6 h-6 text-blue-600" />,
      articles: [
        'Platform Nasıl Kullanılır?',
        'İlk İlan Oluşturma',
        'CV Analizi Başlatma',
        'Adayları Değerlendirme'
      ]
    },
    {
      title: 'Sık Sorulan Sorular',
      description: 'En çok merak edilen konular',
      icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
      articles: [
        'Hangi dosya formatları destekleniyor?',
        'AI analiz süresi ne kadar?',
        'Ekip üyesi nasıl eklenir?',
        'Plan nasıl yükseltilir?'
      ]
    },
    {
      title: 'İletişim',
      description: 'Destek ekibimizle iletişime geçin',
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      articles: [
        'Destek talebi oluşturma',
        'Canlı destek saatleri',
        'Email desteği',
        'Öneri ve geri bildirim'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3 mb-3">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            Yardım Merkezi
          </h1>
          <p className="text-slate-600 text-lg">
            Size nasıl yardımcı olabiliriz?
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Arama yapın..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {helpCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {category.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                {category.description}
              </p>
              <ul className="space-y-2">
                {category.articles.map((article, articleIdx) => (
                  <li key={articleIdx}>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
            <Mail className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Email Desteği
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              support@gaiai.ai adresinden bize ulaşabilirsiniz.
              Ortalama yanıt süresi: 24 saat
            </p>
            <a
              href="mailto:support@gaiai.ai"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Email Gönder <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
            <MessageCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Canlı Destek
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Pazartesi - Cuma, 09:00 - 18:00
              Anlık destek için canlı sohbet başlatın
            </p>
            <button className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium">
              Sohbet Başlat <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Aradığınızı bulamadınız mı?{' '}
            <a href="mailto:support@gaiai.ai" className="text-blue-600 hover:underline">
              Bize yazın
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
