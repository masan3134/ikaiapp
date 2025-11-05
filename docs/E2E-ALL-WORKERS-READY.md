# E2E Test - All Workers Ready Guide

**Date:** 2025-11-05
**Status:** ✅ 4/6 Templates Ready, Prompts Ready
**Backend:** 142+ endpoints mapped, running, tested

---

## 🎯 Quick Summary

| Worker | Role | Score | Status | Template | Prompt | Action |
|--------|------|-------|--------|----------|--------|--------|
| **W1** | USER | 62% | 🔄 REDO | ✅ Ready | ✅ Ready | START NOW |
| **W2** | HR_SPECIALIST | 35% | 🔄 REDO | ✅ Ready | ✅ Ready | START NOW |
| **W3** | MANAGER | 75% | 🔄 REDO | ✅ **NEW!** | ✅ **NEW!** | START NOW |
| **W4** | ADMIN | 70% | 🔄 REDO | ✅ **NEW!** | ✅ **NEW!** | START NOW |
| **W5** | SUPER_ADMIN | 80% | ✅ DONE | N/A | N/A | NO ACTION |
| **W6** | CROSS_ROLE | 60% | ⏸️ WAIT | ⏸️ Pending | ⏸️ Pending | DEFINE TASK |

---

## 📁 File Locations

### Templates (4 ready)
```
scripts/templates/
├── e2e-user-journey-template.py        ← W1 (USER)
├── e2e-hr-journey-template.py          ← W2 (HR_SPECIALIST)
├── e2e-manager-journey-template.py     ← W3 (MANAGER) 🆕
└── e2e-admin-journey-template.py       ← W4 (ADMIN) 🆕
```

### Prompts (6 files)
```
prompts/
├── PROMPT-W1-FINAL-WITH-TEMPLATES.txt      ← W1
├── PROMPT-W2-FINAL-WITH-TEMPLATES.txt      ← W2
├── PROMPT-W3-MANAGER-FINAL-WITH-TEMPLATE.txt  ← W3 🆕
├── PROMPT-W4-ADMIN-FINAL-WITH-TEMPLATE.txt    ← W4 🆕
└── PROMPT-W5-W6-STATUS.txt                    ← W5 + W6 status
```

### Documentation
```
docs/
├── E2E-TEST-TEMPLATES-GUIDE.md           ← Full template guide
├── E2E-ALL-WORKERS-READY.md              ← This file
├── api/ENDPOINT-MAP-COMPREHENSIVE.md     ← 142+ endpoints (1,713 lines)
└── reports/MOD-QUICK-VERIFICATION-W3-W4-W5-W6.md  ← Detailed analysis
```

---

## 🚀 Start Commands (Copy-Paste)

### W1 - USER
```bash
# Start W1 session, then paste:
cat prompts/PROMPT-W1-FINAL-WITH-TEMPLATES.txt
```

**Quick prompt:**
```
W1, görev %62 EKSIK - REDO. TEMPLATE var!

scripts/templates/e2e-user-journey-template.py
python3 scripts/templates/e2e-user-journey-template.py > test-outputs/w1-auto.txt

YAPMADIĞIN: CV Analiz, AI Chat, API RBAC, Performance, Sidebar count
KORUYACAĞIN: Console 0, Profile rename, Frontend RBAC
90 dakika - BAŞLA!
```

---

### W2 - HR_SPECIALIST
```bash
# Start W2 session, then paste:
cat prompts/PROMPT-W2-FINAL-WITH-TEMPLATES.txt
```

**Quick prompt:**
```
W2, görev %35 - HEART SURGERY! TEMPLATE var!

scripts/templates/e2e-hr-journey-template.py
python3 scripts/templates/e2e-hr-journey-template.py > test-outputs/w2-auto.txt

YAPMADIĞIN: CV upload, 5-step wizard FULL, aday detail, raporlar, team, RBAC, kullanım
KORUYACAĞIN: Console 0, CRUD, Bug fix
4-5 saat - BAŞLA!
```

---

### W3 - MANAGER (Department Isolation!)
```bash
# Start W3 session, then paste:
cat prompts/PROMPT-W3-MANAGER-FINAL-WITH-TEMPLATE.txt
```

**Quick prompt:**
```
W3, görev %75 - Dept Isolation EKSİK! TEMPLATE var!

scripts/templates/e2e-manager-journey-template.py
python3 scripts/templates/e2e-manager-journey-template.py > test-outputs/w3-manager-auto.txt

YAPMADIĞIN: Department isolation VERIFY (Engineering ONLY!)
TEMPLATE: Department isolation automatic verify!
3-4 saat - BAŞLA!
```

---

### W4 - ADMIN (Organization Management!)
```bash
# Start W4 session, then paste:
cat prompts/PROMPT-W4-ADMIN-FINAL-WITH-TEMPLATE.txt
```

**Quick prompt:**
```
W4, görev %70 - Admin Workflows EKSİK! TEMPLATE var!

scripts/templates/e2e-admin-journey-template.py
python3 scripts/templates/e2e-admin-journey-template.py > test-outputs/w4-admin-auto.txt

YAPMADIĞIN: User CRUD, Org settings, Billing, Org-wide analytics
TEMPLATE: User CRUD + Org settings automatic attempt!
3-4 saat - BAŞLA!
```

---

### W5 - SUPER_ADMIN (✅ DONE!)
```bash
# Start W5 session, then paste:
cat prompts/PROMPT-W5-W6-STATUS.txt
```

**Status:**
```
W5, ✅ KABUL EDİLDİ! %80 score, production-ready!
NO ACTION NEEDED.

Report: docs/reports/e2e-test-w5-super-admin-FINAL.md
21/26 tests passed, 0 console errors, 6 bugs fixed.
```

---

### W6 - CROSS_ROLE (⏸️ WAITING)
```bash
# Start W6 session, then paste:
cat prompts/PROMPT-W5-W6-STATUS.txt
```

**Status:**
```
W6, task belirsiz - "cross-role" ne demek?

BEKLE: User'dan scope onayı al
YENİ TASK: Multi-role workflow scenarios

SONRA: Task net olunca → Template + Prompt → Başla
```

---

## 📊 Template Coverage

### W1 - USER Template
**File:** `e2e-user-journey-template.py`

**Tests (10):**
1. ✅ Login & Dashboard
2. ✅ Sidebar verification (7 items)
3. ✅ CV Analysis view
4. ✅ AI Chat (Gemini test)
5. ✅ Profile edit
6. ✅ Notifications
7. ✅ RBAC URLs (6 forbidden)
8. ✅ RBAC API (POST /job-postings → 403)
9. ✅ Performance (4 pages)
10. ✅ Console errors

**Missing from W1 original:** All covered! ✅

---

### W2 - HR Template
**File:** `e2e-hr-journey-template.py`

**Tests (13):**
1. ✅ Login & Dashboard
2. ✅ Sidebar (8 items)
3. ✅ Create Job Posting
4. ✅ CV Management (upload attempt)
5. ✅ 5-Step Wizard (navigation start)
6. ✅ Candidate detail
7. ✅ Reports
8. ✅ Team view (read-only)
9. ✅ Usage limits (50/200/10)
10. ✅ RBAC URLs (5 forbidden)
11. ✅ RBAC API (3 admin endpoints)
12. ✅ AI Chat
13. ✅ Console errors

**Worker must complete:** 5-step wizard FULL flow, CV upload 10 PDFs

---

### W3 - MANAGER Template 🆕
**File:** `e2e-manager-journey-template.py`

**Tests (9):**
1. ✅ Login & Dashboard
2. ✅ **Department Isolation - Candidates** (CRITICAL!)
3. ✅ Candidate detail & workflow
4. ✅ Job Offers (department approval)
5. ✅ Team view (department only)
6. ✅ Analytics (department scope)
7. ✅ Job Postings (view only)
8. ✅ RBAC URLs (5 forbidden)
9. ✅ Console errors

**KEY FEATURE:** Automatic department isolation verification!
- API query: Only Engineering candidates
- PostgreSQL comparison
- Cross-dept blocked verification

---

### W4 - ADMIN Template 🆕
**File:** `e2e-admin-journey-template.py`

**Tests (10):**
1. ✅ Login & Dashboard
2. ✅ **User CRUD** (Create attempt)
3. ✅ **Organization Settings** (Update attempt)
4. ✅ Billing & Usage tracking
5. ✅ Org-wide Analytics
6. ✅ Job Postings (full CRUD)
7. ✅ Candidates (org-wide)
8. ✅ Team management (admin privileges)
9. ✅ RBAC URLs (3 super-admin forbidden)
10. ✅ Console errors

**KEY FEATURES:**
- Automatic user create attempt
- Automatic org settings update attempt
- Org-wide analytics verification

---

## 🎓 Template Features

### All Templates Include:

✅ **Automatic Console Error Tracking**
- Captures all console errors
- Zero tolerance verification
- Detailed error logging

✅ **Screenshot Capture**
- Every major step
- Saved to `screenshots/` directory
- Named by role and step

✅ **JSON Results**
- Complete test metrics
- Pass/fail counts
- Features tested list
- Console errors array

✅ **API Verification**
- Backend endpoint testing
- Database cross-check
- Real data validation

✅ **RBAC Testing**
- Forbidden URL attempts
- API endpoint permission tests
- Cross-role access blocking

### Template-Specific Features:

**W3 (MANAGER):**
- 🔴 **Department isolation automatic verify**
- PostgreSQL query comparison
- Cross-department blocking test

**W4 (ADMIN):**
- 🔴 **User CRUD automatic attempt**
- 🔴 **Org settings update automatic attempt**
- Org-wide analytics verification

---

## ✅ Prerequisites Check

### Backend
```bash
curl http://localhost:8102/health
# Should return: {"status":"ok",...}
```

### Frontend
```bash
curl -s http://localhost:8103 | grep -o "<title>.*</title>"
# Should return: <title>İKAI - AI-Powered HR Platform</title>
```

### Playwright
```bash
python3 -c "from playwright.sync_api import sync_playwright; print('✅ OK')"
# Should return: ✅ OK
```

### Test Directory
```bash
mkdir -p screenshots test-outputs
# Creates output directories
```

---

## 🐛 Troubleshooting

### Issue: "Template not found"
```bash
ls -lh scripts/templates/e2e-*.py
chmod +x scripts/templates/e2e-*.py
```

### Issue: "Backend not responding"
```bash
docker logs ikai-backend -f
docker compose restart backend
```

### Issue: "Playwright not installed"
```bash
pip3 install playwright
playwright install chromium
```

### Issue: "Screenshots not saving"
```bash
mkdir -p screenshots
chmod 755 screenshots
```

---

## 📝 Next Steps

### For User (Mustafa):

**Option 1: Start all 4 workers now**
```bash
# In 4 separate tabs:
# Tab 1: W1
# Tab 2: W2
# Tab 3: W3
# Tab 4: W4

# Paste respective prompts from:
cat prompts/PROMPT-W1-FINAL-WITH-TEMPLATES.txt
cat prompts/PROMPT-W2-FINAL-WITH-TEMPLATES.txt
cat prompts/PROMPT-W3-MANAGER-FINAL-WITH-TEMPLATE.txt
cat prompts/PROMPT-W4-ADMIN-FINAL-WITH-TEMPLATE.txt
```

**Option 2: Start priority workers first**
1. W3 (MANAGER) - Department isolation is critical
2. W4 (ADMIN) - Admin workflows essential
3. W1 (USER) - Simple fixes
4. W2 (HR) - Complex wizard needs time

**Option 3: Define W6 task first**
- Decide what "cross-role" means
- Create task file
- Then start all 5 workers (W1-W5)

---

## 🎯 Success Criteria

### W1 - USER
- [ ] Console errors: 0
- [ ] CV Analysis tested
- [ ] AI Chat tested (response < 5s)
- [ ] API RBAC tested (403)
- [ ] Performance measured
- [ ] Sidebar count verified

### W2 - HR_SPECIALIST
- [ ] Console errors: 0
- [ ] 5-step wizard FULL flow
- [ ] CV upload (10 PDFs)
- [ ] Candidate detail workflow
- [ ] Reports generated
- [ ] RBAC verified (URLs + API)

### W3 - MANAGER
- [ ] Console errors: 0
- [ ] **Department isolation verified** (CRITICAL!)
- [ ] Offer approval workflow
- [ ] Team dept-only verified
- [ ] Analytics dept-only

### W4 - ADMIN
- [ ] Console errors: 0
- [ ] **User CRUD completed** (CRITICAL!)
- [ ] **Org settings updated** (CRITICAL!)
- [ ] Billing viewed
- [ ] Org-wide analytics verified

### W5 - SUPER_ADMIN
- [x] ALREADY DONE! ✅

### W6 - CROSS_ROLE
- [ ] Task defined
- [ ] Template created
- [ ] Tests completed

---

**Status:** ✅ READY TO START W1, W2, W3, W4!

**MOD:** Standing by for worker reports and verification.
