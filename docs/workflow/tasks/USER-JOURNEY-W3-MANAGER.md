# 👨‍💼 W3: MANAGER Role - Gerçek Kullanıcı Senaryosu

**Role:** MANAGER (Department Manager)
**Account:** test-manager@test-org-1.com / TestPass123!
**Department:** Engineering
**Amaç:** Departman yöneticisi olarak sadece kendi ekibini yönet

---

## 📋 SENARYO: Departman Yöneticisinin Görevi

### 1. Login & Sidebar (Department Isolation KRİTİK!)

```
Login: test-manager@test-org-1.com / TestPass123!

GÖRMELİ:
✅ Dashboard (department metrics)
✅ Adaylar (Engineering only!)
✅ Teklif Onaylama (department offers)
✅ Departman Raporları
✅ İş İlanları (görüntüleme + yorum)
✅ Takım (Engineering team only!)

GÖRMEMELİ:
❌ Tüm organizasyon raporları (ADMIN)
❌ CV yükleme (HR only)
❌ Analiz oluşturma (HR only)
❌ Kullanıcı yönetimi (ADMIN)
❌ Ayarlar (ADMIN)
```

**Screenshot:** `screenshots/w3-01-sidebar.png`

---

### 2. Dashboard - Departman Metrikleri

```
GÖRMELİ (SADECE ENGINEERING):
✅ Departman Genel Bakış (Engineering)
✅ Aktif Adaylar (Engineering için)
✅ Bekleyen Onaylar (teklif onayları)
✅ İşe Alım Pipeline (Engineering)
✅ Takım Performansı

GÖRMEMELİ:
❌ Sales departmanı verileri
❌ Marketing departmanı verileri
❌ Org-wide istatistikler

KONTROL (PostgreSQL):
SELECT * FROM candidates WHERE department = 'Engineering'
-- MANAGER sadece bunları görmeli!
```

**Screenshot:** `screenshots/w3-02-dashboard-dept.png`

---

### 3. Adayları İncele (Engineering ONLY!)

```
1. "Adaylar" tıkla
2. ✅ CHECK: Sadece Engineering adayları mı?

KRİTİK TEST:
- Liste: ____ aday görünüyor
- PostgreSQL: SELECT COUNT(*) FROM candidates WHERE department='Engineering'
- İkisi AYNI olmalı!
- Başka departman adayı olmamalı!

3. Bir aday seç → Detay
4. Manager notu ekle: "Teknik mülakata hazır"
5. Durum değiştir: "Mülakat Planlandı"
6. Kaydet
7. ✅ CHECK: Timeline'da görünüyor mu?
```

**Screenshot:** `screenshots/w3-03-candidates-dept.png`

---

### 4. Teklif Onaylama (Department Offers)

```
1. Dashboard → "Bekleyen Onaylar" widget
   VEYA "Teklifler" menüsü

2. GÖRMELİ:
   ✅ Engineering departmanına yapılan teklifler
   ✅ Her teklif için:
     - Aday ismi
     - Pozisyon
     - Maaş teklifi
     - Başlangıç tarihi

GÖRMEMELİ:
❌ Başka departmanların teklifleri

3. Bir teklif seç
4. İncele:
   - Aday CV'si
   - Mülakat notları
   - Önerilen maaş
5. ONAYLA veya REDDET

ONAYLA:
- Onay notu: "Ekibe uygun, onaylıyorum"
- Kaydet
- ✅ CHECK: Durum "Manager Onaylı" oldu mu?

REDDET:
- Red nedeni: "Maaş beklentisi bütçe üstü"
- Kaydet
- ✅ CHECK: Durum "Manager Reddetti" oldu mu?
```

**Screenshot:** `screenshots/w3-04-offer-approval.png`

---

### 5. Departman Raporları

```
1. "Raporlar" tıkla
2. GÖRMELİ:
   ✅ Departman İşe Alım Pipeline (Engineering)
   ✅ Ortalama İşe Alma Süresi (dept)
   ✅ Mülakat-Teklif Oranı (dept)
   ✅ Kaynak Etkinliği (dept)

GÖRMEMELİ:
❌ Organizasyon geneli raporlar
❌ Diğer departmanların raporları

3. "Departman Pipeline" raporu oluştur
4. Tarih: Son 30 gün
5. ✅ CHECK: Sadece Engineering verileri mi?
6. Export CSV
7. CSV kontrol: Tüm satırlar Engineering mi?
```

**Screenshot:** `screenshots/w3-05-dept-reports.png`

---

### 6. İş İlanlarına Yorum (Görüntüleme + Yorum)

```
1. "İş İlanları" tıkla
2. GÖRMELİ:
   ✅ Tüm org ilanları (görüntüleme)
   ✅ İlan detayı
   ✅ Yorum ekleme

GÖRMEMELİ:
❌ "Yeni İlan Oluştur" (HR only)
❌ "İlanı Sil" (HR only)
❌ "Düzenle" (HR only veya sınırlı)

3. Bir Engineering ilanı seç
4. Yorum ekle: "Takım liderliği deneyimi vurgulayalım"
5. Kaydet
6. ✅ CHECK: Yorum listede görünüyor mu?

KONTROL:
- "Yeni İlan" butonu var mı? (OLMAMALI veya tıklanınca 403)
```

**Screenshot:** `screenshots/w3-06-job-comment.png`

---

### 7. Takım (Engineering Team)

```
1. "Takım" tıkla
2. GÖRMELİ:
   ✅ Engineering departmanı üyeleri
   ✅ İsim, Rol, Email

GÖRMEMELİ:
❌ Sales team
❌ Marketing team
❌ HR team (eğer başka dept'taysa)
❌ Rol değiştirme (ADMIN)

KONTROL (PostgreSQL):
SELECT * FROM users WHERE department='Engineering' AND organizationId='org1'
-- MANAGER sadece bunları görmeli!

3. Team member detay
4. ✅ CHECK: Sadece görüntüleme (edit yok)
```

**Screenshot:** `screenshots/w3-07-team-dept.png`

---

### 8. RBAC - Cross-Department Testleri (KRİTİK!)

**ADIM 8.1: URL Testleri**
```
❌ http://localhost:8103/admin
   Beklenen: 403

❌ http://localhost:8103/settings
   Beklenen: 403

❌ http://localhost:8103/departments/sales
   Beklenen: 403 veya redirect (cross-dept)

❌ http://localhost:8103/billing
   Beklenen: 403
```

**ADIM 8.2: API Cross-Department Test**
```javascript
// MANAGER token ile Sales adayına erişmeye çalış
const response = await page.evaluate(async () => {
    const token = localStorage.getItem('token');

    // Sales dept candidate ID (başka departman)
    const res = await fetch('http://localhost:8102/api/v1/candidates/sales-candidate-id', {
        headers: {'Authorization': `Bearer ${token}`}
    });

    return {status: res.status};  // Beklenen: 403 veya 404
});
```

**ADIM 8.3: Department Filter Test**
```javascript
// API ile tüm adayları çekmeye çalış (department filter olmalı!)
const response = await page.evaluate(async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8102/api/v1/candidates', {
        headers: {'Authorization': `Bearer ${token}`}
    });
    const candidates = await res.json();

    // Hepsi Engineering mi?
    const nonEngineering = candidates.filter(c => c.department !== 'Engineering');

    return {
        total: candidates.length,
        nonEngineering: nonEngineering.length  // MUST be 0!
    };
});
```

---

### 9. Console Errors (8 Sayfa)

```
1. Dashboard
2. Adaylar
3. Aday Detayı
4. Teklifler
5. Raporlar
6. İş İlanları
7. Takım
8. Profil

Her sayfa: playwright.console_errors() → {errorCount: 0}
```

---

### 10. Performans

```
Ölç:
- Dashboard (dept metrics): _____ ms
- Adaylar (filtered): _____ ms
- Raporlar: _____ ms
```

---

## 📊 RAPOR

```markdown
# W3: MANAGER Test Raporu

## Department Isolation (KRİTİK!)
- UI: Sadece Engineering adayları ✅/❌
- API: Department filter çalışıyor ✅/❌
- PostgreSQL verify: Sayılar eşleşiyor ✅/❌

## Özellikler
- [x] Aday inceleme (dept only)
- [x] Teklif onaylama
- [x] Dept raporları
- [x] İş ilanı yorumlama
- [x] Takım görüntüleme (dept only)

## RBAC
- Cross-department URL: DENIED ✅/❌
- Cross-department API: DENIED ✅/❌
- Admin features: DENIED ✅/❌

## Console Errors: ?/8 pages clean

## Screenshots: 7 adet
```

---

## ✅ BAŞARI KRİTERİ

- [ ] Department isolation %100 (Engineering only!)
- [ ] Cross-department erişim YOK
- [ ] Teklif onaylama çalışıyor
- [ ] Dept raporları doğru
- [ ] RBAC perfect
- [ ] Console errors: 0
- [ ] 7 screenshot
