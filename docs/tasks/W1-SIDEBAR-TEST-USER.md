# 👤 W1: Sidebar Verification - USER Role

**Worker:** W1
**Test Role:** USER
**Duration:** 15 minutes
**AsanMod:** v15.7

---

## 🎯 YOUR MISSION

Login as USER, verify sidebar shows ONLY basic pages!

---

## 🔐 LOGIN

```
Incognito: Ctrl + Shift + N
URL: http://localhost:8103/login
Email: test-user@test-org-1.com
Password: TestPass123!
```

---

## ✅ EXPECTED SIDEBAR (USER)

**Should SEE (4 main items):**
```
1. Dashboard
2. Bildirimler
3. Yardım
4. Ayarlar ▼
   - Genel Bakış
   - Profil
   - Güvenlik
   - Bildirim Tercihleri
```

**Should NOT SEE:**
```
❌ İş İlanları (HR only!)
❌ Adaylar (HR only!)
❌ Analiz Sihirbazı (HR only!)
❌ Teklifler (HR only!)
❌ Mülakatlar (HR only!)
❌ Takım (MANAGER+ only!)
❌ Analitik (MANAGER+ only!)
❌ Sistem Yönetimi (SUPER_ADMIN only!)
```

**Settings submenu should NOT have:**
```
❌ Organizasyon (MANAGER+ only!)
❌ Fatura ve Plan (MANAGER+ only!)
```

---

## 📊 VERIFICATION

**Count:**
- Main items: 4
- Settings submenu items: 4
- Total clickable items: 8

**Test:**
```python
import requests

BASE = 'http://localhost:8102'

# Login as USER
login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'test-user@test-org-1.com',
                           'password': 'TestPass123!'})

if login.status_code == 200:
    print('✅ USER login OK')
    user = login.json()['user']
    print(f'   Role: {user["role"]}')
else:
    print(f'❌ Login FAILED: {login.status_code}')
```

---

## 📋 REPORT

**File:** `docs/reports/w1-sidebar-user-verification.md`

```markdown
# W1: USER Role Sidebar Verification

**Date:** 2025-11-04
**Role Tested:** USER
**Login:** test-user@test-org-1.com

## Results

**Main Items:** 4
- Dashboard ✅
- Bildirimler ✅
- Yardım ✅
- Ayarlar ✅

**Hidden (Correct):**
- İş İlanları ❌ (not visible - CORRECT!)
- Adaylar ❌ (not visible - CORRECT!)
- Analiz ❌ (not visible - CORRECT!)
- Teklifler ❌ (not visible - CORRECT!)
- Takım ❌ (not visible - CORRECT!)
- Sistem Yönetimi ❌ (not visible - CORRECT!)

**Settings Submenu:** 4 items
- Genel Bakış ✅
- Profil ✅
- Güvenlik ✅
- Bildirim Tercihleri ✅
- Organizasyon ❌ (hidden - CORRECT!)
- Fatura ❌ (hidden - CORRECT!)

**Status:** ✅ CORRECT - USER sees only basic pages!
```

**Commit:**
```bash
git add docs/reports/w1-sidebar-user-verification.md
git commit -m "test(w1): USER sidebar verification - 4 items correct"
```

---

**LOGIN → COUNT → COMPARE → REPORT!**
