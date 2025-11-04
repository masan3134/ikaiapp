# W1: USER Role Sidebar Verification

**Date:** 2025-11-04
**Worker:** W1 (Claude)
**Role Tested:** USER
**Test Method:** Code analysis (layout.tsx)
**Login Credentials:** test-user@test-org-1.com

---

## 🚨 CRITICAL BUG FOUND

**Expected Sidebar:** 4 main items (Dashboard, Bildirimler, Yardım, Ayarlar)

**Actual Sidebar (from code):** 10 main items

---

## 📊 CODE ANALYSIS RESULTS

### File Analyzed
```
/home/asan/Desktop/ikai/frontend/app/(authenticated)/layout.tsx
Lines: 62-99 (allMenuItems array)
```

### Items USER WILL SEE (Code Evidence)

**Main Menu (10 items):**
1. ✅ Dashboard (line 64) - Always visible
2. ✅ Bildirimler (line 66) - Always visible
3. ❌ İş İlanları (line 68) - **BUG: NO role check!**
4. ❌ Adaylar (line 70) - **BUG: NO role check!**
5. ❌ Analiz Sihirbazı (line 72) - **BUG: NO role check!**
6. ❌ Geçmiş Analizlerim (line 74) - **BUG: NO role check!**
7. ❌ Teklifler (line 76) - **BUG: NO role check!**
8. ❌ Mülakatlar (line 78) - **BUG: NO role check!**
9. ✅ Yardım (line 96) - Always visible
10. ✅ Ayarlar (line 98) - Always visible (has submenu)

**Settings Submenu (4 visible, 2 hidden):**
- ✅ Genel Bakış (line 116, show: true)
- ✅ Profil (line 117, show: true)
- ✅ Güvenlik (line 118, show: true)
- ✅ Bildirim Tercihleri (line 119, show: true)
- ❌ Organizasyon (lines 120-125, MANAGER+ check - CORRECT!)
- ❌ Fatura ve Plan (lines 126-131, MANAGER+ check - CORRECT!)

---

## 🔍 BUG DETAILS

### Missing Role Checks (Lines 68-78)

**Current Code:**
```typescript
// Line 68
{ name: "İş İlanları", path: "/job-postings", icon: Briefcase },
// Line 70
{ name: "Adaylar", path: "/candidates", icon: Users },
// Line 72
{ name: "Analiz Sihirbazı", path: "/wizard", icon: Wand2 },
// Line 74
{ name: "Geçmiş Analizlerim", path: "/analyses", icon: Clock },
// Line 76
{ name: "Teklifler", path: "/offers", icon: FileText, hasSubmenu: true },
// Line 78
{ name: "Mülakatlar", path: "/interviews", icon: Calendar },
```

**Problem:** NO conditional rendering like lines 80-84 (Takım) or 86-90 (Analitik)!

**Should be:**
```typescript
// HR workflow items should check role like this:
...(user?.role === "HR_SPECIALIST" ||
user?.role === "MANAGER" ||
user?.role === "ADMIN" ||
user?.role === "SUPER_ADMIN"
  ? [{ name: "İş İlanları", path: "/job-postings", icon: Briefcase }]
  : []),
```

---

## ✅ WHAT'S CORRECT

**Role checks WORKING for:**
- Takım (lines 80-84) - MANAGER+ only ✅
- Analitik (lines 86-90) - MANAGER+ only ✅
- Sistem Yönetimi (lines 92-94) - SUPER_ADMIN only ✅
- Settings → Organizasyon (lines 120-125) - MANAGER+ only ✅
- Settings → Fatura (lines 126-131) - MANAGER+ only ✅

---

## 📊 VERIFICATION SUMMARY

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Main items visible | 4 | 10 | ❌ FAIL |
| Dashboard visible | Yes | Yes | ✅ |
| Bildirimler visible | Yes | Yes | ✅ |
| Yardım visible | Yes | Yes | ✅ |
| Ayarlar visible | Yes | Yes | ✅ |
| Settings submenu | 4 items | 4 items | ✅ |
| HR features hidden | Yes | **NO** | ❌ FAIL |
| İş İlanları hidden | Yes | **NO (visible!)** | ❌ BUG |
| Adaylar hidden | Yes | **NO (visible!)** | ❌ BUG |
| Analiz hidden | Yes | **NO (visible!)** | ❌ BUG |
| Teklifler hidden | Yes | **NO (visible!)** | ❌ BUG |
| Mülakatlar hidden | Yes | **NO (visible!)** | ❌ BUG |
| Takım hidden | Yes | Yes | ✅ |
| Analitik hidden | Yes | Yes | ✅ |

---

## 🎯 IMPACT

**Severity:** 🔴 CRITICAL (USER sees all HR features!)

**Security Risk:**
- USER role can see HR menu items
- May attempt to access HR pages (backend should block, but UI shouldn't show)
- Poor UX (confusing for basic users)

**Affected Users:**
- All USER role accounts
- Test account: test-user@test-org-1.com

---

## 🛠️ RECOMMENDED FIX

**File:** `frontend/app/(authenticated)/layout.tsx`

**Lines to fix:** 68, 70, 72, 74, 76, 78

**Add conditional rendering:**
```typescript
// 3. İş İlanları (HR workflow start - HR_SPECIALIST+)
...(user?.role === "HR_SPECIALIST" ||
user?.role === "MANAGER" ||
user?.role === "ADMIN" ||
user?.role === "SUPER_ADMIN"
  ? [
      { name: "İş İlanları", path: "/job-postings", icon: Briefcase },
      { name: "Adaylar", path: "/candidates", icon: Users },
      { name: "Analiz Sihirbazı", path: "/wizard", icon: Wand2 },
      { name: "Geçmiş Analizlerim", path: "/analyses", icon: Clock },
      { name: "Teklifler", path: "/offers", icon: FileText, hasSubmenu: true },
      { name: "Mülakatlar", path: "/interviews", icon: Calendar },
    ]
  : []),
```

**Alternative:** Define `RoleGroups.HR_MANAGERS` constant and use:
```typescript
...(RoleGroups.HR_MANAGERS.includes(user?.role)
  ? [/* HR items */]
  : []),
```

---

## 📝 BACKEND LOGIN TEST

**Verification Command:**
```python
import requests

BASE = 'http://localhost:8102'

login = requests.post(f'{BASE}/api/v1/auth/login',
                     json={'email': 'test-user@test-org-1.com',
                           'password': 'TestPass123!'})

if login.status_code == 200:
    user = login.json()['user']
    print(f'Role: {user["role"]}')
```

**Output:**
```
✅ USER login OK
   Email: test-user@test-org-1.com
   Role: USER
   Token: eyJhbGciOiJIUzI1NiIs...
```

**Backend login:** ✅ Working

---

## 🔐 CODE EVIDENCE

**Settings submenu role checks (CORRECT pattern):**

```typescript
// Line 120-125 (Organizasyon)
{
  name: "Organizasyon",
  path: "/settings/organization",
  icon: Building2,
  show: user?.role === "MANAGER" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
},
```

**This pattern MISSING for HR features (lines 68-78)!**

---

## ⚠️ WORKER SCOPE NOTE

**As W1, I am REPORTING this bug, not fixing it.**

**Reason:**
- This is a SHARED file (`layout.tsx`)
- Affects ALL roles (W1-W5 testing)
- Requires Mod coordination
- Fix impacts multiple workers' tests

**Next Steps:**
1. Report to Mod
2. Mod decides: Fix now or after all 5 workers test
3. If fixed: All workers re-test

---

## ✅ VERIFICATION STATUS

**Code Analysis:** ✅ Complete
**Bug Detection:** ✅ Found 6 missing role checks
**Backend Test:** ✅ Login works
**Browser Test:** ⏭️ Skipped (code analysis sufficient for bug detection)

**Recommendation:** 🔴 **FIX REQUIRED before marking sidebar complete!**

---

**W1 Signature:** Claude (Sonnet 4.5) | 2025-11-04

**Report File:** `docs/reports/w1-sidebar-user-verification.md`
