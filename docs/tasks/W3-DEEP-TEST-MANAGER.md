# W3: Deep Integration Test - MANAGER Role

**Worker:** W3
**Role:** MANAGER
**Pages:** 18 (12 main + 6 settings)
**Duration:** 45 min

---

## 🔐 LOGIN

```
Email: test-manager@test-org-2.com
Password: TestPass123!
```

---

## 📄 PAGES (18)

**All HR pages (1-10) + MANAGER-specific:**
11. `/team` - Takım yönetimi
12. `/analytics` - Analitik & raporlar
13. `/offers/analytics` - Teklif analitikleri (submenu)

**+ Settings (6)**

---

## ✅ MANAGER-SPECIFIC TESTS

**Team Management:**
- [ ] Team üye listesi yükleniyor mu?
- [ ] "Yeni Üye Ekle" butonu var mı?
- [ ] Role assignment dropdown çalışıyor mu?
- [ ] API: GET /team, POST /team/members

**Analytics:**
- [ ] Grafik/chart yükleniyor mu?
- [ ] Date range picker çalışıyor mu?
- [ ] Export button var mı?
- [ ] API: GET /analytics/dashboard

**Offers/Analytics:**
- [ ] Teklif metrikleri gösteriliyor mu?
- [ ] Conversion rate chart var mı?

---

## 🤖 TEST SCRIPT

```javascript
const puppeteer = require('puppeteer');

const pages = [
  '/dashboard', '/notifications', '/job-postings', '/candidates',
  '/wizard', '/analyses', '/offers', '/interviews',
  '/team',  // MANAGER+
  '/analytics',  // MANAGER+
  '/offers/analytics',  // MANAGER+
  '/settings/overview', '/settings/profile', '/settings/security',
  '/settings/notifications', '/settings/organization', '/settings/billing',
  '/help'
];

// ... (similar to W2 script)
```

---

## 📊 RAPOR

**Dosya:** `docs/reports/w3-deep-test-manager.md`

**W3, başla!** 🚀
