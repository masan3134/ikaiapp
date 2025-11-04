# 👔 W2: Sidebar Verification - HR_SPECIALIST Role

**Worker:** W2
**Test Role:** HR_SPECIALIST
**Duration:** 15 minutes

---

## 🔐 LOGIN

```
Incognito: Ctrl + Shift + N
URL: http://localhost:8103/login
Email: test-hr_specialist@test-org-2.com
Password: TestPass123!
```

---

## ✅ EXPECTED SIDEBAR (HR_SPECIALIST)

**Should SEE (10 main items):**
```
1. Dashboard
2. Bildirimler
3. İş İlanları ✅ (HR access!)
4. Adaylar ✅ (HR access!)
5. Analiz Sihirbazı ✅ (HR access!)
6. Geçmiş Analizlerim ✅ (HR access!)
7. Teklifler ▼ (HR access!)
   - Tüm Teklifler
   - Yeni Teklif
   - Şablonlar
   (NO Analitik - MANAGER+ only!)
8. Mülakatlar ✅ (HR access!)
9. Yardım
10. Ayarlar ▼
    - 4 basic items only
```

**Should NOT SEE:**
```
❌ Takım (MANAGER+ only!)
❌ Analitik (MANAGER+ only!)
❌ Sistem Yönetimi (SUPER_ADMIN only!)
```

**Teklifler submenu should NOT have:**
```
❌ Analitik (MANAGER+ only!)
```

**Settings submenu should NOT have:**
```
❌ Organizasyon (MANAGER+ only!)
❌ Fatura (MANAGER+ only!)
```

---

## 📊 VERIFICATION

**Count:**
- Main items: 10
- Teklifler submenu: 3 (not 4!)
- Settings submenu: 4
- Total: 10 + 3 + 4 = 17 items

---

## 📋 REPORT

**File:** `docs/reports/w2-sidebar-hr-verification.md`

**Status:** ✅ CORRECT - HR sees recruitment features, NOT management features!
