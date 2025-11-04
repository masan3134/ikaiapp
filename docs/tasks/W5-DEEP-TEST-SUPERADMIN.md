# W5: Deep Integration Test - SUPER_ADMIN Role

**Worker:** W5
**Role:** SUPER_ADMIN
**Pages:** 22 (ALL pages!)
**Duration:** 60 min

---

## 🔐 LOGIN

```
Email: info@gaiai.ai
Password: 23235656
```

---

## 📄 PAGES (22)

**All pages (18) + SUPER_ADMIN-specific (4):**
19. `/super-admin/organizations` - Organizasyon yönetimi
20. `/super-admin/queues` - Kuyruk yönetimi
21. `/super-admin/security-logs` - Güvenlik logları
22. `/super-admin/system-health` - Sistem sağlığı

---

## ✅ SUPER_ADMIN TESTS

**Organizations:**
- [ ] Tüm org'lar listeleniyor mu? (cross-org!)
- [ ] Org detayları açılıyor mu?
- [ ] Plan değiştirme butonu var mı?
- [ ] API: GET /super-admin/organizations

**Queues:**
- [ ] Queue listesi (analysis, offer, email, test, feedback)
- [ ] Job count gösteriliyor mu?
- [ ] Pause/Resume butonları çalışıyor mu?
- [ ] API: GET /queue/health

**Security Logs:**
- [ ] Login logları listeleniyor mu?
- [ ] Filter (date, user, action) çalışıyor mu?
- [ ] Export CSV butonu var mı?

**System Health:**
- [ ] CPU/Memory metrikler var mı?
- [ ] Database connection status gösteriliyor mu?
- [ ] Redis, Milvus, Ollama status'leri var mı?

---

## 🤖 TEST SCRIPT

```javascript
const puppeteer = require('puppeteer');

const pages = [
  // All previous pages (18)
  '/dashboard', '/notifications', '/job-postings', '/candidates',
  '/wizard', '/analyses', '/offers', '/interviews',
  '/team', '/analytics', '/offers/analytics',
  '/settings/overview', '/settings/profile', '/settings/security',
  '/settings/notifications', '/settings/organization', '/settings/billing',
  '/help',
  // SUPER_ADMIN pages (4)
  '/super-admin/organizations',
  '/super-admin/queues',
  '/super-admin/security-logs',
  '/super-admin/system-health'
];

// ... (similar script)
```

---

## 📊 RAPOR

**Dosya:** `docs/reports/w5-deep-test-superadmin.md`

**KRİTİK:**
- Cross-org verification (SA sees all orgs!)
- System-level features
- Complete platform coverage

**W5, başla!** 🚀
