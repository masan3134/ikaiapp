# W1: Deep Integration Test - USER Role

**Worker:** W1
**Role:** USER
**Pages:** 7
**Duration:** 30 min
**AsanMod:** v15.7

---

## 🎯 GÖREV

USER role için **TÜM sayfaları test et:**
- Sayfa yükleniyor mu?
- Buttonlar çalışıyor mu?
- API çağrıları yapılıyor mu?
- Console error var mı?
- Fake button var mı?

---

## 🔐 LOGIN

```
Email: test-user@test-org-1.com
Password: TestPass123!
```

---

## 📄 TEST EDİLECEK SAYFALAR (7)

1. `/dashboard` - Ana sayfa
2. `/notifications` - Bildirimler
3. `/help` - Yardım
4. `/settings/overview` - Ayarlar genel
5. `/settings/profile` - Profil
6. `/settings/security` - Güvenlik
7. `/settings/notifications` - Bildirim tercihleri

---

## ✅ BEKLENTİLER

**Dashboard:**
- Widget'lar yüklensin
- API: /auth/me, /organizations/me, /notifications/unread-count
- Minimum 5 widget

**Notifications:**
- Bildirim listesi
- Mark as read button
- API: /notifications

**Help:**
- FAQ accordion
- İletişim formu
- Submit button çalışsın

**Settings/Profile:**
- Form: name, email inputs
- Save button
- API: PATCH /auth/profile

**Settings/Security:**
- Change password form
- Current/New password inputs
- API: PATCH /auth/password

**Settings/Notifications:**
- Checkbox'lar (email, push, SMS)
- Save preferences button
- API: PATCH /settings/notifications

---

## 🤖 PUPPETEER SCRIPT

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

const pages = [
  '/dashboard',
  '/notifications',
  '/help',
  '/settings/overview',
  '/settings/profile',
  '/settings/security',
  '/settings/notifications'
];

async function testUserRole() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];
  const errors = [];

  // Console error tracking
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // Login
  await page.goto('http://localhost:8103/login');
  await page.type('input[type="email"]', 'test-user@test-org-1.com');
  await page.type('input[type="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ timeout: 15000 });

  // Test each page
  for (const pagePath of pages) {
    console.log(`Testing: ${pagePath}`);

    await page.goto(`http://localhost:8103${pagePath}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(r => setTimeout(r, 2000));

    // Screenshot
    await page.screenshot({
      path: `test-outputs/w1-user${pagePath.replace(/\//g, '-')}.png`,
      fullPage: true
    });

    // Count elements
    const buttons = await page.$$('button');
    const inputs = await page.$$('input');
    const forms = await page.$$('form');

    results.push({
      path: pagePath,
      buttons: buttons.length,
      inputs: inputs.length,
      forms: forms.length,
      errors: errors.length
    });

    console.log(`  Buttons: ${buttons.length}, Inputs: ${inputs.length}, Errors: ${errors.length}`);
  }

  await browser.close();

  // Save results
  fs.writeFileSync('test-outputs/w1-user-results.json', JSON.stringify(results, null, 2));

  console.log(`\n✅ W1 (USER) Test Complete!`);
  console.log(`Pages tested: ${results.length}`);
  console.log(`Total errors: ${errors.length}`);
}

testUserRole().catch(console.error);
```

**Çalıştır:**
```bash
cd /home/asan/Desktop/ikai
node -e "$(cat docs/tasks/W1-DEEP-TEST-USER.md | sed -n '/```javascript/,/```/p' | sed '1d;$d')"
```

---

## 📋 VERIFICATION CHECKLIST

**Her sayfa için kontrol et:**
- [ ] Sayfa yüklendi (200 OK)
- [ ] Screenshot alındı
- [ ] Button sayısı > 0
- [ ] Console error = 0
- [ ] API çağrıları yapıldı

**Fake button tespiti:**
- [ ] Button var ama onClick yok mu?
- [ ] Button disabled değil ama hiçbir şey yapmıyor mu?

**API flow:**
- [ ] Frontend → Backend iletişimi var mı?
- [ ] Response 200 OK mu?
- [ ] Data UI'da gösteriliyor mu?

---

## 📊 RAPOR FORMATI

**Dosya:** `docs/reports/w1-deep-test-user.md`

```markdown
# W1: USER Deep Test Report

**Date:** 2025-11-04
**Role:** USER
**Pages Tested:** 7

## Results

| Page | Buttons | Inputs | Forms | Errors | Status |
|------|---------|--------|-------|--------|--------|
| /dashboard | X | X | X | 0 | ✅ |
| /notifications | X | X | X | 0 | ✅ |
| ... | ... | ... | ... | ... | ... |

## Bugs Found

1. **[Page]** - [Issue]
2. ...

## API Calls Verified

- GET /auth/me ✅
- GET /organizations/me ✅
- ...

## Console Errors

[Paste exact errors or "No errors"]

## Screenshots

- test-outputs/w1-user-dashboard.png
- ...

## Summary

✅ All 7 pages loaded
✅ No console errors
❌ X fake buttons found
✅ API integration working

**Status:** PASS/FAIL
```

---

## 🚨 KURALLAR

1. **Console error gördüysen:** HEMEN raporla, screenshot al!
2. **Fake button bulduysan:** Button text + hangi sayfa + neden fake (onClick yok)
3. **API çağrısı olmayan sayfa:** Raporla (mock data kullanıyor olabilir!)
4. **Her sayfa için screenshot:** MUTLAKA al!
5. **Commit:** Her bug fix sonrası commit!

---

**W1, başla!** 🚀

**Bitince:** `docs/reports/w1-deep-test-user.md` dosyasını oluştur ve commit et!
