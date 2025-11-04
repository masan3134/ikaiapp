# 📊 W3: Sidebar Verification - MANAGER Role

**Worker:** W3
**Test Role:** MANAGER
**Duration:** 15 minutes

---

## 🔐 LOGIN

```
Incognito: Ctrl + Shift + N
Email: test-manager@test-org-2.com
Password: TestPass123!
```

---

## ✅ EXPECTED SIDEBAR (MANAGER)

**Should SEE (12 main items):**
```
1. Dashboard
2. Bildirimler
3. İş İlanları
4. Adaylar
5. Analiz Sihirbazı
6. Geçmiş Analizlerim
7. Teklifler ▼ (4 submenu items!)
   - Tüm Teklifler
   - Yeni Teklif
   - Şablonlar
   - Analitik ✅ (MANAGER can see!)
8. Mülakatlar
9. Takım ✅ (MANAGER+!)
10. Analitik ✅ (MANAGER+!)
11. Yardım
12. Ayarlar ▼ (6 submenu items!)
    - Genel Bakış
    - Profil
    - Güvenlik
    - Bildirim Tercihleri
    - Organizasyon ✅ (MANAGER+!)
    - Fatura ve Plan ✅ (MANAGER+!)
```

**Should NOT SEE:**
```
❌ Sistem Yönetimi (SUPER_ADMIN only!)
```

---

## 📊 VERIFICATION

**Count:**
- Main: 12
- Teklifler submenu: 4 (including Analitik!)
- Ayarlar submenu: 6 (full settings!)
- Total: 12 + 4 + 6 = 22 items

---

## 📋 REPORT

**File:** `docs/reports/w3-sidebar-manager-verification.md`

**Status:** ✅ MANAGER sees team management + analytics!
