# Teklif Mektubu Sistemi - Özellik Karşılaştırması

**Date:** 2025-10-29
**Status:** Decision Pending

---

## 📋 TÜM ÖZELLİKLER LİSTESİ

### ✅ Seçenek 1: Temel Özellikler (3-5 gün)

#### 1. Teklif Oluşturma
**Teknik:** Candidate ve JobPosting ilişkilendirmeli form + validation + Prisma create
**Basit:** Adayı seç, pozisyon/maaş/başlangıç tarihi yaz, kaydet butonuna bas.

#### 2. PDF Oluşturma
**Teknik:** PDFKit ile HTML template render, buffer oluştur, MinIO'ya upload
**Basit:** Yazdığın bilgiler otomatik olarak profesyonel PDF dokümanına dönüşür.

#### 3. Email Gönderimi
**Teknik:** Nodemailer SMTP + Gmail, PDF attachment, HTML email template
**Basit:** Adaya otomatik email gider, ekte PDF teklif mektubu var.

#### 4. Durum Takibi (Status Tracking)
**Teknik:** Database'de status field (draft/sent/accepted/rejected), PATCH endpoint
**Basit:** Gönderildi mi, kabul edildi mi, reddedildi mi takip edebilirsin.

#### 5. Teklif Listeleme
**Teknik:** Pagination + filtering + sorting ile GET endpoint, frontend table component
**Basit:** Oluşturduğun tüm teklifleri liste halinde görebilirsin.

#### 6. Teklif Detay Görüntüleme
**Teknik:** Single resource GET endpoint, tüm relations include (candidate, jobPosting)
**Basit:** Bir teklifi tıklayınca tüm detaylarını görebilirsin.

---

### ✅ Seçenek 2: Ek Özellikler (7-10 gün)

*Seçenek 1'deki tüm özellikler + aşağıdakiler:*

#### 7. Teklif Şablonları (Templates)
**Teknik:** OfferTemplate modeli, JSON benefits field, template-to-offer copy logic
**Basit:** "Yazılımcı Teklifi" gibi hazır şablonlar yarat, hep aynı şeyleri yazma.

#### 8. Pozisyon Bazlı Otomatik Doldurma
**Teknik:** Template selection trigger, pre-fill form fields with template defaults
**Basit:** "Senior Developer" seçince maaş/yan haklar otomatik dolar.

#### 9. Kabul/Red Linki (Acceptance URL)
**Teknik:** Unique token generation (UUID), public route, token validation middleware
**Basit:** Aday emaildeki butona tıklayıp "Kabul Ediyorum" diyebilir.

#### 10. Email + SMS Bildirimi
**Teknik:** Parallel notification queue (BullMQ), SMS API integration, retry logic
**Basit:** Hem email hem SMS gider adaya, kaçırması imkansız.

#### 11. Onay Sistemi (Approval Flow)
**Teknik:** approvalStatus field, role-based PATCH endpoint, middleware authorization
**Basit:** Teklifi göndermeden önce yöneticinin onayını bekle.

#### 12. Geçerlilik Süresi (Expiration)
**Teknik:** expiresAt DateTime field, cron job veya scheduled task, status update
**Basit:** "7 gün geçerli" diye otomatik süre koy, sonra geçersiz olsun.

#### 13. Template Yönetimi (CRUD)
**Teknik:** Full REST API (GET/POST/PUT/DELETE), template versioning optional
**Basit:** Şablonları oluştur, düzenle, sil, istediğin gibi yönet.

#### 14. Şablondan Teklif Oluştur
**Teknik:** POST /from-template/:id endpoint, deep copy template data to offer
**Basit:** Hazır şablonu seç, birkaç küçük değişiklik yap, gönder.

#### 15. Aday Cevap Sayfası (Public Page)
**Teknik:** Public Next.js route, token validation, PATCH status endpoint (no auth)
**Basit:** Aday linke tıklayınca "Kabul Et/Reddet" butonu görür, sisteme giriş yapmadan.

---

### ✅ Seçenek 3: İleri Seviye Özellikler (14-21 gün)

*Seçenek 2'deki tüm özellikler + aşağıdakiler:*

#### 16. E-İmza Entegrasyonu (DocuSign)
**Teknik:** DocuSign API OAuth2, webhook callback, signed PDF storage
**Basit:** Aday teklifi elektronik imza ile imzalayabilir, yasal geçerli.

#### 17. AI Maaş Önerisi (Gemini)
**Teknik:** Gemini API prompt engineering, candidate experience/market data analysis
**Basit:** Yapay zeka adayın CV'sine bakıp "₺45.000-55.000 arası uygun" der.

#### 18. Maaş Gerekçesi (AI Rationale)
**Teknik:** Gemini response parsing, salaryRationale text field, context-aware prompt
**Basit:** Neden bu maaş önerildi diye detaylı açıklama gösterir AI.

#### 19. Toplu Teklif Gönderme (Bulk Send)
**Teknik:** Multi-select UI, batch processing queue, parallel email sending
**Basit:** 10 adaya aynı anda teklif gönder, tek tek uğraşma.

#### 20. Karşı Teklif Sistemi (Negotiation)
**Teknik:** OfferNegotiation model, counter-offer flow, status state machine
**Basit:** Aday "Maaş ₺60.000 olsun" diye karşı teklif yapabilir.

#### 21. Müzakere Geçmişi
**Teknik:** One-to-many relation, negotiation timeline component, audit trail
**Basit:** Kim ne zaman ne teklif etti, tüm konuşma geçmişini gör.

#### 22. Teklif Karşılaştırma
**Teknik:** Multi-offer comparison view, side-by-side table, difference highlighting
**Basit:** 2-3 teklifi yan yana koy, hangi daha iyi görebilirsin.

#### 23. Dosya Ekleme (Attachments)
**Teknik:** Multer file upload, MinIO storage, JSON array of file metadata
**Basit:** Sözleşme/iş tanımı gibi ek dökümanlar ekle teklife.

#### 24. Teklif Analitikleri
**Teknik:** Aggregate queries, Chart.js visualizations, time-series analysis
**Basit:** Kaç teklif gönderildi, kaçı kabul/red edildi grafik göster.

#### 25. Kabul Oranı Raporları
**Teknik:** Group by status, percentage calculations, date range filtering
**Basit:** "Bu ay tekliflerin %80'i kabul edildi" gibi rapor al.

#### 26. Ortalama Yanıt Süresi
**Teknik:** sentAt/respondedAt diff calculation, average aggregate, trend chart
**Basit:** Adaylar ortalama kaç günde cevap veriyor göster.

#### 27. Departman Bazlı İstatistik
**Teknik:** JOIN with JobPosting, GROUP BY department, multi-dimensional analysis
**Basit:** Hangi departmanda daha çok teklif kabul ediliyor gör.

#### 28. Custom PDF Builder (Sürükle-Bırak)
**Teknik:** Drag-drop React component library, JSON template schema, dynamic rendering
**Basit:** PDF şablonunu istediğin gibi tasarla, blokları sürükle.

#### 29. Versiyon Geçmişi (Offer Revisions)
**Teknik:** History table, diff tracking, rollback mechanism
**Basit:** Teklifi kaç kere değiştirdin, eski halini geri getir.

#### 30. Teklif Şablon Kategorileri
**Teknik:** Category enum/relation, nested filtering, hierarchical structure
**Basit:** Şablonları "Yazılım", "Satış", "Yönetim" diye kategorize et.

---

## 📊 ÖZET TABLO

| # | Özellik | Seçenek 1 | Seçenek 2 | Seçenek 3 |
|---|---------|-----------|-----------|-----------|
| 1-6 | Temel teklif sistemi | ✅ | ✅ | ✅ |
| 7-15 | Template + Tracking | ❌ | ✅ | ✅ |
| 16-30 | AI + Analytics + Advanced | ❌ | ❌ | ✅ |
| **TOPLAM ÖZELLİK** | **6** | **15** | **30** |
| **SÜRE** | **3-5 gün** | **7-10 gün** | **14-21 gün** |

---

## 🎯 HANGISI SENIN İÇİN?

**Seçenek 1:** Hızlı başla, sadece teklif gönder/takip et
**Seçenek 2:** Profesyonel, template + aday linki var
**Seçenek 3:** Tam donanım, AI + analytics + müzakere

---

**Karar ver, başlayalım!** 🚀
