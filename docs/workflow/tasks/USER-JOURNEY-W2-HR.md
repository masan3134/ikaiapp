# 👔 W2: HR_SPECIALIST Role - Gerçek Kullanıcı Senaryosu

**Role:** HR_SPECIALIST (HR Operations)
**Account:** test-hr_specialist@test-org-2.com / TestPass123!
**Amaç:** Gerçek bir İK uzmanı gibi işe alım sürecini yönet

---

## 📋 SENARYO: İK Uzmanının Bir Günü

### 1. Sabah - Yeni İş İlanı Oluşturma

**ADIM 1.1: Login & Sidebar**
```
1. Login: test-hr_specialist@test-org-2.com / TestPass123!
2. Sidebar kontrol:

GÖRMELİ:
✅ Dashboard
✅ İş İlanları (CRUD - create/edit/delete)
✅ CV Yönetimi (upload/delete)
✅ Analiz Sihirbazı (wizard icon)
✅ Adaylar
✅ Raporlar (HR-specific)
✅ Takım (görüntüleme)
✅ AI Sohbet
✅ Profil

GÖRMEMELİ:
❌ Organizasyon Ayarları (ADMIN)
❌ Faturalama (ADMIN)
❌ Sistem Sağlığı (SUPER_ADMIN)
❌ Kullanıcı Rol Yönetimi (ADMIN)
```

**Screenshot:** `screenshots/w2-01-sidebar.png`

**ADIM 1.2: Dashboard - HR Metrikleri**
```
GÖRMELİ:
✅ Aktif İş İlanları sayısı
✅ Toplam Adaylar
✅ Son Analizler
✅ İşe Alım Pipeline (aday durumları)
✅ Kullanım İstatistikleri (50 analiz, 200 CV - PRO plan)
✅ Hızlı Aksiyonlar (İlan Oluştur, CV Yükle, Yeni Analiz)

KONTROL:
- Her widget tıklanabilir mi?
- Sayılar gerçek mi? (PostgreSQL ile verify)
```

**Screenshot:** `screenshots/w2-02-dashboard.png`

**ADIM 1.3: Yeni İş İlanı Oluştur**
```
1. "İş İlanları" → "Yeni İlan" tıkla
2. Form doldur:
   Başlık: "Senior Frontend Developer"
   Departman: "Engineering"
   Lokasyon: "İstanbul"
   Maaş: "25000-35000 TL"
   Açıklama: "React, TypeScript deneyimi olan..."
   Gereksinimler: "5+ yıl React, TypeScript..."
   Durum: "Aktif"
3. Kaydet
4. ✅ CHECK: İlan listesinde görünüyor mu?
5. ✅ CHECK: Database'e kaydedildi mi? (PostgreSQL)

KONTROL:
- Form validation çalışıyor mu?
- Tüm departmanlar dropdown'da mı?
- Taslak olarak kaydedebiliyor mu?
```

**Screenshot:** `screenshots/w2-03-create-job.png`

---

### 2. CV Yükleme & Yönetim

**ADIM 2.1: Toplu CV Yükleme**
```
1. "CV Yönetimi" tıkla
2. "CV Yükle" butonu
3. 10 PDF dosya seç (drag-drop veya file picker)
4. ✅ CHECK: Upload progress bar görünüyor mu?
5. ✅ CHECK: Süre < 2 saniye (10 dosya için)
6. ✅ CHECK: Tüm 10 CV listede görünüyor mu?

KONTROL:
- Dosya tipi kontrolü var mı? (sadece PDF?)
- Maksimum boyut kontrolü?
- PRO plan limit: 200 CV/ay (şu an kaç kullanılmış?)
```

**Screenshot:** `screenshots/w2-04-cv-upload.png`

**ADIM 2.2: CV Görüntüleme**
```
1. Listeden bir CV seç
2. "Önizleme" veya "Aç" tıkla
3. ✅ CHECK: PDF viewer açılıyor mu?
4. ✅ CHECK: İndirme butonu çalışıyor mu?
5. ✅ CHECK: Meta bilgiler görünüyor mu? (yükleme tarihi, boyut)
```

**ADIM 2.3: CV Silme**
```
1. Bir CV seç
2. "Sil" butonu
3. ✅ CHECK: Onay dialog açılıyor mu?
4. Onayla
5. ✅ CHECK: Listeden kaldırıldı mı?
6. ✅ CHECK: Database'den silindi mi? (PostgreSQL verify)
```

---

### 3. Analiz Sihirbazı (5 Adım - KRİTİK!)

**ADIM 3.1: Sihirbazı Başlat**
```
1. "Analiz Sihirbazı" tıkla
2. ✅ CHECK: Modal veya yeni sayfa açıldı mı?
3. ✅ CHECK: Adım göstergesi var mı? (1/5, 2/5...)
```

**ADIM 3.2: Adım 1 - İş İlanı Seç**
```
GÖRMELİ:
✅ Dropdown: Tüm aktif ilanlar
✅ İlan seçilince özet göster

SEÇ: "Senior Frontend Developer" (방금 oluşturduğumuz)
İleri tıkla
✅ CHECK: Adım 2'ye geçti mi?
```

**Screenshot:** `screenshots/w2-05-wizard-step1.png`

**ADIM 3.3: Adım 2 - CV'leri Yükle**
```
1. 5 CV dosya seç (drag-drop)
2. ✅ CHECK: Dosyalar listeleniyor mu?
3. ✅ CHECK: Progress bar var mı?
4. ✅ CHECK: Upload süresi < 10 saniye (5 dosya)
5. İleri tıkla
6. ✅ CHECK: Adım 3'e geçti mi?

KONTROL:
- Maksimum 50 CV kontrolü var mı? (PRO limit)
- 51. dosyayı eklemeye çalış → Error mesajı
```

**Screenshot:** `screenshots/w2-06-wizard-step2.png`

**ADIM 3.4: Adım 3 - Analiz Ayarları**
```
GÖRMELİ:
✅ Skorlama kriterleri (ağırlıklar)
✅ Zorunlu gereksinimler
✅ İsteğe bağlı gereksinimler
✅ Eleme soruları (varsa)

AYARLA:
- Teknik Beceriler: %40
- Deneyim: %30
- Eğitim: %20
- Referanslar: %10

İleri tıkla
✅ CHECK: Adım 4'e geçti mi?
```

**Screenshot:** `screenshots/w2-07-wizard-step3.png`

**ADIM 3.5: Adım 4 - Önizleme & Onayla**
```
GÖRMELİ:
✅ İş ilanı: "Senior Frontend Developer"
✅ CV sayısı: 5
✅ Analiz ayarları özeti

"Analizi Başlat" tıkla
✅ CHECK: Yükleme ekranı gösteriliyor mu?
✅ CHECK: Progress bar var mı?

BEKLE: ~15-20 saniye (5 CV için, BATCH_SIZE=6)
✅ CHECK: Tamamlandı mesajı
```

**Screenshot:** `screenshots/w2-08-wizard-step4.png`

**ADIM 3.6: Adım 5 - Sonuçlar**
```
GÖRMELİ:
✅ Aday listesi (skorlara göre sıralı)
✅ Her aday için:
  - İsim
  - Toplam Skor (0-100)
  - Kriter skorları (teknik, deneyim, eğitim...)
  - CV linki
✅ Karşılaştırma tablosu
✅ Filtreleme (skor aralığı, kriterler)

KONTROL:
- En yüksek skorlu aday en üstte mi?
- Skorlar mantıklı mı? (0-100 arası)
- CV tıklanabilir mi?
```

**Screenshot:** `screenshots/w2-09-wizard-results.png`

---

### 4. Aday Yönetimi

**ADIM 4.1: Adaylar Listesi**
```
1. "Adaylar" tıkla
2. GÖRMELİ:
   ✅ Tüm adaylar (Test Org 2)
   ✅ Filtreleme: Durum, İlan, Skor
   ✅ Sıralama: Skor, Tarih, İsim
   ✅ Arama: İsim veya email

KONTROL:
- Sadece Test Org 2 adayları mı? (org isolation)
- Filtreler çalışıyor mu?
```

**ADIM 4.2: Aday Detayı**
```
1. Bir aday seç, tıkla
2. GÖRMELİ:
   ✅ CV önizleme
   ✅ Analiz skor detayı
   ✅ Zaman çizelgesi (başvuru→değerlendirme→...)
   ✅ Notlar ekle
   ✅ Durum değiştir (dropdown)

KONTROL:
- Not ekle → Kaydet → Timeline'da görünüyor mu?
- Durum değiştir: "Başvurdu" → "Değerlendiriliyor" → Kaydedildi mi?
```

**Screenshot:** `screenshots/w2-10-candidate-detail.png`

**ADIM 4.3: Aday Durumu Değiştir**
```
1. Durum dropdown: "Mülakat" seç
2. Kaydet
3. ✅ CHECK: UI güncellenmiş mi?
4. ✅ CHECK: Database'de değişmiş mi? (PostgreSQL)
5. ✅ CHECK: Bildirim gönderilmiş mi? (varsa)
```

---

### 5. Raporlar (HR-Specific)

**ADIM 5.1: Raporlar Sayfası**
```
1. "Raporlar" tıkla
2. GÖRMELİ:
   ✅ İşe Alım Pipeline (aday durumları)
   ✅ İşe Alım Süresi (ortalama gün)
   ✅ Kaynak Etkinliği (adaylar nereden geliyor)
   ✅ Aday Demografisi

GÖRMEMELİ:
❌ Organizasyon geneli raporlar (ADMIN)
❌ Finansal raporlar
❌ Kullanım limitleri detayı (ADMIN)
```

**ADIM 5.2: Pipeline Raporu Oluştur**
```
1. "İşe Alım Pipeline" seç
2. Tarih aralığı: Son 30 gün
3. "Rapor Oluştur" tıkla
4. ✅ CHECK: Chart/tablo görünüyor mu?
5. ✅ CHECK: Veriler doğru mu?
   - Başvuru: X aday
   - Değerlendirme: Y aday
   - Mülakat: Z aday
   - Teklif: W aday

KONTROL:
- Eksport CSV çalışıyor mu?
- CSV doğru veriyi içeriyor mu?
```

**Screenshot:** `screenshots/w2-11-reports.png`

---

### 6. Takım Görüntüleme (Sınırlı Erişim)

**ADIM 6.1: Takım Listesi**
```
1. "Takım" tıkla
2. GÖRMELİ:
   ✅ Test Org 2 kullanıcıları (liste)
   ✅ İsim, Email, Rol
   ✅ Durum (aktif/pasif)

GÖRMEMELİ:
❌ "Kullanıcı Ekle" butonu (ADMIN)
❌ "Rol Değiştir" butonu (ADMIN)
❌ "Kullanıcı Sil" butonu (ADMIN)

KONTROL:
- Sadece görüntüleme (edit yok)
- Kullanıcı detayına tıklayabiliyor mu? (sadece bilgi)
```

**Screenshot:** `screenshots/w2-12-team.png`

---

### 7. RBAC Testleri (KRİTİK!)

**ADIM 7.1: URL Testleri**
```
Manuel URL girişleri:

❌ http://localhost:8103/admin
   Beklenen: 403 veya redirect

❌ http://localhost:8103/settings/organization
   Beklenen: 403 veya redirect

❌ http://localhost:8103/billing
   Beklenen: 403 veya redirect

❌ http://localhost:8103/system-health
   Beklenen: 403 veya redirect

❌ http://localhost:8103/users/manage
   Beklenen: 403 veya redirect (sadece görüntüleme OK)
```

**Screenshot:** `screenshots/w2-13-rbac-denied.png`

**ADIM 7.2: API Testleri (Playwright)**
```javascript
// HR token ile admin endpoint dene
const response = await page.evaluate(async () => {
    const token = localStorage.getItem('token');

    // 1. Organizasyon ayarlarını değiştirmeye çalış
    const res1 = await fetch('http://localhost:8102/api/v1/organization', {
        method: 'PATCH',
        headers: {'Authorization': `Bearer ${token}`},
        body: JSON.stringify({name: "Hacked Org"})
    });

    // 2. Kullanıcı rolü değiştirmeye çalış
    const res2 = await fetch('http://localhost:8102/api/v1/users/123', {
        method: 'PATCH',
        headers: {'Authorization': `Bearer ${token}`},
        body: JSON.stringify({role: "ADMIN"})
    });

    // 3. Faturalamaya erişmeye çalış
    const res3 = await fetch('http://localhost:8102/api/v1/billing', {
        headers: {'Authorization': `Bearer ${token}`}
    });

    return {
        orgSettings: res1.status,  // Beklenen: 403
        userRole: res2.status,      // Beklenen: 403
        billing: res3.status        // Beklenen: 403
    };
});

console.log('RBAC API Tests:', response);
// MUST be: {orgSettings: 403, userRole: 403, billing: 403}
```

---

### 8. Kullanım Limitleri (PRO Plan)

**ADIM 8.1: Kullanım Widget'ı Kontrol**
```
Dashboard'da kullanım widget:

GÖRMELİ:
✅ Analizler: X / 50 kullanılmış
✅ CV'ler: Y / 200 kullanılmış
✅ Kullanıcılar: Z / 10

KONTROL:
- Sayılar doğru mu? (PostgreSQL verify)
- Limit yaklaşıyorsa warning var mı?
```

**ADIM 8.2: Limit Testi (Opsiyonel)**
```
Eğer limit testi yapılabiliyorsa:

1. 51. analizi oluşturmaya çalış (limit: 50)
2. ✅ CHECK: Error mesajı:
   "PRO plan limitine ulaştınız (50 analiz/ay)"
3. ✅ CHECK: Analiz oluşturulmadı

YA DA

1. 201. CV'yi yüklemeye çalış (limit: 200)
2. ✅ CHECK: Error mesajı:
   "PRO plan limitine ulaştınız (200 CV/ay)"
3. ✅ CHECK: CV yüklenmedi
```

---

### 9. Console Errors (HER SAYFADA!)

**ADIM 9.1: Tüm Sayfaları Tara**
```
Playwright console error check:

Sayfalar:
1. ✅ Dashboard
2. ✅ İş İlanları (liste)
3. ✅ İş İlanı Oluştur
4. ✅ CV Yönetimi
5. ✅ Analiz Sihirbazı (5 adım - her adım)
6. ✅ Adaylar
7. ✅ Aday Detayı
8. ✅ Raporlar
9. ✅ Takım
10. ✅ AI Sohbet
11. ✅ Profil

HER SAYFA İÇİN:
const errors = await playwright.console_errors();
// MUST be: {errorCount: 0, errors: []}
```

**Sonuç:** `Total pages: 11, Total errors: ?` (MUST be 0!)

---

### 10. Performans

**ADIM 10.1: Sayfa Yükleme**
```
Ölç:
- Dashboard: _____ ms (target: <2000ms)
- İş İlanları: _____ ms
- CV Yönetimi: _____ ms
- Analiz Sihirbazı: _____ ms
- Adaylar: _____ ms
- Raporlar: _____ ms
```

**ADIM 10.2: API Yanıt Süreleri**
```
Ölç:
- GET /api/v1/dashboard: _____ ms (target: <500ms)
- GET /api/v1/job-postings: _____ ms
- POST /api/v1/cv-upload: _____ ms
- POST /api/v1/analysis: _____ ms
```

---

## 📊 RAPOR FORMATI

```markdown
# W2: HR_SPECIALIST Test Raporu

## Senaryo Tamamlanma
- [x] İş ilanı oluşturma (CRUD)
- [x] CV yükleme & yönetim
- [x] Analiz sihirbazı (5 adım)
- [x] Aday yönetimi
- [x] Raporlar
- [x] Takım görüntüleme
- [x] RBAC testleri (5 URL + 3 API)
- [x] Kullanım limitleri (PRO)
- [x] Console errors (11 sayfa)
- [x] Performans

## Bulunan Sorunlar
### CRITICAL
...

## RBAC Sonuçları
| Feature | Erişmeli | Erişebilir | Durum |
|---------|----------|------------|-------|
| İş İlanları CRUD | ✅ | ? | ? |
| Org Ayarları | ❌ | ? | ? |
| Faturalama | ❌ | ? | ? |
...

## Analiz Sihirbazı
- Adım 1: PASS/FAIL
- Adım 2: PASS/FAIL
- Adım 3: PASS/FAIL
- Adım 4: PASS/FAIL
- Adım 5: PASS/FAIL
- Toplam süre: _____ saniye (5 CV için)

## Kullanım Limitleri (PRO)
- Analizler: X/50 ✅
- CVler: Y/200 ✅
- Kullanıcılar: Z/10 ✅

## Console Errors
Total: 0 ✅ (11 sayfa test edildi)

## Performans
- Dashboard: _____ ms
- Wizard: _____ ms
...

## Screenshots: 13 adet
```

---

## ✅ BAŞARI KRİTERLERİ

- [ ] HR gerçek bir İK uzmanı gibi çalıştı
- [ ] İş ilanı CRUD tamamlandı (create, edit görüldü, delete test edildi)
- [ ] CV yükleme çalışıyor (10 dosya, <2s)
- [ ] Analiz sihirbazı 5 adım tamamlandı (5 CV, ~20s)
- [ ] Aday yönetimi çalışıyor (durum değişikliği)
- [ ] Raporlar oluşturuldu (pipeline chart)
- [ ] RBAC 100% (5 URL denied, 3 API denied)
- [ ] Kullanım limitleri doğru (PRO: 50/200/10)
- [ ] Console errors: 0 (11 sayfa)
- [ ] Performans OK (<2s sayfalar)
- [ ] 13 screenshot

---

**Bu senaryo GERÇEK BİR İK UZMANININ günlük workflow'unu simüle eder!**
