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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header PREMIUM */}
        <div className="mb-4 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          <div className="relative text-center">
            <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              Yardım Merkezi
            </h1>
            <p className="text-white/90 text-sm font-medium">
              Size nasıl yardımcı olabiliriz?
            </p>
          </div>
        </div>

        {/* Search PREMIUM */}
        <div className="mb-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input
              type="text"
              placeholder="Arama yapın..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all hover:shadow-xl"
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

        {/* Categories PREMIUM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {(searchQuery ? filteredCategories : helpCategories).map(
            (category, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                    idx === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    idx === 1 ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                    'bg-gradient-to-br from-green-500 to-green-600'
                  }`}>
                    <div className="text-white">
                      {idx === 0 && <Book className="w-5 h-5" />}
                      {idx === 1 && <HelpCircle className="w-5 h-5" />}
                      {idx === 2 && <MessageCircle className="w-5 h-5" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3 font-medium">
                  {category.description}
                </p>
                <ul className="space-y-1.5">
                  {category.articles.map((article, articleIdx) => (
                    <li key={articleIdx}>
                      <a
                        href={article.link}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
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
          <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 mb-4">
            <HelpCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-4 font-medium">Aradığınız konu bulunamadı.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 hover:text-blue-700 font-bold px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
            >
              Tüm konuları göster
            </button>
          </div>
        )}

        {/* Contact Cards PREMIUM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-2xl p-4 border border-blue-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                Email Desteği
              </h3>
              <p className="text-xs text-white/90 mb-3 font-medium">
                support@gaiai.ai adresinden bize ulaşabilirsiniz. Ortalama yanıt
                süresi: 24 saat
              </p>
              <a
                href="mailto:support@gaiai.ai"
                className="inline-flex items-center gap-1.5 text-xs text-white hover:text-white/90 font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all shadow-md"
              >
                Email Gönder <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl p-4 border border-green-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                Canlı Destek
              </h3>
              <p className="text-xs text-white/90 mb-3 font-medium">
                Pazartesi - Cuma, 09:00 - 18:00 Anlık destek için canlı sohbet
                başlatın
              </p>
              <button
                onClick={handleChatStart}
                className="inline-flex items-center gap-1.5 text-xs text-white hover:text-white/90 font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all shadow-md"
              >
                Sohbet Başlat <MessageCircle className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer PREMIUM */}
        <div className="mt-4 text-center">
          <div className="bg-white/60 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-gray-200/50">
            <p className="text-sm text-gray-700 font-medium">
              Aradığınızı bulamadınız mı?{" "}
              <a
                href="mailto:support@gaiai.ai"
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors"
              >
                Bize yazın
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
