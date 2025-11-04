# 📝 Worker Görevi: Test İlanları Oluşturma (Python Script Kullanarak)

**Tarih:** 2025-11-04
**Görev:** Her organizasyon için 2 ilan oluştur (Toplam 6 ilan)
**Yöntem:** Python test helper script (curl/JWT token ile uğraşmana gerek yok!)

---

## 🚀 Hazırlık

### 1. Python Script'i Test Et

```bash
cd /home/asan/Desktop/ikai
python3 scripts/test-helper.py help
```

Çıktıda 6 test kullanıcısı görmelisin.

---

## 📋 Görev Detayları

### Organizasyon 1: Test Organization Free (Technology/FREE)

**Login:**
```python
python3 -i scripts/test-helper.py
>>> helper = IKAITestHelper()
>>> user = TEST_USERS["org1_hr"]
>>> helper.login(user["email"], user["password"])
```

**İlan 1: Junior Frontend Developer**
```python
>>> job1 = {
...   "title": "Junior Frontend Developer",
...   "department": "Engineering",
...   "details": """React, TypeScript ve Next.js ile modern web uygulamaları geliştiren Junior Frontend Developer arıyoruz.
...
... Sorumluluklar:
... - React ve TypeScript ile responsive web uygulamaları geliştirmek
... - UI/UX tasarımlarını kod ile hayata geçirmek
... - Backend ekibi ile API entegrasyonu yapmak
... - Kod review süreçlerine katılmak
...
... Gereksinimler:
... - 1-2 yıl JavaScript/TypeScript deneyimi
... - React ve modern frontend framework bilgisi
... - HTML5, CSS3, responsive design deneyimi
... - Git kullanımı
...
... Artılar:
... - Next.js deneyimi
... - State management (Redux, Zustand) bilgisi
... - RESTful API deneyimi""",
...   "notes": "Haftada 2 gün remote çalışma. Maaş: Deneyime göre."
... }
>>> result1 = helper.post("/api/v1/job-postings", job1)
```

**İlan 2: Software Test Engineer**
```python
>>> job2 = {
...   "title": "Software Test Engineer",
...   "department": "Quality Assurance",
...   "details": """Kaliteli yazılım ürünleri sunmak için QA ekibimize Software Test Engineer arıyoruz.
...
... Sorumluluklar:
... - Test planları ve test case'leri tasarlamak
... - Manuel ve otomatik testler gerçekleştirmek
... - Bug takibi ve raporlama
... - Geliştirme ekibi ile kalite standartlarını sağlamak
...
... Gereksinimler:
... - 2-3 yıl yazılım test deneyimi
... - Test metodolojileri ve best practice bilgisi
... - Test automation (Selenium, Cypress, Jest)
... - API testing (Postman, REST Assured)
...
... Artılar:
... - ISTQB sertifikası
... - CI/CD pipeline deneyimi
... - Performance testing bilgisi""",
...   "notes": "Hybrid çalışma modeli. Sağlık sigortası ve eğitim fırsatları."
... }
>>> result2 = helper.post("/api/v1/job-postings", job2)
```

**Doğrulama:**
```python
>>> jobs = helper.get("/api/v1/job-postings")
```

Terminal çıktısını kopyala → Rapor dosyasına yapıştır.

---

### Organizasyon 2: Test Organization Pro (Healthcare/PRO)

**Login:**
```python
>>> helper2 = IKAITestHelper()
>>> user2 = TEST_USERS["org2_manager"]
>>> helper2.login(user2["email"], user2["password"])
```

**İlan 1: Healthcare Data Analyst**
```python
>>> job3 = {
...   "title": "Healthcare Data Analyst",
...   "department": "Data Analytics",
...   "details": """Sağlık verileri analizi yapacak deneyimli Data Analyst arıyoruz.
...
... Sorumluluklar:
... - Hasta verileri, tedavi sonuçları ve hastane operasyonlarını analiz etmek
... - Dashboard ve raporlar oluşturmak
... - Veri kalitesini kontrol etmek
... - Sağlık ekipleri ile işbirliği yapmak
...
... Gereksinimler:
... - 3+ yıl veri analizi deneyimi
... - SQL ve veri analiz araçları (Python, R, Excel)
... - Sağlık sektörü bilgisi
... - İstatistik ve veri görselleştirme
... - HIPAA compliance bilgisi
...
... Artılar:
... - BI tools deneyimi (Tableau, Power BI)
... - Machine learning bilgisi
... - Healthcare IT sistemleri deneyimi""",
...   "notes": "Esnek çalışma saatleri. Comprehensive health benefits."
... }
>>> result3 = helper2.post("/api/v1/job-postings", job3)
```

**İlan 2: Medical Records Specialist**
```python
>>> job4 = {
...   "title": "Medical Records Specialist",
...   "department": "Health Information Management",
...   "details": """Hasta kayıtları yönetimi için Medical Records Specialist arıyoruz.
...
... Sorumluluklar:
... - Hasta kayıtlarını düzenlemek ve saklamak
... - Elektronik sağlık kayıt sistemlerini (EHR) yönetmek
... - HIPAA compliance sağlamak
... - Medikal terminoloji ve kodlama
... - Hasta bilgi taleplerini karşılamak
...
... Gereksinimler:
... - 2+ yıl medical records deneyimi
... - EHR sistemleri bilgisi (Epic, Cerner)
... - Medical terminology ve ICD-10 kodlama
... - HIPAA regulations bilgisi
... - Detaylara dikkat ve organizasyon becerisi
...
... Artılar:
... - RHIT/RHIA sertifikası
... - Healthcare compliance eğitimi
... - Medical coding sertifikası""",
...   "notes": "On-site pozisyon. Profesyonel gelişim desteği."
... }
>>> result4 = helper2.post("/api/v1/job-postings", job4)
```

**Doğrulama:**
```python
>>> jobs2 = helper2.get("/api/v1/job-postings")
```

---

### Organizasyon 3: Test Organization Enterprise (Finance/ENTERPRISE)

**Login:**
```python
>>> helper3 = IKAITestHelper()
>>> user3 = TEST_USERS["org3_admin"]
>>> helper3.login(user3["email"], user3["password"])
```

**İlan 1: Senior Financial Analyst**
```python
>>> job5 = {
...   "title": "Senior Financial Analyst",
...   "department": "Financial Planning & Analysis",
...   "details": """Deneyimli Senior Financial Analyst ile ekibimizi güçlendirmek istiyoruz.
...
... Sorumluluklar:
... - Finansal modelleme ve forecasting
... - Bütçe planlama ve variance analysis
... - Financial reports ve executive presentations
... - M&A ve yatırım analizi
... - KPI tracking ve business intelligence
...
... Gereksinimler:
... - 5+ yıl financial analysis deneyimi
... - CFA veya CPA sertifikası (tercih edilir)
... - Gelişmiş Excel ve financial modeling
... - ERP sistemleri (SAP, Oracle)
... - Financial regulations bilgisi
...
... Artılar:
... - Investment banking veya PE deneyimi
... - SQL ve Python bilgisi
... - Power BI/Tableau deneyimi
... - MBA""",
...   "notes": "Competitive salary package. Bonus structure. Stock options."
... }
>>> result5 = helper3.post("/api/v1/job-postings", job5)
```

**İlan 2: Risk Management Specialist**
```python
>>> job6 = {
...   "title": "Risk Management Specialist",
...   "department": "Risk & Compliance",
...   "details": """Kurumsal risk yönetimi için Risk Management Specialist arıyoruz.
...
... Sorumluluklar:
... - Risk assessment ve mitigation stratejileri
... - Regulatory compliance monitoring
... - Risk raporları ve board presentations
... - Internal controls ve audit desteği
... - Basel III/IV ve risk frameworks
...
... Gereksinimler:
... - 4+ yıl risk management deneyimi
... - FRM veya PRM sertifikası
... - Financial regulations bilgisi
... - Risk modeling ve quantitative analysis
... - Banking/financial services background
...
... Artılar:
... - Credit risk veya market risk deneyimi
... - Risk management systems (Moody's, S&P)
... - Stress testing ve scenario analysis
... - Advanced degree (MS, MBA)""",
...   "notes": "Hybrid work model. Professional development budget. Health & wellness benefits."
... }
>>> result6 = helper3.post("/api/v1/job-postings", job6)
```

**Doğrulama:**
```python
>>> jobs3 = helper3.get("/api/v1/job-postings")
```

---

## ✅ Final Doğrulama (Database)

```bash
docker exec ikai-postgres psql -U ikaiuser -d ikaidb -c "
SELECT
  jp.id,
  jp.title,
  jp.department,
  o.name as organization,
  u.email as created_by
FROM \"JobPosting\" jp
JOIN \"Organization\" o ON jp.\"organizationId\" = o.id
JOIN \"User\" u ON jp.\"userId\" = u.id
WHERE jp.\"isDeleted\" = false
ORDER BY o.name, jp.\"createdAt\";
"
```

**Beklenen Çıktı:** 6 ilan (her org'da 2)

---

## 📝 Rapor Şablonu

Verification raporu: `docs/test-tasks/job-postings-verification.md`

```markdown
# Test İlanları Oluşturma - Verification Report

**Tarih:** 2025-11-04
**Yöntem:** Python test-helper.py script

---

## Org 1: Test Organization Free (Technology)

**Login:**
\```
[Terminal çıktısını buraya yapıştır]
\```

**İlan 1 Oluşturma: Junior Frontend Developer**
\```
[POST response buraya]
\```

**İlan 2 Oluşturma: Software Test Engineer**
\```
[POST response buraya]
\```

**Doğrulama (GET):**
\```
[GET response buraya - 2 ilan görmeli]
\```

---

## Org 2: Test Organization Pro (Healthcare)

[Aynı format]

---

## Org 3: Test Organization Enterprise (Finance)

[Aynı format]

---

## Database Final Check

\```bash
docker exec ikai-postgres psql -U ikaiuser -d ikaidb -c "SELECT..."
\```

**Çıktı:**
\```
[HAM database çıktısı buraya]
\```

**Beklenen:** 6 ilan
**Gerçek:** [Sayı]
**Durum:** ✅/❌

---

## Özet

- Org 1 (Technology/FREE): 2 ilan ✅
- Org 2 (Healthcare/PRO): 2 ilan ✅
- Org 3 (Finance/ENTERPRISE): 2 ilan ✅

**Toplam:** 6/6 ilan oluşturuldu ✅

**Gerçek dünyada ne oldu:**
- Her organizasyon artık sektörüne uygun 2 test ilanına sahip
- İlanlar farklı rollerdeki kullanıcılar tarafından oluşturuldu (HR, Manager, Admin)
- RBAC korumaları çalışıyor (her org sadece kendi ilanlarını görüyor)
\```

---

## 🎯 Önemli Notlar

**YASAK:**
- ❌ İlanları direkt SQL ile oluşturma
- ❌ Simülasyon/placeholder veriler
- ❌ "Oluşturdum" deyip geçme

**ZORUNLU:**
- ✅ Python script kullan (curl token derdi yok!)
- ✅ Her POST/GET çıktısını kopyala
- ✅ Database'i doğrula
- ✅ RAW terminal çıktıları rapor et

**Python script avantajları:**
- Token otomatik alınıyor
- Login basit: `helper.login(email, password)`
- Endpoints hazır: `helper.get()`, `helper.post()`
- Terminal çıktıları temiz ve formatted
- Hata mesajları açık

---

## 🚀 Başlamak İçin

```bash
cd /home/asan/Desktop/ikai
python3 -i scripts/test-helper.py

# Sonra yukarıdaki komutları sırayla çalıştır
```

**Başarılar Worker! 🎉**
