# 👤 W1: USER Role - Gerçek Kullanıcı Senaryosu

**Role:** USER (Basic Employee)
**Account:** test-user@test-org-1.com / TestPass123!
**Amaç:** Günlük bir çalışan gibi sistemi kullan

---

## 📋 SENARYO: Bir Gün İçinde USER Ne Yapar?

### 1. Sabah Geldi - Login & Dashboard

**ADIM 1.1: Login**
```
1. http://localhost:8103 aç
2. Email: test-user@test-org-1.com
3. Password: TestPass123!
4. "Giriş Yap" butonuna tıkla
5. ✅ CHECK: Dashboard'a yönlendirildi mi?
```

**ADIM 1.2: Sidebar Kontrolü (KRİTİK!)**
```
Sol sidebar'da GÖRMELİ:
✅ Dashboard (ana sayfa icon)
✅ Analizler (veya CV Analizleri - sadece görüntüleme)
✅ AI Sohbet
✅ Profil
✅ Bildirimler
✅ Yardım

GÖRMEMELİ (RBAC):
❌ İş İlanları (Yeni Ekle butonu)
❌ CV Yönetimi (Upload butonu)
❌ Takım Yönetimi
❌ Raporlar
❌ Ayarlar (Organizasyon ayarları)
❌ Faturalama
❌ Admin Paneli

KONTROL: Her menü itemine tıkla
- Görünenlere tıkla → Sayfa açılmalı
- Görünmeyenler zaten yok olmalı (DOM'da bile bulunmamalı)
```

**Screenshot:** `screenshots/w1-01-sidebar.png`

**ADIM 1.3: Dashboard Widget'ları**
```
Dashboard'da GÖRMELİ:
✅ Hoş Geldin mesajı (USER adıyla)
✅ Son Aktiviteler (kendi aktiviteleri)
✅ Bekleyen Görevler (varsa)
✅ Bildirimler özeti

GÖRMEMELİ:
❌ Organizasyon İstatistikleri
❌ Kullanım Limitleri
❌ Takım Performansı
❌ Sistem Sağlığı

KONTROL: Her widget'a tıkla
- "Son Aktiviteler" → Detay açılıyor mu?
- "Bekleyen Görevler" → Liste görünüyor mu?
```

**Screenshot:** `screenshots/w1-02-dashboard.png`

---

### 2. CV Analiz Sonuçlarına Bakmak

**ADIM 2.1: Analizler Sayfasına Git**
```
1. Sidebar'dan "Analizler" (veya CV Analizleri) tıkla
2. ✅ CHECK: Sayfa açıldı mı?
3. ✅ CHECK: Liste görünüyor mu?
```

**ADIM 2.2: Analiz Sonuçlarını Gör (READ-ONLY)**
```
GÖRMELİ:
✅ Analiz listesi (tabloda)
✅ Her analiz için:
  - İş ilanı adı
  - Tarih
  - Aday sayısı
  - Durum
✅ "Detay Gör" butonu

GÖRMEMELİ (USER sadece görüntüler):
❌ "Yeni Analiz Başlat" butonu
❌ "Analizi Sil" butonu
❌ "CV Yükle" butonu
❌ Düzenleme seçenekleri

KONTROL:
- "Detay Gör" tıkla → Analiz detayı açılıyor mu?
- Aday skorlarını görebiliyor mu?
- CV'yi indirebiliyor mu? (sadece görüntüleme)
```

**Screenshot:** `screenshots/w1-03-analysis-list.png`

**ADIM 2.3: Bir Analiz Detayına Gir**
```
1. Listeden bir analizi seç
2. "Detay Gör" tıkla
3. GÖRMELİ:
   ✅ Aday listesi (skorlarla)
   ✅ Her aday için:
     - İsim
     - Skor
     ✅ CV görüntüleme (PDF viewer veya download)
   ✅ Karşılaştırma tablosu (eğer varsa)
4. GÖRMEMELİ:
   ❌ "Analizi Yeniden Çalıştır"
   ❌ "Adayı Sil"
   ❌ "Skorları Düzenle"

KONTROL:
- CV indirme çalışıyor mu?
- Aday detayına tıklayabiliyor mu?
- Sadece görüntüleme (edit yok)
```

**Screenshot:** `screenshots/w1-04-analysis-detail.png`

---

### 3. AI Sohbet ile Soru Sormak

**ADIM 3.1: AI Sohbet Aç**
```
1. Sidebar'dan "AI Sohbet" tıkla
2. ✅ CHECK: Sohbet arayüzü açıldı mı?
```

**ADIM 3.2: Soru Sor**
```
SENARYO: USER en iyi adayları öğrenmek istiyor

1. Mesaj yaz: "Backend Developer pozisyonu için en iyi 3 aday kimler?"
2. Gönder
3. ✅ CHECK: Gemini yanıt veriyor mu?
4. ✅ CHECK: Yanıt süresi < 5 saniye mi?
5. ✅ CHECK: Yanıtta aday isimleri var mı?

KONTROL:
- Sohbet geçmişi kaydediliyor mu?
- Yeni soru sorabilir mi?
- Başka kullanıcıların sohbetlerini görebiliyor mu? (HAYIR olmalı - RBAC)
```

**Screenshot:** `screenshots/w1-05-ai-chat.png`

---

### 4. Profil Ayarlarını Güncellemek

**ADIM 4.1: Profil Sayfasına Git**
```
1. Sağ üst köşede profil icon/isim tıkla
2. "Profil" seç (veya sidebar'dan)
3. ✅ CHECK: Profil sayfası açıldı mı?
```

**ADIM 4.2: Profil Bilgilerini Gör**
```
GÖRMELİ (Düzenlenebilir):
✅ İsim
✅ Email (belki readonly)
✅ Telefon
✅ Profil fotoğrafı
✅ Şifre değiştirme

GÖRMEMELİ (USER değiştiremez):
❌ Rol (USER - readonly olmalı)
❌ Organizasyon (readonly)
❌ İzinler
❌ Departman (eğer varsa - readonly)

KONTROL:
- İsim değiştir → Kaydet → UI'da güncellenmiş mi?
- Şifre değiştir → Logout → Yeni şifre ile login → Çalışıyor mu?
```

**Screenshot:** `screenshots/w1-06-profile.png`

---

### 5. Bildirimleri Kontrol Et

**ADIM 5.1: Bildirimler**
```
1. Sağ üst köşede bildirim icon tıkla (🔔)
2. ✅ CHECK: Bildirim listesi açıldı mı?
3. GÖRMELİ:
   ✅ USER'a özel bildirimler (kendi aktiviteleri)
   ✅ "Okundu" işaretle butonu
   ✅ Tarih/saat bilgisi
4. GÖRMEMELİ:
   ❌ Başka kullanıcıların bildirimleri
   ❌ Admin bildirimleri (sistem geneli)

KONTROL:
- Bildirime tıkla → İlgili sayfaya yönleniyor mu?
- "Okundu" işaretle → UI güncellenmiş mi?
```

**Screenshot:** `screenshots/w1-07-notifications.png`

---

### 6. RBAC Testleri (KRİTİK!)

**ADIM 6.1: Erişemeyeceği URL'leri Dene**
```
Manuel URL girişi ile:

❌ http://localhost:8103/admin
   Beklenen: 403 veya redirect to dashboard

❌ http://localhost:8103/job-postings/create
   Beklenen: 403 veya redirect

❌ http://localhost:8103/team
   Beklenen: 403 veya redirect

❌ http://localhost:8103/reports
   Beklenen: 403 veya redirect

❌ http://localhost:8103/settings
   Beklenen: 403 veya redirect (sadece profil settings OK)

❌ http://localhost:8103/billing
   Beklenen: 403 veya redirect

KONTROL:
- Her URL → 403 sayfası VEYA dashboard'a redirect
- Hiçbiri içeriği göstermemeli!
```

**Screenshot:** `screenshots/w1-08-rbac-403.png`

**ADIM 6.2: API Endpoint'lerini Dene (Playwright ile)**
```javascript
// USER token'ı ile admin endpoint'i dene
const response = await page.evaluate(async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8102/api/v1/job-postings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: "Unauthorized Job",
            description: "Should fail"
        })
    });
    return { status: res.status, ok: res.ok };
});

// Beklenen: {status: 403, ok: false}
console.log('Create job (USER): ', response); // MUST be 403!
```

---

### 7. Console Errors Kontrolü (HER SAYFADA!)

**ADIM 7.1: Console Error Taraması**
```javascript
// Playwright ile her sayfada
const errors = await playwright.console_errors();

BEKLENEN: {errorCount: 0, errors: []}

Eğer errorCount > 0:
- Her error'u logla
- Screenshot al
- Hangi sayfada olduğunu not et
- Repro adımları yaz
```

**Test edilen sayfalar:**
1. ✅ Login
2. ✅ Dashboard
3. ✅ Analizler listesi
4. ✅ Analiz detayı
5. ✅ AI Sohbet
6. ✅ Profil
7. ✅ Bildirimler

**Sonuç:** `errorCount = ?` (MUST be 0!)

---

### 8. Performans Testleri

**ADIM 8.1: Sayfa Yükleme Süreleri**
```javascript
// Her sayfa için
const startTime = Date.now();
await page.goto('http://localhost:8103/dashboard');
await page.waitForSelector('.dashboard-widget');
const loadTime = Date.now() - startTime;

console.log(`Dashboard load: ${loadTime}ms`); // Target: <2000ms
```

**Ölç:**
- Dashboard: _____ ms
- Analizler: _____ ms
- AI Sohbet: _____ ms
- Profil: _____ ms

**Hedef:** Tüm sayfalar < 2 saniye

---

## 📊 RAPOR FORMATI

```markdown
# W1: USER Role Test Raporu

## Senaryo Tamamlanma
- [x] Login & Dashboard
- [x] Sidebar kontrolü
- [x] CV Analiz görüntüleme
- [x] AI Sohbet
- [x] Profil güncelleme
- [x] Bildirimler
- [x] RBAC testleri
- [x] Console errors

## Bulunan Sorunlar
### CRITICAL
1. [Başlık] - Detay, repro steps, screenshot

### HIGH
...

## RBAC Sonuçları
| Feature | Erişmeli | Erişebilir | Durum |
|---------|----------|------------|-------|
| Dashboard | ✅ | ✅ | PASS |
| Admin Panel | ❌ | ❌ | PASS |
...

## Console Errors
- Dashboard: 0 error ✅
- Analizler: 0 error ✅
...

## Performans
- Dashboard: 1234 ms
- Analizler: 987 ms
...

## Screenshot'lar
[8 screenshot path]
```

---

## ✅ BAŞARI KRİTERLERİ

- [ ] USER gerçek bir çalışan gibi sistemi kullandı
- [ ] Sidebar menüsü doğru (7 item görünür, 6 item gizli)
- [ ] Her feature test edildi (dashboard, analizler, AI, profil, bildirimler)
- [ ] RBAC 100% çalışıyor (6 URL denied, API calls denied)
- [ ] Console errors: 0 (7 sayfa test edildi)
- [ ] Performans OK (tüm sayfalar < 2s)
- [ ] 8 screenshot alındı
- [ ] Rapor yazıldı (markdown)

---

**Bu senaryo GERÇEK BİR USER'IN günlük kullanımını simüle eder!**
