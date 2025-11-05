# 🚀 E2E TEST - WORKER START PROMPTS

**Quick copy-paste prompts to start each worker**

---

## 🎯 W1: USER Role Testing

```
sen W1'sin, claude.md oku, asanmod-core.md oku, rule 0 ezber (mock/placeholder/todo yasak), 8 mcp zorunlu, zero console error (errorCount=0), credentials.md hazır, E2E test görevi:

Test Role: USER (test-user@test-org-1.com / TestPass123!)
Task File: docs/workflow/tasks/e2e-w1-user-role-task.md
Report: docs/reports/e2e-test-w1-user-report.md

Mission:
- USER role'ünü uçtan uca test et (dashboard, CV analysis read-only, AI chat, profile)
- RBAC doğrula (admin features erişememeli)
- Console errors: SIFIR olmalı (playwright.console_errors() = 0)
- Her bug için screenshot + repro steps
- Design inconsistencies dokümante et
- Ultra detaylı rapor yaz

Ready? Önce task file'ı oku, sonra başla!
```

---

## 🎯 W2: HR_SPECIALIST Role Testing

```
sen W2'sin, claude.md oku, asanmod-core.md oku, rule 0 ezber (mock/placeholder/todo yasak), 8 mcp zorunlu, zero console error (errorCount=0), credentials.md hazır, E2E test görevi:

Test Role: HR_SPECIALIST (test-hr_specialist@test-org-2.com / TestPass123!)
Task File: docs/workflow/tasks/e2e-w2-hr-specialist-role-task.md
Report: docs/reports/e2e-test-w2-hr-specialist-report.md

Mission:
- HR_SPECIALIST role'ünü uçtan uca test et (job postings CRUD, CV upload, analysis wizard, candidates)
- Analysis wizard: 5 adımın HEPSI çalışmalı!
- Usage limits: PRO plan (50 analyses, 200 CVs) enforced mi?
- RBAC: ADMIN features erişememeli
- Console errors: SIFIR (errorCount=0)
- Her bug için screenshot + repro steps
- Design inconsistencies dokümante et
- Ultra detaylı rapor yaz

Ready? Önce task file'ı oku, sonra başla!
```

---

## 🎯 W3: MANAGER Role Testing

```
sen W3'sün, claude.md oku, asanmod-core.md oku, rule 0 ezber (mock/placeholder/todo yasak), 8 mcp zorunlu, zero console error (errorCount=0), credentials.md hazır, E2E test görevi:

Test Role: MANAGER (test-manager@test-org-1.com / TestPass123!)
Task File: docs/workflow/tasks/e2e-w3-manager-role-task.md
Report: docs/reports/e2e-test-w3-manager-report.md

Mission:
- MANAGER role'ünü uçtan uca test et (dashboard, candidate review, department analytics, offer approval)
- Data isolation: Sadece kendi department'ı görmeli
- RBAC: ADMIN features erişememeli
- Console errors: SIFIR (errorCount=0)
- Her bug için screenshot + repro steps
- Design inconsistencies dokümante et
- Ultra detaylı rapor yaz

Ready? Önce task file'ı oku, sonra başla!
```

---

## 🎯 W4: ADMIN Role Testing

```
sen W4'sün, claude.md oku, asanmod-core.md oku, rule 0 ezber (mock/placeholder/todo yasak), 8 mcp zorunlu, zero console error (errorCount=0), credentials.md hazır, E2E test görevi:

Test Role: ADMIN (test-admin@test-org-2.com / TestPass123!)
Task File: docs/workflow/tasks/e2e-w4-admin-role-task.md
Report: docs/reports/e2e-test-w4-admin-report.md

Mission:
- ADMIN role'ünü uçtan uca test et (full org management, user/role management, billing, settings, analytics)
- Usage limits: Org-level usage görmeli
- RBAC: SUPER_ADMIN features erişememeli (multi-org, system health)
- Console errors: SIFIR (errorCount=0)
- Her bug için screenshot + repro steps
- Design inconsistencies dokümante et
- Ultra detaylı rapor yaz

Ready? Önce task file'ı oku, sonra başla!
```

---

## 🎯 W5: SUPER_ADMIN Role Testing

```
sen W5'sin, claude.md oku, asanmod-core.md oku, rule 0 ezber (mock/placeholder/todo yasak), 8 mcp zorunlu, zero console error (errorCount=0), credentials.md hazır, E2E test görevi:

Test Role: SUPER_ADMIN (info@gaiai.ai / 23235656)
Task File: docs/workflow/tasks/e2e-w5-super-admin-role-task.md
Report: docs/reports/e2e-test-w5-super-admin-report.md

Mission:
- SUPER_ADMIN role'ünü uçtan uca test et (all orgs view, system health, global analytics, queue management)
- Multi-org: Tüm organizasyonları görmeli
- System monitoring: Queue health, DB health, API health
- Console errors: SIFIR (errorCount=0)
- Her bug için screenshot + repro steps
- Design inconsistencies dokümante et
- Ultra detaylı rapor yaz

Ready? Önce task file'ı oku, sonra başla!
```

---

## 🎯 W6: Cross-Role Coordinator & Design Auditor

```
sen W6'sın, claude.md oku, asanmod-core.md oku, rule 0 ezber (mock/placeholder/todo yasak), 8 mcp zorunlu, zero console error (errorCount=0), credentials.md hazır, E2E test görevi:

Test Role: ALL ROLES (cross-role testing)
Task File: docs/workflow/tasks/e2e-w6-cross-role-task.md
Report: docs/reports/e2e-test-w6-cross-role-report.md

Mission:
- 5 dashboard'u karşılaştır (design consistency audit)
- Integration test: Full hiring workflow (HR creates → MANAGER reviews → ADMIN approves)
- Performance: Load times, API response times
- Public pages: Landing, pricing, features
- Error aggregation: Tüm console errors'ı topla
- Design unification plan: Hangi sayfalar hangi tasarıma geçmeli?
- Console errors: SIFIR (errorCount=0)
- Ultra detaylı cross-role rapor yaz

Ready? Önce task file'ı oku, sonra başla!
```

---

## 📋 VERIFICATION (After Each Prompt)

**Her worker şunu yanıtlamalı:**

```
✅ Identity: WORKER [N] (Executor)
✅ Rule 0 loaded (Production-Ready Only)
✅ 8 MCPs ready
✅ Zero console error policy active
✅ Task file: [path]
✅ Test role: [ROLE]
✅ Report location: [path]
✅ Ready to test!

Reading task file now...
```

---

## 🎯 MASTER PLAN

**Main coordination file:** `docs/workflow/tasks/e2e-test-master-plan.md`

**Individual task files:**
- W1: `docs/workflow/tasks/e2e-w1-user-role-task.md`
- W2: `docs/workflow/tasks/e2e-w2-hr-specialist-role-task.md`
- W3: `docs/workflow/tasks/e2e-w3-manager-role-task.md`
- W4: `docs/workflow/tasks/e2e-w4-admin-role-task.md`
- W5: `docs/workflow/tasks/e2e-w5-super-admin-role-task.md`
- W6: `docs/workflow/tasks/e2e-w6-cross-role-task.md`

**Reports will be saved to:**
- `docs/reports/e2e-test-w1-user-report.md`
- `docs/reports/e2e-test-w2-hr-specialist-report.md`
- `docs/reports/e2e-test-w3-manager-report.md`
- `docs/reports/e2e-test-w4-admin-report.md`
- `docs/reports/e2e-test-w5-super-admin-report.md`
- `docs/reports/e2e-test-w6-cross-role-report.md`

---

## ⏱️ ESTIMATED TIMELINE

| Worker | Duration | Parallel |
|--------|----------|----------|
| W1 | 3 hours | ✅ |
| W2 | 4 hours | ✅ |
| W3 | 3 hours | ✅ |
| W4 | 4 hours | ✅ |
| W5 | 3 hours | ✅ |
| W6 | 3 hours | ✅ (after W1-W5 start) |

**Total:** ~4 hours (all parallel)

---

**MOD: Copy-paste these prompts to start each worker in separate Claude sessions!**
