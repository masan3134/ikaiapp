# 👑 W4: Sidebar Verification - ADMIN Role

**Worker:** W4
**Test Role:** ADMIN
**Duration:** 15 minutes

---

## 🔐 LOGIN

```
Incognito: Ctrl + Shift + N
Email: test-admin@test-org-1.com
Password: TestPass123!
```

---

## ✅ EXPECTED SIDEBAR (ADMIN)

**Should SEE (12 main items - same as MANAGER!):**
```
1. Dashboard
2. Bildirimler
3. İş İlanları
4. Adaylar
5. Analiz Sihirbazı
6. Geçmiş Analizlerim
7. Teklifler ▼ (4 submenu)
8. Mülakatlar
9. Takım ✅
10. Analitik ✅
11. Yardım
12. Ayarlar ▼ (6 submenu)
```

**Should NOT SEE:**
```
❌ Sistem Yönetimi (SUPER_ADMIN only!)
```

---

## 📊 VERIFICATION

**Count:** 12 main, 4 teklifler, 6 ayarlar = 22 total

---

## 📋 REPORT

**File:** `docs/reports/w4-sidebar-admin-verification.md`

**Status:** ✅ ADMIN same as MANAGER (both full access except system!)
