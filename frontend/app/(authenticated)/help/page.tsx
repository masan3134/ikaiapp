"use client";

import { useState } from "react";
import {
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  ExternalLink,
  Search,
} from "lucide-react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const helpCategories = [
    {
      title: "Başlangıç Rehberi",
      description: "Platforma ilk adımlarınızı atmak için",
      icon: <Book className="w-6 h-6 text-blue-600" />,
      articles: [
        {
          title: "Platform Nasıl Kullanılır?",
          link: "/help/articles/platform-kullanimi",
        },
        { title: "İlk İlan Oluşturma", link: "/help/articles/ilan-olusturma" },
        { title: "CV Analizi Başlatma", link: "/help/articles/cv-analizi" },
        {
          title: "Adayları Değerlendirme",
          link: "/help/articles/aday-degerlendirme",
        },
      ],
    },
    {
      title: "Sık Sorulan Sorular",
      description: "En çok merak edilen konular",
      icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
      articles: [
        {
          title: "Hangi dosya formatları destekleniyor?",
          link: "/help/articles/dosya-formatlari",
        },
        {
          title: "AI analiz süresi ne kadar?",
          link: "/help/articles/analiz-suresi",
        },
        {
          title: "Ekip üyesi nasıl eklenir?",
          link: "/help/articles/ekip-ekleme",
        },
        {
          title: "Plan nasıl yükseltilir?",
          link: "/help/articles/plan-yukseltme",
        },
      ],
    },
    {
      title: "İletişim",
      description: "Destek ekibimizle iletişime geçin",
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      articles: [
        {
          title: "Destek talebi oluşturma",
          link: "/help/articles/destek-talebi",
        },
        {
          title: "Canlı destek saatleri",
          link: "/help/articles/destek-saatleri",
        },
        { title: "Email desteği", link: "/help/articles/email-destek" },
        {
          title: "Öneri ve geri bildirim",
          link: "/help/articles/geri-bildirim",
        },
      ],
    },
  ];

  // Filter articles based on search
  const filteredCategories = helpCategories
    .map((cat) => ({
      ...cat,
      articles: cat.articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.articles.length > 0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleChatStart = () => {
    setChatOpen(true);
    // In real implementation, this would open a chat widget
    alert(
      "Canlı destek başlatılıyor...\n\nGerçek uygulamada burada bir chat widget açılacak (örn: Intercom, Zendesk)."
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header COMPACT */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            Yardım Merkezi
          </h1>
          <p className="text-slate-600 text-sm">
            Size nasıl yardımcı olabiliriz?
          </p>
        </div>

        {/* Search COMPACT */}
        <div className="mb-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Arama yapın..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          {searchQuery && (
            <p className="text-center mt-2 text-sm text-slate-600">
              "{searchQuery}" için{" "}
              {filteredCategories.reduce(
                (sum, cat) => sum + cat.articles.length,
                0
              )}{" "}
              sonuç bulundu
            </p>
          )}
        </div>

        {/* Categories COMPACT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {(searchQuery ? filteredCategories : helpCategories).map(
            (category, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">
                      {category.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  {category.description}
                </p>
                <ul className="space-y-1.5">
                  {category.articles.map((article, articleIdx) => (
                    <li key={articleIdx}>
                      <a
                        href={article.link}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {article.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Aradığınız konu bulunamadı.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Tüm konuları göster
            </button>
          </div>
        )}

        {/* Contact Cards COMPACT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
            <Mail className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="text-base font-semibold text-slate-800 mb-1.5">
              Email Desteği
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              support@gaiai.ai adresinden bize ulaşabilirsiniz. Ortalama yanıt
              süresi: 24 saat
            </p>
            <a
              href="mailto:support@gaiai.ai"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Email Gönder <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100">
            <MessageCircle className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="text-base font-semibold text-slate-800 mb-1.5">
              Canlı Destek
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Pazartesi - Cuma, 09:00 - 18:00 Anlık destek için canlı sohbet
              başlatın
            </p>
            <button
              onClick={handleChatStart}
              className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Sohbet Başlat <MessageCircle className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer COMPACT */}
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-500">
            Aradığınızı bulamadınız mı?{" "}
            <a
              href="mailto:support@gaiai.ai"
              className="text-blue-600 hover:underline"
            >
              Bize yazın
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
