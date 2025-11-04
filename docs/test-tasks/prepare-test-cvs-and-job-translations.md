# 📄 Test CV'leri ve İş İlanı Türkçeleştirme Görevi

**Tarih:** 2025-11-04
**Görev:** 6 ilan için 5'er adet gerçekçi Türkçe CV hazırla (Toplam 30 CV)
**Hedef:** RBAC testleri için hazır CV'ler olsun, farklı match yüzdeleri alsın

---

## 🎯 Gereksinimler

### CV Özellikleri:
- ✅ Format: `.txt` (basit metin)
- ✅ Dil: Türkçe
- ✅ Güncel Türkiye piyasası (2024-2025)
- ✅ Her aday için sabit bilgiler:
  - Email: mustafaasan91@gmail.com
  - Telefon: 05398827540
- ✅ Her CV farklı deneyim seviyesi (junior, mid, senior)
- ✅ Her ilan için 5 CV: %90-100, %70-80, %50-60, %30-40, %10-20 match

### İlan Özellikleri:
- ✅ Mevcut 6 ilan Türkçeye çevrilecek
- ✅ Güncel Türkiye iş piyasası terminolojisi
- ✅ Gerçekçi maaş bantları (belirtilmeyecek ama notes'ta ipucu)

---

## 📂 Dosya Yapısı

```
/home/asan/Desktop/ikai/test-data/
├── cvs/
│   ├── org1-junior-frontend-developer/
│   │   ├── cv-01-high-match.txt       (90-100% match)
│   │   ├── cv-02-good-match.txt       (70-80% match)
│   │   ├── cv-03-medium-match.txt     (50-60% match)
│   │   ├── cv-04-low-match.txt        (30-40% match)
│   │   └── cv-05-poor-match.txt       (10-20% match)
│   ├── org1-software-test-engineer/
│   │   └── ... (5 CV)
│   ├── org2-healthcare-data-analyst/
│   │   └── ... (5 CV)
│   ├── org2-medical-records-specialist/
│   │   └── ... (5 CV)
│   ├── org3-senior-financial-analyst/
│   │   └── ... (5 CV)
│   └── org3-risk-management-specialist/
│       └── ... (5 CV)
└── job-postings-turkish/
    ├── org1-junior-frontend-developer-TR.txt
    ├── org1-software-test-engineer-TR.txt
    ├── org2-healthcare-data-analyst-TR.txt
    ├── org2-medical-records-specialist-TR.txt
    ├── org3-senior-financial-analyst-TR.txt
    └── org3-risk-management-specialist-TR.txt
```

---

## 🔧 Task 1: Dizin Yapısını Oluştur

```bash
mkdir -p /home/asan/Desktop/ikai/test-data/cvs/org1-junior-frontend-developer
mkdir -p /home/asan/Desktop/ikai/test-data/cvs/org1-software-test-engineer
mkdir -p /home/asan/Desktop/ikai/test-data/cvs/org2-healthcare-data-analyst
mkdir -p /home/asan/Desktop/ikai/test-data/cvs/org2-medical-records-specialist
mkdir -p /home/asan/Desktop/ikai/test-data/cvs/org3-senior-financial-analyst
mkdir -p /home/asan/Desktop/ikai/test-data/cvs/org3-risk-management-specialist
mkdir -p /home/asan/Desktop/ikai/test-data/job-postings-turkish
```

**Verification:**
```bash
ls -la /home/asan/Desktop/ikai/test-data/cvs/
ls -la /home/asan/Desktop/ikai/test-data/job-postings-turkish/
```

---

## 🔧 Task 2: İlanları Türkçeye Çevir

### 2.1: Junior Frontend Developer (Org 1 - Technology/FREE)

**Dosya:** `test-data/job-postings-turkish/org1-junior-frontend-developer-TR.txt`

```
JUNIOR FRONTEND GELİŞTİRİCİ
TechStart Innovations - Teknoloji / Yazılım
İstanbul (Hibrit Çalışma)

POZISYON HAKKINDA:
Modern web teknolojileri ile kullanıcı dostu arayüzler geliştiren, yenilikçi ekibimize
Junior Frontend Developer arıyoruz. React, TypeScript ve Next.js ile çalışacaksınız.

SORUMLULUKLAR:
• React ve TypeScript ile responsive web uygulamaları geliştirmek
• UI/UX tasarımlarını pixel-perfect şekilde kodlamak
• Backend ekibi ile RESTful API entegrasyonları yapmak
• Git ile versiyon kontrolü ve kod review süreçlerine katılmak
• Performance optimizasyonları ve best practice'lere uygun kod yazmak

ARANAN NİTELİKLER:
• Zorunlu:
  - 1-2 yıl JavaScript/TypeScript deneyimi
  - React ve modern frontend framework bilgisi
  - HTML5, CSS3, responsive design deneyimi
  - Git kullanımı
  - İngilizce teknik dokümantasyon okuyabilme
  - Bilgisayar Mühendisliği veya ilgili bölüm mezunu

• Artı:
  - Next.js deneyimi
  - State management (Redux, Zustand, Recoil)
  - RESTful API ve GraphQL bilgisi
  - UI/UX prensipleri
  - Agile/Scrum deneyimi

ÇALIŞMA KOŞULLARI:
• Haftada 2 gün remote çalışma imkanı
• Esnek çalışma saatleri (core hours: 10:00-16:00)
• Yemek kartı
• Özel sağlık sigortası
• Eğitim ve konferans desteği
• Genç ve dinamik takım ortamı

BAŞVURU:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
```

### 2.2: Software Test Engineer (Org 1 - Technology/FREE)

**Dosya:** `test-data/job-postings-turkish/org1-software-test-engineer-TR.txt`

```
YAZILIM TEST MÜHENDİSİ (QA ENGINEER)
TechStart Innovations - Teknoloji / Yazılım
İstanbul (Hibrit Çalışma)

POZISYON HAKKINDA:
Kaliteli yazılım ürünleri sunmak için QA ekibimize deneyimli Software Test Engineer
arıyoruz. Manuel ve otomatik testler tasarlayacak, geliştirme ekibiyle birlikte
çalışarak ürün kalitesini garanti altına alacaksınız.

SORUMLULUKLAR:
• Kapsamlı test planları ve test senaryoları tasarlamak
• Manuel ve otomatik testler gerçekleştirmek
• Bug takibi ve raporlama (Jira, Trello, vb.)
• Geliştirme ekibiyle kalite standartlarını sağlamak
• Agile süreçlerine aktif katılım
• Regresyon testleri ve smoke testler yürütmek

ARANAN NİTELİKLER:
• Zorunlu:
  - 2-3 yıl yazılım test deneyimi
  - Test metodolojileri ve best practice'ler bilgisi
  - Test otomasyon (Selenium, Cypress, Jest)
  - API testing (Postman, REST Assured)
  - SQL bilgisi
  - Analitik düşünme ve problem çözme becerisi
  - İngilizce teknik dokümantasyon

• Artı:
  - ISTQB sertifikası
  - CI/CD pipeline deneyimi (Jenkins, GitLab CI)
  - Performance testing (JMeter, k6)
  - JavaScript veya Python bilgisi
  - Test-Driven Development (TDD)

ÇALIŞMA KOŞULLARI:
• Hibrit çalışma modeli (3 ofis + 2 remote)
• Özel sağlık sigortası
• Profesyonel gelişim fırsatları (sertifikasyon desteği)
• Takım aktiviteleri ve sosyal etkinlikler

BAŞVURU:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
```

### 2.3: Healthcare Data Analyst (Org 2 - Healthcare/PRO)

**Dosya:** `test-data/job-postings-turkish/org2-healthcare-data-analyst-TR.txt`

```
SAĞLIK VERİSİ ANALİSTİ (HEALTHCARE DATA ANALYST)
MediCare Analytics - Sağlık Teknolojileri
İstanbul / Ankara (Esnek Çalışma)

POZISYON HAKKINDA:
Sağlık verilerini analiz ederek hasta bakım kalitesini artıran, hastane
operasyonlarını optimize eden deneyimli Data Analyst arıyoruz.

SORUMLULUKLAR:
• Hasta verileri, tedavi sonuçları ve hastane operasyonlarını analiz etmek
• Dashboard ve raporlar oluşturmak (Power BI, Tableau)
• Veri kalitesini kontrol etmek ve temizlemek
• Sağlık ekipleri ile işbirliği yaparak insight'lar sunmak
• Predictive analytics ve trend analizi
• KPI takibi ve raporlama

ARANAN NİTELİKLER:
• Zorunlu:
  - 3+ yıl veri analizi deneyimi (tercihen sağlık sektörü)
  - SQL ve veri analiz araçları (Python, R, Excel)
  - Sağlık sektörü bilgisi ve terminoloji
  - İstatistik ve veri görselleştirme
  - KVKK ve hasta gizliliği bilinci
  - İyi seviye İngilizce

• Artı:
  - BI araçları (Tableau, Power BI, Looker)
  - Machine Learning temel bilgisi
  - Hastane Bilgi Sistemleri (HIS) deneyimi
  - ETL süreçleri bilgisi
  - Healthcare IT sertifikaları

ÇALIŞMA KOŞULLARI:
• Esnek çalışma saatleri
• Kapsamlı sağlık sigortası (aile dahil)
• Uzaktan çalışma opsiyonu
• Profesyonel gelişim ve eğitim desteği
• Anlamlı ve sosyal etkisi yüksek iş

BAŞVURU:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
```

### 2.4: Medical Records Specialist (Org 2 - Healthcare/PRO)

**Dosya:** `test-data/job-postings-turkish/org2-medical-records-specialist-TR.txt`

```
TIBBİ KAYIT UZMANI (MEDICAL RECORDS SPECIALIST)
MediCare Analytics - Sağlık Teknolojileri
İstanbul (Yerinde Çalışma)

POZISYON HAKKINDA:
Hasta kayıtlarının yönetimi ve Elektronik Sağlık Kayıt (ESK) sistemlerinin
operasyonundan sorumlu Medical Records Specialist arıyoruz.

SORUMLULUKLAR:
• Hasta kayıtlarını düzenlemek ve arşivlemek
• Elektronik Sağlık Kayıt sistemlerini (ESK/HIS) yönetmek
• KVKK ve hasta mahremiyeti uyumunu sağlamak
• Tıbbi terminoloji ve ICD-10 kodlama
• Hasta bilgi taleplerini karşılamak
• Veri kalitesi kontrolü ve düzeltmeler
• Audit'lere destek vermek

ARANAN NİTELİKLER:
• Zorunlu:
  - 2+ yıl medical records deneyimi
  - ESK sistemleri bilgisi (Epic, Cerner, Nucleus vb.)
  - Tıbbi terminoloji ve ICD-10 kodlama
  - KVKK düzenlemeleri bilgisi
  - Detaylara dikkat ve organizasyon becerisi
  - Sağlık Yönetimi veya ilgili bölüm mezunu

• Artı:
  - Tıbbi Dokümantasyon sertifikası
  - Healthcare compliance eğitimi
  - Medical coding sertifikası
  - İngilizce tıbbi terminoloji
  - Hastane bilgi sistemleri deneyimi

ÇALIŞMA KOŞULLARI:
• Yerinde tam zamanlı pozisyon
• Profesyonel gelişim desteği
• Özel sağlık sigortası
• Yemek ve ulaşım desteği
• Kariyer gelişim fırsatları

BAŞVURU:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
```

### 2.5: Senior Financial Analyst (Org 3 - Finance/ENTERPRISE)

**Dosya:** `test-data/job-postings-turkish/org3-senior-financial-analyst-TR.txt`

```
SENIOR FİNANSAL ANALİST
FinTech Capital - Finansal Hizmetler
İstanbul (Levent / Maslak)

POZISYON HAKKINDA:
Finansal modelleme, bütçe planlama ve stratejik analiz konularında deneyimli
Senior Financial Analyst arıyoruz. Üst düzey yönetim ekibine doğrudan raporlama.

SORUMLULUKLAR:
• Finansal modelleme ve forecasting (3-5 yıllık projeksiyonlar)
• Bütçe planlama ve variance analysis
• Executive sunumlar ve finansal raporlar hazırlamak
• M&A ve yatırım analizi
• KPI takibi ve business intelligence
• Risk analizi ve senaryo modelleme
• Departman bütçe süreçlerini yönetmek

ARANAN NİTELİKLER:
• Zorunlu:
  - 5+ yıl financial analysis deneyimi (tercihen finans sektörü)
  - CFA, ACCA veya SPK lisansı (tercih edilir)
  - İleri seviye Excel ve finansal modelleme
  - ERP sistemleri (SAP, Oracle)
  - TFRS/UFRS bilgisi
  - İleri seviye İngilizce
  - İşletme, Ekonomi veya İlgili bölüm (tercihen YL)

• Artı:
  - Investment banking veya PE deneyimi
  - SQL ve Python bilgisi
  - Power BI/Tableau deneyimi
  - CFA charter holder
  - MBA

ÇALIŞMA KOŞULLARI:
• Rekabetçi maaş paketi
• Performans bonusu
• Hisse senedi opsiyonları
• Özel sağlık sigortası (aile dahil)
• Yurt dışı eğitim ve konferans fırsatları
• Hızlı kariyer gelişimi

BAŞVURU:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
```

### 2.6: Risk Management Specialist (Org 3 - Finance/ENTERPRISE)

**Dosya:** `test-data/job-postings-turkish/org3-risk-management-specialist-TR.txt`

```
RİSK YÖNETİMİ UZMANI (RISK MANAGEMENT SPECIALIST)
FinTech Capital - Finansal Hizmetler
İstanbul (Levent / Maslak)

POZISYON HAKKINDA:
Kurumsal risk yönetimi ve uyum süreçlerinden sorumlu Risk Management Specialist
arıyoruz. BDDK, SPK ve Basel düzenlemelerine uyum sağlayacaksınız.

SORUMLULUKLAR:
• Risk değerlendirmesi ve azaltma stratejileri
• Regulatory compliance monitoring (BDDK, SPK, MASAK)
• Risk raporları ve yönetim kurulu sunumları
• İç kontroller ve audit desteği
• Basel III/IV ve risk frameworks
• Operasyonel risk yönetimi
• Stress testing ve scenario analysis

ARANAN NİTELİKLER:
• Zorunlu:
  - 4+ yıl risk management deneyimi (tercihen bankacılık/finans)
  - FRM, PRM veya benzeri risk sertifikası
  - Finansal regülasyonlar bilgisi (BDDK, SPK)
  - Risk modelleme ve quantitative analysis
  - Bankacılık/finansal hizmetler background
  - İleri seviye İngilizce

• Artı:
  - Kredi riski veya piyasa riski deneyimi
  - Risk yönetim sistemleri (Moody's, S&P)
  - Stress testing ve scenario analysis
  - Yüksek lisans (Risk Yönetimi, Finans, Ekonomi)
  - CFA veya ACCA

ÇALIŞMA KOŞULLARI:
• Hibrit çalışma modeli
• Profesyonel gelişim bütçesi
• Kapsamlı sağlık ve wellness faydaları
• Performans bonusu
• Uluslararası kariyer fırsatları
• Prestijli finans kurumunda çalışma

BAŞVURU:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
```

---

## 🔧 Task 3: CV'leri Oluştur

### 3.1: Org 1 - Junior Frontend Developer CV'leri

#### CV-01: High Match (90-100%)

**Dosya:** `test-data/cvs/org1-junior-frontend-developer/cv-01-high-match.txt`

```
AHMET YILMAZ
Frontend Developer

İLETİŞİM:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
LinkedIn: linkedin.com/in/ahmetyilmaz
GitHub: github.com/ahmetyilmaz
Konum: İstanbul, Türkiye

ÖZET:
2 yıllık deneyime sahip, React ve TypeScript konusunda uzmanlaşmış Junior Frontend Developer.
Modern web teknolojileri ile kullanıcı odaklı, performanslı uygulamalar geliştirme deneyimi.
Next.js, Redux ve responsive design konularında güçlü.

TEKN İK YETKİNLİKLER:
• Frontend: React, TypeScript, JavaScript (ES6+), Next.js
• State Management: Redux Toolkit, Zustand, Context API
• Styling: CSS3, SASS, Tailwind CSS, Styled Components
• API: RESTful API, GraphQL, Axios
• Tools: Git, GitHub, VS Code, npm/yarn, Webpack
• Testing: Jest, React Testing Library
• Design: Responsive Design, Mobile-First, Figma
• Diğer: Agile/Scrum, Code Review, Clean Code

DENEYİM:

Frontend Developer | XYZ Teknoloji | Ocak 2023 - Şu an
• E-ticaret platformu için React ve TypeScript ile responsive web uygulaması geliştirdim
• Next.js ile SEO-friendly landing page'ler oluşturdum (% 40 performans artışı)
• Redux Toolkit ile global state management implement ettim
• Backend ekibi ile RESTful API entegrasyonları gerçekleştirdim
• Figma tasarımlarından pixel-perfect component'ler geliştirdim
• Git flow ve code review süreçlerine aktif katıldım
• Jest ile %80+ test coverage sağladım

Junior Frontend Developer (Stajyer) | ABC Yazılım | Haziran 2022 - Aralık 2022
• React ile kurumsal web uygulaması geliştirdim
• HTML5, CSS3 ve JavaScript ile responsive UI component'leri oluşturdum
• REST API entegrasyonları yaptım
• Agile sprint'lerine katıldım ve daily standup'lara aktif katkı sağladım

EĞİTİM:
Bilgisayar Mühendisliği (Lisans) | İstanbul Teknik Üniversitesi | 2018-2022
• GPA: 3.4/4.0
• Bitirme Projesi: React Native ile mobil uygulama geliştirme

SERTİFİKALAR:
• React - The Complete Guide (Udemy, 2023)
• Advanced TypeScript Programming (Pluralsight, 2023)
• JavaScript Algorithms and Data Structures (freeCodeCamp, 2022)

PROJELER:
• E-Commerce Dashboard: Next.js, TypeScript, Tailwind CSS
• Task Management App: React, Redux, Firebase
• Portfolio Website: Next.js, Framer Motion, Styled Components

DİLLER:
• Türkçe: Ana dil
• İngilizce: İleri seviye (teknik dokümantasyon okuma/yazma)
```

#### CV-02: Good Match (70-80%)

**Dosya:** `test-data/cvs/org1-junior-frontend-developer/cv-02-good-match.txt`

```
AYŞE KAYA
Web Developer

İLETİŞİM:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
GitHub: github.com/aysekaya
Konum: İstanbul, Türkiye

ÖZET:
1.5 yıllık web development deneyimi. React ve JavaScript ile modern web uygulamaları
geliştirme. HTML, CSS ve responsive design konularında deneyimli.

TEKNİK YETKİNLİKLER:
• Frontend: React, JavaScript, HTML5, CSS3
• Styling: CSS3, Bootstrap, Material-UI
• Tools: Git, VS Code, npm
• Basic: TypeScript, REST API
• Design: Responsive Web Design

DENEYİM:

Web Developer | Tech Startup | Mart 2023 - Şu an
• React ile web uygulaması geliştirdim
• Responsive tasarımlar oluşturdum
• API entegrasyonları yaptım
• Team collaboration

Junior Web Developer | Digital Agency | Temmuz 2022 - Şubat 2023
• HTML, CSS, JavaScript ile web siteleri geliştirdim
• jQuery kullanarak interaktif özellikler ekledim
• Git ile versiyon kontrolü

EĞİTİM:
Bilgisayar Programcılığı (Önlisans) | Anadolu Üniversitesi | 2020-2022

SERTİFİKALAR:
• JavaScript Fundamentals (Udemy, 2022)
• React Basics (Coursera, 2023)

DİLLER:
• Türkçe: Ana dil
• İngilizce: Orta seviye
```

#### CV-03: Medium Match (50-60%)

**Dosya:** `test-data/cvs/org1-junior-frontend-developer/cv-03-medium-match.txt`

```
MEHMET DEMİR
Web Tasarımcı / Developer

İLETİŞİM:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
Konum: İstanbul, Türkiye

ÖZET:
Web tasarım ve temel frontend development deneyimi. HTML, CSS ve JavaScript bilgisi mevcut.

TEKNİK YETKİNLİKLER:
• HTML5, CSS3, JavaScript
• jQuery, Bootstrap
• WordPress
• Photoshop, Adobe XD
• Basic Git

DENEYİM:

Web Tasarımcı | Reklam Ajansı | Ocak 2023 - Şu an
• Web sitesi tasarımları
• HTML/CSS ile sayfa kodlama
• WordPress tema özelleştirme

Freelance Web Designer | 2022
• Küçük işletmeler için web siteleri
• Landing page tasarımları

EĞİTİM:
Grafik Tasarım (Önlisans) | 2020-2022

DİLLER:
• Türkçe: Ana dil
• İngilizce: Temel seviye
```

#### CV-04: Low Match (30-40%)

**Dosya:** `test-data/cvs/org1-junior-frontend-developer/cv-04-low-match.txt`

```
FATİH YILDIRIM
IT Support Specialist

İLETİŞİM:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
Konum: İstanbul, Türkiye

ÖZET:
IT destek ve teknik servis deneyimi. Temel HTML/CSS bilgisi mevcut.

YETKİNLİKLER:
• Windows Server, Active Directory
• Network troubleshooting
• Hardware maintenance
• Temel HTML, CSS bilgisi

DENEYİM:

IT Support Specialist | Kurumsal Firma | 2022 - Şu an
• Kullanıcı destek hizmetleri
• Sistem yönetimi
• Teknik sorun giderme

EĞİTİM:
Bilgisayar Teknolojileri (MYO) | 2020-2022

DİLLER:
• Türkçe: Ana dil
```

#### CV-05: Poor Match (10-20%)

**Dosya:** `test-data/cvs/org1-junior-frontend-developer/cv-05-poor-match.txt`

```
ZEYNEP ARSLAN
Pazarlama Uzmanı

İLETİŞİM:
Email: mustafaasan91@gmail.com
Telefon: 05398827540
Konum: İstanbul, Türkiye

ÖZET:
Dijital pazarlama ve sosyal medya yönetimi deneyimi.

YETKİNLİKLER:
• Sosyal medya yönetimi
• Google Ads, Facebook Ads
• SEO/SEM
• İçerik yazarlığı

DENEYİM:

Dijital Pazarlama Uzmanı | E-ticaret Şirketi | 2022 - Şu an
• Sosyal medya kampanyaları
• Google Ads yönetimi
• Content creation

EĞİTİM:
İşletme (Lisans) | 2018-2022

DİLLER:
• Türkçe: Ana dil
• İngilizce: İyi seviye
```

---

### 3.2-3.6: Diğer İlanlar için CV'ler

**Not:** Worker, yukarıdaki pattern'i kullanarak diğer 5 ilan için de CV'ler oluşturacak:

- org1-software-test-engineer (5 CV)
- org2-healthcare-data-analyst (5 CV)
- org2-medical-records-specialist (5 CV)
- org3-senior-financial-analyst (5 CV)
- org3-risk-management-specialist (5 CV)

Her CV:
- İlanla ilgili pozisyona uygun background
- Farklı match yüzdeleri (90-100%, 70-80%, 50-60%, 30-40%, 10-20%)
- Gerçekçi Türk isimleri
- Sabit email: mustafaasan91@gmail.com
- Sabit telefon: 05398827540
- Türkiye iş piyasasına uygun

---

## ✅ Verification Checklist

### Dosya Kontrolü:
```bash
# CV dosyalarını say
find /home/asan/Desktop/ikai/test-data/cvs/ -name "*.txt" | wc -l
# Beklenen: 30 CV (6 ilan × 5 CV)

# İlan dosyalarını say
ls -1 /home/asan/Desktop/ikai/test-data/job-postings-turkish/*.txt | wc -l
# Beklenen: 6 ilan

# Tüm CV'lerde email kontrolü
grep -r "mustafaasan91@gmail.com" /home/asan/Desktop/ikai/test-data/cvs/ | wc -l
# Beklenen: 30

# Tüm CV'lerde telefon kontrolü
grep -r "05398827540" /home/asan/Desktop/ikai/test-data/cvs/ | wc -l
# Beklenen: 30
```

### İçerik Kontrolü:
```bash
# İlanların Türkçe olduğunu kontrol et
head -20 /home/asan/Desktop/ikai/test-data/job-postings-turkish/org1-junior-frontend-developer-TR.txt

# Örnek CV kontrolü
cat /home/asan/Desktop/ikai/test-data/cvs/org1-junior-frontend-developer/cv-01-high-match.txt
```

---

## 📝 Verification Report Template

```markdown
# Test CV'leri ve İş İlanları Hazırlama - Verification Report

**Date:** 2025-11-04
**Executor:** Worker Claude

---

## Dizin Yapısı

\```bash
tree /home/asan/Desktop/ikai/test-data/
\```

**Output:**
\```
[PASTE OUTPUT]
\```

---

## CV Dosya Sayısı

\```bash
find /home/asan/Desktop/ikai/test-data/cvs/ -name "*.txt" | wc -l
\```

**Output:** [NUMBER]
**Beklenen:** 30
**Status:** ✅/❌

---

## İlan Dosya Sayısı

\```bash
ls -1 /home/asan/Desktop/ikai/test-data/job-postings-turkish/*.txt | wc -l
\```

**Output:** [NUMBER]
**Beklenen:** 6
**Status:** ✅/❌

---

## Email/Telefon Kontrolü

\```bash
grep -r "mustafaasan91@gmail.com" /home/asan/Desktop/ikai/test-data/cvs/ | wc -l
grep -r "05398827540" /home/asan/Desktop/ikai/test-data/cvs/ | wc -l
\```

**Email Count:** [NUMBER] (beklenen: 30)
**Telefon Count:** [NUMBER] (beklenen: 30)

---

## Örnek Dosya İçerikleri

### İlan Örneği:
\```
[İlk 30 satırı yapıştır]
\```

### CV Örneği (High Match):
\```
[CV-01'in tamamını yapıştır]
\```

### CV Örneği (Poor Match):
\```
[CV-05'in tamamını yapıştır]
\```

---

## Özet

**Oluşturulan Dosyalar:**
- CV'ler: [COUNT]/30
- İlanlar (TR): [COUNT]/6
- Toplam: [TOTAL] dosya

**Status:** ✅ COMPLETE / ❌ INCOMPLETE

**Gerçek dünyada ne oldu:**
- 6 ilan Türkçeye çevrildi
- Her ilan için 5 gerçekçi CV hazırlandı
- Tüm CV'ler farklı match yüzdeleri için optimize edildi
- Test sisteminde kullanıma hazır
\```

---

## 🚨 ASANMOD_STRICT_MODE

**YASAK:**
- ❌ Placeholder CV'ler yazma
- ❌ "Hazırladım" deyip geçme
- ❌ İngilizce bırakma, hepsi Türkçe
- ❌ Copy-paste CV'ler (her biri unique)

**ZORUNLU:**
- ✅ Her CV gerçekçi ve unique
- ✅ Türkiye iş piyasasına uygun
- ✅ Match yüzdeleri farklı (high → low)
- ✅ Tüm dosyalar .txt format
- ✅ Email/telefon tüm CV'lerde aynı

---

## 📌 Önemli Notlar

1. **CV Pattern:** High match = ilanda istenen tüm beceriler + deneyim var
2. **Low match:** Alakasız pozisyon (ama gerçekçi bir CV)
3. **Türkçe Terminoloji:** Güncel Türkiye iş ilanlarındaki terimleri kullan
4. **Gerçekçilik:** Her CV gerçek bir kişinin CV'si gibi olmalı
5. **Test Amacı:** Bu CV'ler RBAC testlerinde kullanılacak

---

**Başarılar Worker! 30 gerçekçi CV oluşturacaksın! 📄**
