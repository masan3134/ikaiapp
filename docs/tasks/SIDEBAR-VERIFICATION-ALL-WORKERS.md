# 🔍 Sidebar Visibility Verification - All 5 Roles

**Mission:** Her worker kendi rolü + tüm rollerde sidebar'ı test eder
**Duration:** 5 workers × 15 min = 1.25 hours (parallel)
**Priority:** CRITICAL (UI/UX doğrulaması!)
**AsanMod:** v15.7

---

## 🎯 MISSION

W1 sidebar'ı güncelledi → Her worker kendi rolünde doğru mu verify et!

**Each Worker Tests:**
1. Login as THEIR role
2. Count sidebar items
3. Verify expected items visible
4. Verify forbidden items HIDDEN
5. Screenshot (optional)
6. Report results

---

## 📋 WORKER ASSIGNMENTS

### W1: Test USER Role
### W2: Test HR_SPECIALIST Role
### W3: Test MANAGER Role
### W4: Test ADMIN Role
### W5: Test SUPER_ADMIN Role

**Each worker tests their OWN role ONLY!**

---

## 🔧 TESTING PROTOCOL

### Step 1: Login (Incognito!)

```
1. Open Incognito: Ctrl + Shift + N
2. Go to: http://localhost:8103/login
3. Login with YOUR role credentials:
   - USER: test-user@test-org-1.com / TestPass123!
   - HR: test-hr_specialist@test-org-2.com / TestPass123!
   - MANAGER: test-manager@test-org-2.com / TestPass123!
   - ADMIN: test-admin@test-org-1.com / TestPass123!
   - SUPER_ADMIN: info@gaiai.ai / 23235656
```

### Step 2: Count Sidebar Items

```
Manually count all sidebar items (main level only)

Example:
1. Dashboard
2. Bildirimler
3. İş İlanları
...

Total: X items
```

### Step 3: Expand Submenus

```
Click each submenu (▼) and count sub-items:

Teklifler ▼
  - Tüm Teklifler
  - Yeni Teklif
  - Şablonlar
  - Analitik (if MANAGER+)

Total submenu items: X
```

### Step 4: Compare with Expected

```
Check against your expected list (below)

Expected: X items
Actual: X items
Match: ✅/❌
```

### Step 5: Report

```markdown
## [ROLE] Sidebar Verification

**Login:** ✅ Success
**Sidebar items:** X
**Expected:** X
**Match:** ✅

**Visible items:**
- Dashboard ✅
- ... (list all)

**Hidden items (as expected):**
- ... (items you shouldn't see)

**Submenus:**
- Teklifler: X items
- Ayarlar: X items
- Sistem Yönetimi: X items (if SA)

**Status:** ✅ CORRECT
```

---

## 📊 EXPECTED SIDEBARS BY ROLE

(Detailed in individual worker prompts)

---

**Each worker: Read your individual prompt for expected sidebar!**
