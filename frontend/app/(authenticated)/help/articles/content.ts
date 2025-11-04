export interface ArticleContent {
  slug: string;
  title: string;
  category: string;
  lastUpdated: string;
  content: {
    type: "paragraph" | "heading" | "list" | "code" | "alert";
    content?: string;
    items?: string[];
    level?: 2 | 3;
    variant?: "info" | "warning" | "success";
  }[];
}

export const articles: Record<string, ArticleContent> = {
  "platform-kullanimi": {
    slug: "platform-kullanimi",
    title: "Platform Nasıl Kullanılır?",
    category: "Başlangıç Rehberi",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "IKAI HR platformuna hoş geldiniz! Bu rehber, platformu verimli bir şekilde kullanmanız için temel adımları içermektedir.",
      },
      { type: "heading", level: 2, content: "Dashboard'a Erişim" },
      {
        type: "paragraph",
        content:
          "Login olduktan sonra, rolünüze özel dashboard sayfasına yönlendirileceksiniz. Her rol için farklı widget'lar ve özellikler bulunmaktadır.",
      },
      { type: "heading", level: 2, content: "Temel Özellikler" },
      {
        type: "list",
        items: [
          "İlan Yönetimi: Sol menüden 'İlanlar' seçeneğine tıklayarak ilanlarınızı görüntüleyebilir ve yönetebilirsiniz.",
          "CV Analizi: 'Analizler' bölümünden AI destekli CV analizi başlatabilirsiniz.",
          "Aday Takibi: 'Adaylar' sayfasından tüm başvuruları ve durumlarını takip edebilirsiniz.",
          "Mülakat Yönetimi: 'Mülakatlar' sekmesinden görüşmeleri planlayabilir ve yönetebilirsiniz.",
        ],
      },
      { type: "heading", level: 2, content: "Bildirimler" },
      {
        type: "paragraph",
        content:
          "Sağ üst köşedeki zil ikonundan bildirimlerinizi kontrol edebilirsiniz. Önemli güncellemeler ve eylemler için bildirim alırsınız.",
      },
      {
        type: "alert",
        variant: "info",
        content:
          "İpucu: Ayarlar menüsünden bildirim tercihlerinizi özelleştirebilirsiniz.",
      },
    ],
  },
  "ilan-olusturma": {
    slug: "ilan-olusturma",
    title: "İlk İlan Oluşturma",
    category: "Başlangıç Rehberi",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "İlk iş ilanınızı oluşturmak için aşağıdaki adımları takip edin.",
      },
      { type: "heading", level: 2, content: "Adım 1: İlanlar Sayfasına Gidin" },
      {
        type: "paragraph",
        content:
          "Sol menüden 'İlanlar' seçeneğine tıklayın ve sağ üst köşedeki '+ Yeni İlan' butonuna basın.",
      },
      { type: "heading", level: 2, content: "Adım 2: İlan Bilgilerini Doldurun" },
      {
        type: "list",
        items: [
          "Pozisyon adı: İlanın başlığını girin (örn: 'Senior Backend Developer')",
          "Departman: İlanın ait olduğu departmanı seçin",
          "Açıklama: Pozisyonun detaylı açıklamasını girin",
          "Gereksinimler: İstenilen nitelikler, deneyim ve yetenekleri listeleyin",
          "Lokasyon: Çalışma konumunu belirtin",
        ],
      },
      { type: "heading", level: 2, content: "Adım 3: İlanı Yayınlayın" },
      {
        type: "paragraph",
        content:
          "'Taslak Olarak Kaydet' veya 'Yayınla' seçeneklerinden birini seçin. Yayınlanan ilanlar hemen aktif hale gelir.",
      },
      {
        type: "alert",
        variant: "success",
        content:
          "Tebrikler! İlanınız başarıyla oluşturuldu. Artık CV analizi başlatabilirsiniz.",
      },
    ],
  },
  "cv-analizi": {
    slug: "cv-analizi",
    title: "CV Analizi Başlatma",
    category: "Başlangıç Rehberi",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "AI destekli CV analizi ile adayları otomatik olarak değerlendirin ve en uygun adayları bulun.",
      },
      { type: "heading", level: 2, content: "Analiz Sihirbazı" },
      {
        type: "paragraph",
        content:
          "'Analizler' sayfasından 'Yeni Analiz' butonuna tıklayarak analiz sihirbazını başlatın.",
      },
      { type: "heading", level: 2, content: "Adımlar" },
      {
        type: "list",
        items: [
          "Adım 1: İlan seçimi - Analiz yapmak istediğiniz ilanı seçin",
          "Adım 2: CV yükleme - Drag & drop ile CV'leri yükleyin (PDF, DOCX, DOC)",
          "Adım 3: Önizleme - Yüklenen dosyaları kontrol edin",
          "Adım 4: Başlat - Analizi başlatın ve sonuçları bekleyin",
        ],
      },
      { type: "heading", level: 2, content: "Sonuçları Görüntüleme" },
      {
        type: "paragraph",
        content:
          "Analiz tamamlandığında, uyumluluk skorları, güçlü/zayıf yönler ve AI önerileri ile birlikte sonuçları görüntüleyebilirsiniz.",
      },
      {
        type: "alert",
        variant: "info",
        content:
          "Analiz süresi: Toplu analiz için ortalama 25 CV'yi ~70 saniyede analiz ediyoruz (BATCH_SIZE: 6).",
      },
    ],
  },
  "aday-degerlendirme": {
    slug: "aday-degerlendirme",
    title: "Adayları Değerlendirme",
    category: "Başlangıç Rehberi",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "Analiz sonuçlarını kullanarak adayları değerlendirin ve hiring pipeline'ınızı yönetin.",
      },
      { type: "heading", level: 2, content: "Analiz Sonuçları" },
      {
        type: "paragraph",
        content:
          "Her aday için AI tarafından oluşturulan uyumluluk skoru (%0-100) ve detaylı değerlendirme raporu göreceksiniz.",
      },
      { type: "heading", level: 2, content: "Aday İşlemleri" },
      {
        type: "list",
        items: [
          "Mülakat Planlama: Uygun adayları mülakat için davet edin",
          "Notlar Ekleme: Değerlendirme notlarınızı kaydedin",
          "Durum Güncelleme: Adayın durumunu güncelleyin (Başvuru, Eleme, Mülakat, Teklif, Kabul)",
          "Teklif Gönderme: Başarılı adaylara iş teklifi oluşturun",
        ],
      },
      {
        type: "alert",
        variant: "warning",
        content:
          "Önemli: Manager onayı gerektiren işlemler için 'Onaya Gönder' butonunu kullanın.",
      },
    ],
  },
  "dosya-formatlari": {
    slug: "dosya-formatlari",
    title: "Hangi Dosya Formatları Destekleniyor?",
    category: "Sık Sorulan Sorular",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "Platform, CV yükleme ve döküman işlemleri için çeşitli dosya formatlarını desteklemektedir.",
      },
      { type: "heading", level: 2, content: "CV Yükleme" },
      {
        type: "list",
        items: [
          "PDF (.pdf) - Önerilen format",
          "Microsoft Word (.docx, .doc)",
          "Maksimum dosya boyutu: 10 MB",
          "Toplu yükleme: 50 CV'ye kadar (plan limitine göre)",
        ],
      },
      { type: "heading", level: 2, content: "Diğer Dökümanlar" },
      {
        type: "list",
        items: [
          "Teklif mektupları: PDF, DOCX",
          "Test sonuçları: PDF",
          "Mülakat notları: TXT, PDF",
        ],
      },
      {
        type: "alert",
        variant: "info",
        content:
          "AI analizi için PDF formatını kullanmanızı öneriyoruz. Daha iyi OCR ve metin çıkarma sonuçları sağlar.",
      },
    ],
  },
  "analiz-suresi": {
    slug: "analiz-suresi",
    title: "AI Analiz Süresi Ne Kadar?",
    category: "Sık Sorulan Sorular",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "AI analiz süreleri, yüklenen CV sayısına ve sistem yüküne bağlı olarak değişmektedir.",
      },
      { type: "heading", level: 2, content: "Ortalama Süreler" },
      {
        type: "list",
        items: [
          "1-5 CV: ~15-30 saniye",
          "6-25 CV: ~40-80 saniye (BATCH_SIZE: 6 paralel işleme)",
          "50 CV: ~3-4 dakika",
        ],
      },
      { type: "heading", level: 2, content: "Performans Optimizasyonları" },
      {
        type: "paragraph",
        content:
          "Sistemimiz Gemini 2.0 Flash kullanmaktadır ve batch işleme ile hızlı sonuçlar üretmektedir. Queue sistemi sayesinde birden fazla analiz aynı anda işlenebilir.",
      },
      {
        type: "alert",
        variant: "success",
        content:
          "Analiz tamamlandığında email ve uygulama içi bildirim alırsınız.",
      },
    ],
  },
  "ekip-ekleme": {
    slug: "ekip-ekleme",
    title: "Ekip Üyesi Nasıl Eklenir?",
    category: "Sık Sorulan Sorular",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "Organizasyonunuza yeni üyeler eklemek için ADMIN yetkisine sahip olmanız gerekmektedir.",
      },
      { type: "heading", level: 2, content: "Yeni Üye Ekleme Adımları" },
      {
        type: "list",
        items: [
          "Ayarlar > Ekip Yönetimi sayfasına gidin",
          "'+ Yeni Üye Ekle' butonuna tıklayın",
          "Email adresi ve rol bilgilerini girin",
          "Davet gönderin - Üye email ile davetiye alacak",
        ],
      },
      { type: "heading", level: 2, content: "Roller ve Yetkiler" },
      {
        type: "list",
        items: [
          "ADMIN: Tüm yetkilere sahip, organizasyon ayarlarını yönetebilir",
          "MANAGER: Departman yönetimi, onay süreçleri",
          "HR_SPECIALIST: İşe alım süreçleri, CV analizi, mülakatlar",
          "USER: Temel görüntüleme ve raporlama",
        ],
      },
      {
        type: "alert",
        variant: "warning",
        content:
          "Kullanıcı limiti: Plan limitinize göre belirli sayıda kullanıcı ekleyebilirsiniz (FREE: 2, PRO: 10, ENTERPRISE: Sınırsız).",
      },
    ],
  },
  "plan-yukseltme": {
    slug: "plan-yukseltme",
    title: "Plan Nasıl Yükseltilir?",
    category: "Sık Sorulan Sorular",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "Daha fazla özellik ve kapasite için planınızı yükseltebilirsiniz.",
      },
      { type: "heading", level: 2, content: "Mevcut Planlar" },
      {
        type: "list",
        items: [
          "FREE: 10 analiz/ay, 50 CV/ay, 2 kullanıcı - ₺0",
          "PRO: 50 analiz/ay, 200 CV/ay, 10 kullanıcı - ₺99/ay",
          "ENTERPRISE: Sınırsız - İletişim gerekli",
        ],
      },
      { type: "heading", level: 2, content: "Yükseltme Adımları" },
      {
        type: "list",
        items: [
          "Ayarlar > Abonelik & Faturalandırma sayfasına gidin",
          "Planınızı seçin ve 'Yükselt' butonuna tıklayın",
          "Ödeme bilgilerinizi girin",
          "Onaylayın - Plan hemen aktif olur",
        ],
      },
      {
        type: "alert",
        variant: "info",
        content:
          "ENTERPRISE planı için özel fiyatlandırma: info@gaiai.ai adresinden iletişime geçin.",
      },
    ],
  },
  "destek-talebi": {
    slug: "destek-talebi",
    title: "Destek Talebi Oluşturma",
    category: "İletişim",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "Bir sorunla karşılaşırsanız veya yardıma ihtiyacınız olursa destek talebi oluşturabilirsiniz.",
      },
      { type: "heading", level: 2, content: "Destek Kanalları" },
      {
        type: "list",
        items: [
          "Email: support@gaiai.ai (24 saat içinde yanıt)",
          "Canlı Destek: Pazartesi-Cuma 09:00-18:00",
          "Yardım Merkezi: /help sayfasından SSS ve rehberlere ulaşın",
        ],
      },
      { type: "heading", level: 2, content: "İyi Bir Destek Talebi" },
      {
        type: "list",
        items: [
          "Sorunu detaylı açıklayın",
          "Hata mesajlarını ekleyin (varsa)",
          "Adım adım tekrar oluşturma yöntemini yazın",
          "Ekran görüntüleri ekleyin",
        ],
      },
      {
        type: "alert",
        variant: "success",
        content:
          "Ortalama yanıt süresi: Email için 24 saat, canlı destek için anında.",
      },
    ],
  },
  "destek-saatleri": {
    slug: "destek-saatleri",
    title: "Canlı Destek Saatleri",
    category: "İletişim",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "Canlı destek ekibimiz belirli saatlerde hizmet vermektedir.",
      },
      { type: "heading", level: 2, content: "Çalışma Saatleri" },
      {
        type: "list",
        items: [
          "Pazartesi - Cuma: 09:00 - 18:00 (GMT+3)",
          "Cumartesi - Pazar: Kapalı (Email desteği aktif)",
        ],
      },
      { type: "heading", level: 2, content: "Tatil Günleri" },
      {
        type: "paragraph",
        content:
          "Resmi tatil günlerinde canlı destek kapalıdır, ancak email desteği aktiftir (48 saat içinde yanıt).",
      },
      {
        type: "alert",
        variant: "info",
        content:
          "Acil durumlar için ENTERPRISE müşterilerimiz 7/24 öncelikli destek alır.",
      },
    ],
  },
  "email-destek": {
    slug: "email-destek",
    title: "Email Desteği",
    category: "İletişim",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "Email yoluyla destek almak için support@gaiai.ai adresine yazabilirsiniz.",
      },
      { type: "heading", level: 2, content: "Email Gönderirken" },
      {
        type: "list",
        items: [
          "Konu başlığını açıklayıcı yazın",
          "Organizasyon adınızı ve kullanıcı email'inizi belirtin",
          "Sorunu detaylı anlatın",
          "Ekler: Ekran görüntüleri, log dosyaları (varsa)",
        ],
      },
      { type: "heading", level: 2, content: "Yanıt Süreleri" },
      {
        type: "list",
        items: [
          "FREE plan: 48 saat içinde",
          "PRO plan: 24 saat içinde",
          "ENTERPRISE plan: 4 saat içinde (öncelikli)",
        ],
      },
      {
        type: "alert",
        variant: "info",
        content: "Email: support@gaiai.ai",
      },
    ],
  },
  "geri-bildirim": {
    slug: "geri-bildirim",
    title: "Öneri ve Geri Bildirim",
    category: "İletişim",
    lastUpdated: "2025-11-04",
    content: [
      {
        type: "paragraph",
        content:
          "Ürünümüzü geliştirmek için önerileriniz ve geri bildirimleriniz bizim için çok değerli.",
      },
      { type: "heading", level: 2, content: "Geri Bildirim Kanalları" },
      {
        type: "list",
        items: [
          "Email: feedback@gaiai.ai",
          "Özellik İstekleri: roadmap.gaiai.ai (yakında)",
          "Anket: Aylık kullanıcı memnuniyeti anketi",
        ],
      },
      { type: "heading", level: 2, content: "Ne Tür Geri Bildirimler?" },
      {
        type: "list",
        items: [
          "Yeni özellik önerileri",
          "Kullanıcı deneyimi iyileştirmeleri",
          "Hata raporları",
          "Performans geri bildirimleri",
          "Dokümantasyon eksiklikleri",
        ],
      },
      {
        type: "alert",
        variant: "success",
        content:
          "Tüm geri bildirimler product ekibimiz tarafından değerlendirilir ve roadmap'e eklenir.",
      },
    ],
  },
};

export function getArticle(slug: string): ArticleContent | null {
  return articles[slug] || null;
}

export function getAllArticleSlugs(): string[] {
  return Object.keys(articles);
}
