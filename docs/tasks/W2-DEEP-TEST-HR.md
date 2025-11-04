# W2: Deep Integration Test - HR_SPECIALIST Role

**Worker:** W2
**Role:** HR_SPECIALIST
**Pages:** 16 (10 main + 6 settings)
**Duration:** 45 min

---

## 🔐 LOGIN

```
Email: test-hr_specialist@test-org-2.com
Password: TestPass123!
```

---

## 📄 TEST PAGES (16)

**Main Pages (10):**
1. `/dashboard` - HR Dashboard
2. `/notifications`
3. `/job-postings` - İş İlanları listesi
4. `/job-postings/new` - Yeni ilan oluştur
5. `/candidates` - Adaylar listesi
6. `/wizard` - Analiz sihirbazı
7. `/analyses` - Geçmiş analizler
8. `/offers` - Teklifler
9. `/offers/wizard` - Yeni teklif
10. `/interviews` - Mülakatlar

**Settings Pages (6):**
11. `/settings/overview`
12. `/settings/profile`
13. `/settings/security`
14. `/settings/notifications`
15. `/help`
16. `/` (any HR-specific page)

---

## ✅ KRİTİK TESTLER

**Job Postings:**
- [ ] Liste yüklendi mi?
- [ ] "Yeni İlan" butonu çalışıyor mu?
- [ ] API: GET /job-postings

**Candidates:**
- [ ] Aday listesi var mı?
- [ ] Upload CV butonu var mı?
- [ ] Filter/search çalışıyor mu?

**Wizard (Analiz):**
- [ ] Dosya upload alanı var mı?
- [ ] "Analizi Başlat" butonu çalışıyor mu?
- [ ] API: POST /analyses/wizard

**Offers:**
- [ ] Teklif listesi yüklendi mi?
- [ ] "Yeni Teklif" butonu var mı?
- [ ] Şablonlar sayfası açılıyor mu?

**Interviews:**
- [ ] Mülakat listesi var mı?
- [ ] Takvim görünümü var mı?

---

## 🤖 PUPPETEER SCRIPT

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

const pages = [
  '/dashboard',
  '/notifications',
  '/job-postings',
  '/job-postings/new',
  '/candidates',
  '/wizard',
  '/analyses',
  '/offers',
  '/offers/wizard',
  '/interviews',
  '/settings/overview',
  '/settings/profile',
  '/settings/security',
  '/settings/notifications',
  '/help'
];

async function testHRRole() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // Login
  await page.goto('http://localhost:8103/login');
  await page.type('input[type="email"]', 'test-hr_specialist@test-org-2.com');
  await page.type('input[type="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ timeout: 15000 });

  // Test each page
  for (const pagePath of pages) {
    console.log(`Testing: ${pagePath}`);

    try {
      await page.goto(`http://localhost:8103${pagePath}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await new Promise(r => setTimeout(r, 2000));

      // Screenshot
      await page.screenshot({
        path: `test-outputs/w2-hr${pagePath.replace(/\//g, '-')}.png`,
        fullPage: true
      });

      // Count elements
      const buttons = await page.$$('button');
      const inputs = await page.$$('input');
      const forms = await page.$$('form');
      const tables = await page.$$('table');

      results.push({
        path: pagePath,
        loaded: true,
        buttons: buttons.length,
        inputs: inputs.length,
        forms: forms.length,
        tables: tables.length,
        errors: errors.length
      });

      console.log(`  ✅ Loaded - Buttons: ${buttons.length}, Forms: ${forms.length}`);
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}`);
      results.push({
        path: pagePath,
        loaded: false,
        error: error.message
      });
    }
  }

  await browser.close();

  // Save
  fs.writeFileSync('test-outputs/w2-hr-results.json', JSON.stringify(results, null, 2));

  console.log(`\n✅ W2 (HR_SPECIALIST) Test Complete!`);
  console.log(`Pages tested: ${results.length}`);
  console.log(`Failed: ${results.filter(r => !r.loaded).length}`);
  console.log(`Total errors: ${errors.length}`);
}

testHRRole().catch(console.error);
```

---

## 📋 ÖZEL KONTROLLER

**HR Features:**
- [ ] Job postings CRUD çalışıyor mu?
- [ ] CV upload var mı?
- [ ] Analiz wizard step-by-step ilerliyor mu?
- [ ] Offer creation form dolu mu (placeholder değil!)?

**Fake Button Detection:**
- [ ] "Yeni İlan" butonu onClick var mı?
- [ ] "Analizi Başlat" gerçekten API çağırıyor mu?
- [ ] "Kaydet" butonları çalışıyor mu?

---

## 📊 RAPOR

**Dosya:** `docs/reports/w2-deep-test-hr.md`

**İçerik:**
- 16 sayfa test sonuçları
- Her sayfadaki form/button sayısı
- Bulunan bug'lar (fake buttons, console errors)
- API integration status
- Screenshots listesi

---

**W2, başla!** 🚀
