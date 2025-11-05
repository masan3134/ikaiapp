# E2E Test Templates - Complete Guide

**Date:** 2025-11-05
**Purpose:** Ready-to-use Playwright templates for W1 (USER) and W2 (HR_SPECIALIST)
**Backend:** Fully synchronized with 142+ API endpoints

---

## 🚀 Quick Start

###For W1 (USER Role)
```bash
# Run USER journey test
python3 scripts/templates/e2e-user-journey-template.py > test-outputs/w1-user-journey.txt

# View results
cat test-outputs/w1-user-journey.txt
cat test-outputs/user-journey-results.json
```

### For W2 (HR_SPECIALIST Role)
```bash
# Run HR journey test
python3 scripts/templates/e2e-hr-journey-template.py > test-outputs/w2-hr-journey.txt

# View results
cat test-outputs/w2-hr-journey.txt
cat test-outputs/hr-journey-results.json
```

---

## 📋 Template Coverage

### USER Template (`e2e-user-journey-template.py`)

**Covers all W1 task requirements:**

| Task Section | Template Coverage | Details |
|--------------|-------------------|---------|
| **1. Login & Dashboard** | ✅ FULL | Login, redirect, dashboard screenshot |
| **2. Sidebar Control** | ✅ FULL | Count items, verify 7 visible |
| **3. CV Analysis View** | ✅ FULL | Navigate to /analyses, view list, open detail, check candidates |
| **4. AI Chat** | ✅ FULL | Navigate to /chat, send message, measure response time |
| **5. Profile Edit** | ✅ FULL | Navigate to /settings/profile, edit firstName, save |
| **6. Notifications** | ✅ FULL | Navigate to /notifications, count items |
| **7. RBAC URLs** | ✅ FULL | Test 6 forbidden URLs (admin, job-postings/create, team, analytics, org, billing) |
| **8. RBAC API** | ✅ FULL | Test POST /job-postings with USER token (expect 403) |
| **9. Performance** | ✅ FULL | Measure load times for 4 pages (dashboard, analyses, chat, profile) |
| **10. Console Errors** | ✅ FULL | Track all console errors across pages |

**Output:**
- Screenshots: 10+ (every major step)
- JSON results: `test-outputs/user-journey-results.json`
- Console log: Formatted test report
- Metrics: Pass/fail count, features tested, console errors

---

### HR Template (`e2e-hr-journey-template.py`)

**Covers all W2 task requirements:**

| Task Section | Template Coverage | Details |
|--------------|-------------------|---------|
| **1. Login & Dashboard** | ✅ FULL | Login, dashboard, count widgets |
| **2. Sidebar** | ✅ FULL | Verify 8 HR items (İş İlanları, Adaylar, Analizler, Mülakatlar, Teklifler, Raporlar, AI Sohbet, Dashboard) |
| **3. Create Job Posting** | ✅ FULL | Navigate to /job-postings, create new, fill form, save |
| **4. CV Management** | ✅ FULL | Navigate to /candidates, upload CV (if test files exist) |
| **5. 5-Step Wizard** | ✅ FULL | Navigate to /wizard, step 1 (select job), step 2 (upload CVs), navigation |
| **6. Candidate Detail** | ✅ FULL | Open candidate, check notes/status fields |
| **7. Reports** | ✅ FULL | Navigate to /analytics, count charts/visualizations |
| **8. Team View** | ✅ FULL | Navigate to /team, verify read-only (no edit buttons) |
| **9. Usage Limits** | ✅ FULL | Check dashboard for 50/200/10 usage indicators |
| **10. RBAC URLs** | ✅ FULL | Test 5 forbidden URLs (admin, org, billing, super-admin, users/manage) |
| **11. RBAC API** | ✅ FULL | Test 3 admin endpoints (PATCH /organization, PATCH /users/role, GET /billing) - expect 403 |
| **12. AI Chat** | ✅ FULL | Navigate to /chat |
| **13. Console Errors** | ✅ FULL | Track all console errors |

**Output:**
- Screenshots: 12+ (all major steps)
- JSON results: `test-outputs/hr-journey-results.json`
- Console log: Formatted test report with workflow steps
- Metrics: Pass/fail count, features tested, workflow progression

---

## 🔧 Backend Integration

**Templates are synchronized with:**

1. **API Endpoints** (docs/api/ENDPOINT-MAP-COMPREHENSIVE.md)
   - 142+ endpoints documented
   - All routes verified
   - Request/response formats included

2. **Database Schema** (backend/prisma/schema.prisma)
   - User roles: SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST, USER
   - Organization isolation
   - Subscription plans: FREE, PRO, ENTERPRISE

3. **Frontend Routes** (frontend/app/(authenticated)/)
   - 15 authenticated routes
   - Role-based dashboards
   - RBAC middleware

4. **Test Accounts** (docs/CREDENTIALS.md)
   - USER: test-user@test-org-1.com / TestPass123!
   - HR: test-hr_specialist@test-org-2.com / TestPass123!
   - All credentials ready

---

## 📊 Template Features

### Automatic Tracking

Both templates automatically track:

✅ **Test Results**
- Total tests run
- Passed count
- Failed count
- Pass rate percentage

✅ **Console Errors**
- All console errors captured
- Error text logged
- Zero tolerance verification

✅ **Screenshots**
- Every major step
- Saved to `screenshots/` directory
- Named by role and step

✅ **Features Tested**
- List of all features covered
- Workflow steps (HR template)
- Summary at end

✅ **Performance**
- Page load times measured
- Target: < 2000ms per page
- Results in milliseconds

### JSON Output Format

```json
{
  "total_tests": 13,
  "passed": 12,
  "failed": 1,
  "console_errors": [],
  "screenshots": ["user-01-login.png", "user-02-dashboard.png", ...],
  "features_tested": [
    "Authentication",
    "Sidebar Navigation",
    "CV Analysis (View)",
    "AI Chat",
    "Profile Management",
    "Notifications",
    "RBAC (Frontend)",
    "RBAC (API)",
    "Performance"
  ]
}
```

---

## 🎯 Customization

### Change Credentials

Edit at top of template:
```python
# USER credentials
USER_EMAIL = "test-user@test-org-1.com"
USER_PASSWORD = "TestPass123!"
```

### Change Headless Mode

For debugging (see browser):
```python
HEADLESS = False  # Shows browser window
```

### Change Timeout

For slower environments:
```python
TIMEOUT = 10000  # 10 seconds
```

### Add More Tests

Follow the pattern:
```python
# ================================================
# X. YOUR TEST NAME
# ================================================
print("\n[X] YOUR TEST NAME")
print("-" * 70)

# Navigate
page.goto(f"{BASE_URL}/your-page")
page.wait_for_load_state("networkidle")
page.screenshot(path="screenshots/your-test.png")

# Test logic
result = page.locator('selector').count()

# Log
log_test("Your Test", "PASS" if result > 0 else "FAIL", f"- Details: {result}")
test_results["features_tested"].append("Your Feature")
```

---

## ✅ Prerequisites

### 1. Backend Running
```bash
docker logs ikai-backend | tail -20
# Should see: "Server is running on port 8102"
```

### 2. Frontend Running
```bash
docker logs ikai-frontend | tail -20
# Should see: "ready started server on 0.0.0.0:3000, url: http://localhost:8103"
```

### 3. Playwright Installed
```bash
pip3 install playwright
playwright install chromium
```

### 4. Test Data Ready
```bash
# Check test users exist
docker exec ikai-backend node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(c => console.log('Users:', c));
"
```

---

## 🐛 Troubleshooting

### Issue: "Login timeout"
```bash
# Check backend is running
curl http://localhost:8102/health

# Check credentials
psql postgresql://ikaiuser:ikaipass2025@localhost:8132/ikaidb \
  -c "SELECT email, role FROM users WHERE email LIKE 'test-%';"
```

### Issue: "Element not found"
```bash
# Run in non-headless mode to see browser
# Edit template: HEADLESS = False
python3 scripts/templates/e2e-user-journey-template.py
```

### Issue: "Console errors detected"
```bash
# Check which pages have errors
grep "console error" test-outputs/user-journey-results.json

# Common fix: Frontend hot reload error (safe to ignore)
# Real errors: Check browser console or screenshots
```

### Issue: "Permission denied"
```bash
# Make templates executable
chmod +x scripts/templates/e2e-*.py
```

---

## 📚 Related Documentation

- **API Reference:** [docs/api/ENDPOINT-MAP-COMPREHENSIVE.md](api/ENDPOINT-MAP-COMPREHENSIVE.md)
- **Credentials:** [docs/CREDENTIALS.md](CREDENTIALS.md)
- **Task Files:**
  - W1: [docs/workflow/tasks/USER-JOURNEY-W1-USER.md](workflow/tasks/USER-JOURNEY-W1-USER.md)
  - W2: [docs/workflow/tasks/USER-JOURNEY-W2-HR.md](workflow/tasks/USER-JOURNEY-W2-HR.md)
- **Worker Playbooks:**
  - [docs/workflow/WORKER-PLAYBOOK.md](workflow/WORKER-PLAYBOOK.md)

---

## 🎓 Template Philosophy

**These templates are:**
- ✅ Production-ready (no mocks, no TODOs)
- ✅ Backend-synchronized (142+ endpoints mapped)
- ✅ Real user journeys (not generic page clicks)
- ✅ Zero console error enforced (RULE 1 compliance)
- ✅ Fully automated (run → results)
- ✅ Easily customizable (clear structure)

**Workers can:**
1. Run templates as-is (quick verification)
2. Customize for specific tests (add scenarios)
3. Use as reference (learn Playwright patterns)
4. Extend with more features (interviews, offers, etc.)

---

**Status:** ✅ READY FOR W1 and W2

**Next:** Copy templates to worker test directories and start testing!
