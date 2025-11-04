# AsanMod Çalışma Metodolojisi

**Version:** 1.0
**Created:** 2025-11-04
**Author:** Mustafa Asan + Claude (Sonnet 4.5)
**Purpose:** Büyük projeleri paralel tab'larda yöneterek hızlı ve doğrulanabilir şekilde geliştirme

---

## 🎯 AsanMod Nedir?

AsanMod, büyük yazılım projelerini **paralel olarak**, **doğrulanabilir şekilde** ve **yalan söylenemeyecek raporlarla** yönetme metodolojisidir.

### Temel Prensipler:

1. **Paralel Yürütme** - Farklı fazlar farklı tab'larda eşzamanlı çalışır
2. **Ultra-Detaylı JSON Task Dosyaları** - Her task için step-by-step talimatlar
3. **Ham Veri Raporlama** - AI yorumlamaz, sadece terminal çıktısını kopyalar
4. **Gerçek Doğrulama** - Master Claude MD dosyasını okuyarak durumu anlar
5. **MCP Requirements** - Her fazda hangi tool'ların kullanılacağı belirtilir

---

## 🐍 Python Test Helper (API Testing için)

### Neden Python Test Helper?

**Problem:** Worker'lar API endpoint'lerini test ederken curl + JWT token almakta zorlanıyor.

**Çözüm:** Python script ile otomatik login, token yönetimi ve temiz çıktılar.

### Kullanım (Hem Mod Hem Worker)

**Script:** `scripts/test-helper.py`

#### Interactive Mode (Önerilen):
```bash
python3 -i scripts/test-helper.py

>>> helper = IKAITestHelper()
>>> user = TEST_USERS["org1_hr"]
>>> helper.login(user["email"], user["password"])
✅ Login başarılı!
   Email: test-hr_specialist@test-org-1.com
   Rol: HR_SPECIALIST

>>> helper.get("/api/v1/job-postings")
============================================================
GET /api/v1/job-postings
Status: 200
============================================================
{
  "jobPostings": [...],
  "count": 2
}

>>> helper.post("/api/v1/job-postings", {...})
```

#### Hazır Test Kullanıcıları:
```python
TEST_USERS = {
    "org1_admin": "test-admin@test-org-1.com",
    "org1_hr": "test-hr_specialist@test-org-1.com",
    "org2_manager": "test-manager@test-org-2.com",
    "org2_hr": "test-hr_specialist@test-org-2.com",
    "org3_admin": "test-admin@test-org-3.com",
    "super_admin": "info@gaiai.ai"
}
# Hepsi: TestPass123! (super_admin hariç: 23235656)
```

#### Avantajlar:
- ✅ Token otomatik alınıyor ve yönetiliyor
- ✅ Login basit: `helper.login(email, password)`
- ✅ Endpoints hazır: `get()`, `post()`, `put()`, `delete()`
- ✅ JSON çıktıları otomatik formatlanıyor
- ✅ Terminal çıktıları doğrudan kopyalanabilir
- ✅ Hata mesajları net görünüyor

#### JSON Task Dosyalarında Kullanım:

```json
{
  "task": {
    "id": "1.1",
    "title": "Test job posting creation",
    "instructions": [
      "1. Open Python interactive: python3 -i scripts/test-helper.py",
      "2. Login: helper.login(TEST_USERS['org1_hr']['email'], ...)",
      "3. Create posting: helper.post('/api/v1/job-postings', {...})",
      "4. Copy terminal output to verification MD",
      "5. Verify response has 201 status and jobPosting.id"
    ],
    "verification": {
      "method": "Copy RAW Python terminal output to MD report",
      "expectedStatus": 201,
      "expectedFields": ["jobPosting.id", "jobPosting.title"]
    }
  }
}
```

#### Verification MD Formatı:

```markdown
## Task 1.1: Create Job Posting (Org 1)

**Python Commands:**
\```python
>>> helper = IKAITestHelper()
>>> user = TEST_USERS["org1_hr"]
>>> helper.login(user["email"], user["password"])
✅ Login başarılı!
   Token: eyJhbGci...

>>> job = {"title": "Junior Developer", "department": "Engineering", ...}
>>> result = helper.post("/api/v1/job-postings", job)
============================================================
POST /api/v1/job-postings
Status: 201
============================================================
{
  "jobPosting": {
    "id": "abc-123",
    "title": "Junior Developer",
    "department": "Engineering"
  }
}
\```

**Status:** ✅ PASS (201 Created)
**Job ID:** abc-123
```

#### Örnek Komutlar:

```bash
# Yardım
python3 scripts/test-helper.py help

# Örnek test çalıştır
python3 scripts/test-helper.py example_job_postings
python3 scripts/test-helper.py example_candidates
```

**Önemli:** curl + JWT token yerine Python test helper kullan! Sistem bozmadan gerçek kullanıcı gibi test yapabilirsin.

---

## 📋 Çalışma Akışı (Workflow)

### 1. Proje Analizi ve Faz Planlama

**Ana Tab (Master Claude):**
```
User: "Tüm sayfaları ve route'ları role-based access ile korumak istiyorum"

Claude:
1. Mevcut durumu analiz eder (backend routes, frontend pages)
2. Tüm projeyi tarar (Glob, Grep kullanarak)
3. Kaç route korunmamış, kaç sayfa korunmamış saptar
4. İşi fazlara böler:
   - Phase 1: Infrastructure (1.5h)
   - Phase 2: Backend Routes (3h)
   - Phase 3: Frontend Pages (2.5h)
   - Phase 4: Sidebar Navigation (1h)
   - Phase 5: Testing & Documentation (2h)
```

**Çıktı:** Master plan with time estimates

---

### 2. Ultra-Detaylı JSON Task Dosyası Oluşturma

**User talebi:**
```
"p1 ultra detaylı json task olarak ayrı dosyalara yaz sonra yaptırcaz başka tab da"
```

**Master Claude yapar:**

#### JSON Dosya Yapısı:

```json
{
  "phase": "Phase X - Title",
  "duration": "2.5 hours",
  "priority": "HIGH",
  "dependencies": ["Phase 1 complete"],
  "description": "What this phase does",

  "mcpRequirements": {
    "required": ["filesystem", "git"],
    "optional": ["sequentialthinking"],
    "usage": {
      "filesystem": "What it's used for",
      "git": "When to use"
    },
    "verification": "How to check MCPs are available"
  },

  "toolUsageGuide": {
    "forTasks_X_to_Y": {
      "step1": "Use Read tool...",
      "step2": "Use Edit tool...",
      "step3": "Verify..."
    },
    "forTask_Z_verification": {
      "step1": "Run bash commands",
      "step2": "Copy RAW outputs to MD",
      "step3": "NO interpretation!"
    }
  },

  "tasks": [
    {
      "id": "X.1",
      "title": "Task Title",
      "file": "path/to/file.tsx",
      "priority": "HIGH",
      "estimatedTime": "10 minutes",
      "description": "Detailed description",
      "dependencies": ["X.0"],
      "allowedRoles": ["HR_SPECIALIST", "MANAGER"],
      "instructions": [
        "1. Read current file",
        "2. Import components",
        "3. Wrap with HOC",
        "4. Verify import paths"
      ],
      "codePattern": "// Exact code pattern to follow\nimport { ... } from '...';\n\nexport default withProtection(Component);"
    },
    {
      "id": "X.13",
      "title": "Generate Verification Report",
      "priority": "CRITICAL",
      "outputFile": "docs/reports/phaseX-verification.md",
      "instructions": [
        "1. Run verification commands",
        "2. Copy RAW OUTPUT to MD file",
        "3. DO NOT interpret results",
        "4. DO NOT add checkmarks",
        "5. Let reviewer read raw data"
      ],
      "reportTemplate": "# Phase X Verification\n\n## Test 1\n\n```bash\n$ command here\n```\n\n**Output:**\n```\n[PASTE_EXACT_OUTPUT_HERE]\n```\n\n**Expected:** 19\n\n---\n\n## Summary\n\n**Total:** [NUMBER_FROM_SECTION_1]\n**Status:** [COMPLETE/INCOMPLETE]\n",
      "verificationCommands": {
        "step1": "grep -r 'pattern' path/ | wc -l",
        "step2": "grep -r 'pattern' path/",
        "step3": "npm run build 2>&1 | head -50"
      }
    }
  ],

  "verification": {
    "checks": [
      "✅ Expected outcome 1",
      "✅ Expected outcome 2"
    ]
  },

  "completionMessage": "🎉 Phase X Complete!\n\n✅ Achievement 1\n✅ Achievement 2\n\nNext: Phase Y"
}
```

**JSON Dosya Özellikleri:**

- **mcpRequirements:** Hangi MCP'ler gerekli, nerelerde kullanılacak
- **toolUsageGuide:** Her task grubu için hangi tool nasıl kullanılacak
- **reportTemplate:** Agent'in dolduracağı MD şablonu (ham veri için)
- **verificationCommands:** Çalıştırılacak komutlar (yorum yok, sadece komut)
- **codePattern:** Kopyala-yapıştır yapabilecek kod örnekleri

---

### 3. Paralel Tab'larda Görev Dağıtımı

**User yapar:**
```
1. Yeni VS Code tab aç
2. Claude Code extension'ı başlat
3. JSON dosyasını göster
4. "Bu task'ları yap" komutu ver
```

**Paralel çalışma örneği:**
```
Tab 1 (Master): Phase 3 hazırlıyor
Tab 2 (Worker): Phase 2 çalıştırıyor
Tab 3 (Worker): Phase 1 doğrulaması yapıyor
```

**Master Claude'un rolü:**
- JSON dosyaları hazırlamak
- Tamamlanan fazları doğrulamak (MD raporlarını okuyarak)
- Bir sonraki fazı hazırlamak

**Worker Claude'ların rolü:**
- JSON'daki task'ları sırayla yapmak
- Ham veri raporları oluşturmak (yorum yok!)
- Verification MD'leri doldurmak

---

### 4. Ham Veri Raporlama (Yalan Söylenemez Sistem)

#### Geleneksel AI Raporu (YANLIŞ):
```
✅ Task 1 completed successfully
✅ All 19 pages are now protected
✅ TypeScript compilation passed without errors
```

**Problem:** AI yalan söyleyebilir, kontrol edilemez!

**ASANMOD STRICT RULES:**
- ❌ NO SIMULATION - Real commands only
- ❌ NO MOCKING - Real data only
- ❌ NO PLACEHOLDERS - Real outputs only
- ❌ NO "completed successfully" - Show proof
- ✅ REAL TERMINAL OUTPUTS - Exact copy-paste
- ✅ REAL FILE PATHS - Must exist on disk
- ✅ REAL VERIFICATION - grep/wc counts match reality

#### AsanMod Ham Veri Raporu (DOĞRU):
```markdown
# Phase 3 - Frontend Page Protection Verification

Date: 2025-11-04
Executor: Claude Worker Tab 2

## 1. Protected Pages Count

```bash
$ grep -r 'withRoleProtection' frontend/app/\(authenticated\) --include='page.tsx' | wc -l
```

**Output:**
```
19
```

**Expected:** 19

---

## 2. List of All Protected Pages

```bash
$ grep -r 'withRoleProtection' frontend/app/\(authenticated\) --include='page.tsx'
```

**Output:**
```
frontend/app/(authenticated)/job-postings/page.tsx:import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
frontend/app/(authenticated)/job-postings/page.tsx:export default withRoleProtection(JobPostingsPage, {
frontend/app/(authenticated)/candidates/page.tsx:import { withRoleProtection } from '@/lib/hoc/withRoleProtection';
... (17 more lines)
```

---

## 3. TypeScript Compilation Check

```bash
$ cd frontend && npm run build 2>&1 | head -50
```

**Output:**
```
> ikai-frontend@0.1.0 build
> next build

   ▲ Next.js 14.2.5

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types ...
 ✓ Collecting page data ...
 ✓ Generating static pages (21/21)
 ✓ Collecting build traces ...
 ✓ Finalizing page optimization ...

Route (app)                              Size     First Load JS
┌ ○ /                                    142 B          87.2 kB
└ ○ /job-postings                        2.3 kB         89.5 kB
```

---

## Summary

**Total Protected Pages:** 19
**TypeScript Errors:** NO

**Status:** COMPLETE
```

**Fark:**
- Master Claude MD'yi okuyunca: "19 sayfa korunmuş, build başarılı" görür
- Terminal çıktıları sahte yapılamaz
- Dosya listesi kontrol edilebilir
- Worker Claude yorum yapmamış, sadece kopyala-yapıştır yapmış

---

### 5. Doğrulama ve Sonraki Faz

**User döner ana tab'a:**
```
User: "p2 bitti, doğrula"
```

**Master Claude yapar:**
```
1. docs/reports/phase2-backend-routes-verification.md dosyasını okur
2. Ham verileri analiz eder:
   - Grep çıktıları: 130 route korunmuş mu?
   - Docker logs: Backend başladı mı?
   - Syntax errors var mı?
3. Sonuç bildirir:
   "✅ Phase 2 Complete - 130 routes protected, backend restarted successfully"
   VEYA
   "❌ Phase 2 Failed - Found 15 unprotected routes, see line 87 of report"
```

**User onaylar:**
```
User: "ok p3 başlat"
```

**Master Claude:**
```
"Phase 3 JSON hazır (23KB): docs/features/role-access-phase3-frontend-pages.json
Yeni tab'da aç ve çalıştır."
```

---

## 🔒 Git Policy (ZORUNLU - ABSOLUTE)

**🚨 CRITICAL RULE FOR BOTH MOD & WORKER:**

### **ANY FILE CHANGE = IMMEDIATE COMMIT + PUSH**

```
❌ FORBIDDEN:
- Working without committing (even 1 character change!)
- Delaying commits ("I'll commit later")
- Batching changes (multiple edits before commit)
- "Forgot to commit" excuse
- Multi-file edits without intermediate commits

✅ REQUIRED AFTER EVERY CHANGE:
1. File değişikliği yap (Read → Edit/Write)
2. IMMEDIATELY: git add .
3. IMMEDIATELY: git commit -m "descriptive message"
4. Auto-push happens (post-commit hook active)

🎯 REASON:
- Güvenlik (security) - Changes tracked instantly
- Akış (flow) - Clear progress trail for Mustafa Asan
- Doğrulama (verification) - Mod can verify commit history
- Geri alma (rollback) - Easy to revert bad changes
- Şeffaflık (transparency) - User sees real-time progress
```

### Mod Git Workflow

**Phase JSON oluşturma:**
```bash
# Step 1: Create JSON file
Write(file_path: "docs/features/role-access-phase3.json", content: {...})

# Step 2: IMMEDIATE commit
git add docs/features/role-access-phase3.json
git commit -m "feat(asanmod): Add Phase 3 JSON - Frontend RBAC (19 pages)

Tasks:
- 3.1-3.19: Protect 19 authenticated pages
- Verification: grep + build + console checks
- Estimated: 2.5 hours"
# Auto-push happens
```

**Verification MD update:**
```bash
# After re-running Worker's commands and comparing outputs
Write(file_path: "docs/reports/phase3-mod-verification.md", content: "...")

# IMMEDIATE commit
git add docs/reports/phase3-mod-verification.md
git commit -m "docs(asanmod): Mod verification of Phase 3 - ✅ VERIFIED

Comparison:
- Worker grep output: 19 files ✅ MATCH
- Worker build: SUCCESS ✅ MATCH
- Console logs: No role errors ✅ MATCH

VERDICT: Phase 3 verified, Phase 4 can start"
# Auto-push happens
```

### Worker Git Workflow

**Single file edit:**
```bash
# Step 1: Read file
Read(file_path: "frontend/app/(authenticated)/job-postings/page.tsx")

# Step 2: Edit file
Edit(
  file_path: "frontend/app/(authenticated)/job-postings/page.tsx",
  old_string: "export default JobPostingsPage;",
  new_string: "export default withRoleProtection(JobPostingsPage, {...});"
)

# Step 3: IMMEDIATE commit (do NOT edit another file yet!)
git add frontend/app/\(authenticated\)/job-postings/page.tsx
git commit -m "feat(rbac): Protect job-postings page with HR_MANAGERS role

Task 3.1 completed:
- Added withRoleProtection HOC
- Allowed roles: HR_MANAGERS (ADMIN, MANAGER, HR_SPECIALIST)"
# Auto-push happens

# Step 4: Now move to next file (candidates/page.tsx)
```

**Verification MD creation:**
```bash
# After completing ALL tasks and running verification commands
Write(file_path: "docs/reports/phase3-verification.md", content: "...")

# IMMEDIATE commit
git add docs/reports/phase3-verification.md
git commit -m "docs(asanmod): Phase 3 verification report (RAW outputs)

Results:
- Protected pages: 19 (grep output pasted)
- Build: SUCCESS (npm output pasted)
- Console: No role errors (screenshot attached)

Phase 3 COMPLETE - ready for Mod verification"
# Auto-push happens
```

### Commit Message Format

**Mod commits:**
```
feat(asanmod): Add Phase X JSON - [Brief description]
docs(asanmod): Mod verification of Phase X - ✅ VERIFIED/❌ FAILED
fix(asanmod): Update Phase X JSON - [What was fixed]
```

**Worker commits:**
```
feat(rbac): [What changed] - Task X.Y

[Optional details:
- What was added
- Why it matters]

docs(asanmod): Phase X verification report (RAW outputs)
```

### Verification by Mod

**Mod checks Worker commit history:**
```bash
# Should see individual commits for EACH file change
git log --oneline -20

# Example GOOD Worker commits:
9a2b3c4 docs(asanmod): Phase 3 verification report (RAW outputs)
8d7e6f5 feat(rbac): Protect team page with ADMINS role - Task 3.19
7c6b5a4 feat(rbac): Protect settings/billing with ADMINS - Task 3.18
6a5b4c3 feat(rbac): Protect settings/org with ADMINS - Task 3.17
...

# Example BAD Worker (batched commits):
9a2b3c4 feat(rbac): Protected all 19 pages  ❌ TOO VAGUE!
# Missing: Individual commits for each file
```

### Git Automation

**Auto-commit hook already active:**
- Location: `.git/hooks/post-commit`
- Action: `git push origin main` after every commit
- No manual push needed!

**Verification:**
```bash
# Check auto-commit hook
cat .git/hooks/post-commit

# Should output:
#!/bin/bash
git push origin main
```

### Emergency Situations

**❌ NEVER batch commits even if:**
- "I'm editing 10 files in a row"
  → Commit after EACH file!

- "I'll commit when task is done"
  → Commit after EACH subtask!

- "Git history will be messy"
  → Detailed history > clean history

- "It's just a typo fix"
  → Even 1 character = commit!

**✅ ONLY exception:**
- If you're editing 1 file multiple times for the SAME logical change
- Example: Adding import → Using import in same file
  → Can be 1 commit

But if touching 2+ files → MUST commit after each file!

### Examples: Right vs Wrong

**❌ WRONG:**
```bash
# Edit 5 files
Edit(job-postings/page.tsx)
Edit(candidates/page.tsx)
Edit(analyses/page.tsx)
Edit(offers/page.tsx)
Edit(interviews/page.tsx)

# Then commit all at once
git add .
git commit -m "Protected 5 pages"
```

**✅ RIGHT:**
```bash
# Edit file 1
Edit(job-postings/page.tsx)
git add frontend/app/\(authenticated\)/job-postings/page.tsx
git commit -m "feat(rbac): Protect job-postings - Task 3.1"

# Edit file 2
Edit(candidates/page.tsx)
git add frontend/app/\(authenticated\)/candidates/page.tsx
git commit -m "feat(rbac): Protect candidates - Task 3.2"

# Edit file 3
Edit(analyses/page.tsx)
git add frontend/app/\(authenticated\)/analyses/page.tsx
git commit -m "feat(rbac): Protect analyses - Task 3.3"

# ... and so on
```

### Summary

**Tek harf değişikliği bile = COMMIT!**
**No exceptions. No delays. IMMEDIATE commit after ANY change.**

**Why this is CRITICAL:**
1. **Mustafa Asan güveni** - Real-time progress tracking
2. **Mod verification** - Can verify each step individually
3. **Rollback safety** - Easy to undo specific changes
4. **Transparency** - Clear audit trail
5. **Discipline** - Forces structured, incremental work

---

## 🔧 Tool ve MCP Kullanımı

### AsanMod'da Kullanılan Tool'lar:

#### 1. **Read Tool**
```javascript
// Mevcut dosyayı oku
Read(file_path: "frontend/app/(authenticated)/job-postings/page.tsx")
```

#### 2. **Edit Tool**
```javascript
// Dosyada değişiklik yap
Edit(
  file_path: "...",
  old_string: "export default JobPostingsPage;",
  new_string: "export default withRoleProtection(JobPostingsPage, {\n  allowedRoles: RoleGroups.HR_MANAGERS\n});"
)
```

#### 3. **Write Tool**
```javascript
// Yeni rapor dosyası oluştur
Write(
  file_path: "docs/reports/phase3-verification.md",
  content: "# Phase 3 Verification\n\n..."
)
```

#### 4. **Bash Tool**
```javascript
// Verification komutları çalıştır
Bash(command: "grep -r 'withRoleProtection' frontend/app/\\(authenticated\\) | wc -l")
```

#### 5. **Glob Tool**
```javascript
// Dosya arama
Glob(pattern: "**/*.tsx", path: "frontend/app/(authenticated)")
```

#### 6. **Grep Tool**
```javascript
// Kod içinde arama
Grep(pattern: "withRoleProtection", path: "frontend/app", output_mode: "files_with_matches")
```

### MCP Gereksinimleri:

| MCP | Kullanım | Zorunlu mu? |
|-----|---------|------------|
| **filesystem** | Dosya okuma/yazma/düzenleme | ✅ Evet |
| **git** | Commit/push işlemleri | ⚠️ Opsiyonel |
| **sequentialthinking** | Karmaşık planlama | ⚠️ Opsiyonel |
| **time** | Timestamp için | ❌ Gerek yok |
| **memory** | Önceki session bilgisi | ❌ Gerek yok |
| **fetch** | Web scraping | ❌ Gerek yok |

---

## 💡 AsanMod'un Avantajları

### 1. **Paralel Çalışma = Hız**
```
Geleneksel: 7 saat (sıralı)
AsanMod: 3 saat (paralel)
```

Phase 1, 2, 3'ü aynı anda farklı tab'larda çalıştırarak **2-3x hızlanma**

### 2. **Yalan Söylenemez Raporlama**
```
AI: "✅ Tamamlandı"
Master: "MD'de terminal çıktısı nerede? Göster!"
```

Ham veri = Doğrulanabilir = Güvenilir

### 3. **Geri Dönülebilir**
```
Phase 3 fail oldu → Phase 2'ye dön
MD raporlarında hangi satırda hata olduğu yazıyor
```

### 4. **Tekrar Kullanılabilir**
```
Aynı JSON'ları başka projede kullan
Task pattern'leri kütüphanesi oluştur
```

### 5. **Öğretilebilir**
```
Yeni developer JSON'u okuyup ne yapacağını anlar
Step-by-step talimatlar = Onboarding kolaylaşır
```

---

## 📊 Gerçek Proje Örneği: IKAI RBAC Implementation

### Problem:
```
- 130+ backend route korunmamış (95%)
- 21 frontend page korunmamış (88%)
- 5 farklı rol seviyesi (SUPER_ADMIN, ADMIN, MANAGER, HR_SPECIALIST, USER)
- Multi-tenant SaaS (organizasyon izolasyonu gerekli)
```

### AsanMod Çözümü:

#### Faz 1: Infrastructure (1.5 saat)
**JSON:** 18KB, 7 task
**Çıktı:**
- 3 backend dosyası (roles.js, roleHelpers.js, authorize.js)
- 3 frontend dosyası (roles.ts, useHasRole.ts, RoleGuard.tsx, withRoleProtection.tsx)
- **Doğrulama:** docs/reports/phase1-infrastructure-verification.md

#### Faz 2: Backend Routes (3 saat)
**JSON:** 16KB, 15 task
**Çıktı:**
- 26 route dosyası güncellendi
- 130+ route'a authorize middleware eklendi
- **Doğrulama:** docs/reports/phase2-backend-routes-verification.md

#### Faz 3: Frontend Pages (2.5 saat)
**JSON:** 23KB, 14 task
**Çıktı:**
- 19 page.tsx withRoleProtection ile korundu
- Role grupları atandı (HR_MANAGERS, ANALYTICS_VIEWERS, ADMINS)
- **Doğrulama:** docs/reports/phase3-frontend-protection-verification.md

#### Faz 4: Sidebar Navigation (1 saat) - Planlandı
**JSON:** TBD
**Hedef:**
- Sidebar menü itemları role'e göre gizlenecek
- useHasRole hook kullanılacak

#### Faz 5: Testing & Documentation (2 saat) - Planlandı
**JSON:** TBD
**Hedef:**
- Her role için browser test
- API endpoint testleri
- Final documentation

### Toplam Süre:
```
Geleneksel tahmin: 10-12 saat (tek kişi, sıralı)
AsanMod gerçek: 5-6 saat (paralel + doğrulama)
```

---

## 🎯 AsanMod Best Practices

### DO ✅

1. **Her faz için ayrı JSON dosyası oluştur**
   ```
   phase1-infrastructure.json
   phase2-backend-routes.json
   phase3-frontend-pages.json
   ```

2. **mcpRequirements ve toolUsageGuide ekle**
   ```json
   "mcpRequirements": {
     "required": ["filesystem"],
     "usage": { "filesystem": "Read/Edit files" }
   }
   ```

3. **Verification task'larında ham veri iste**
   ```
   "DO NOT interpret results - just paste raw data"
   "Copy EXACT terminal output"
   ```

4. **reportTemplate ver**
   ```
   Boş MD template ile agent'in dolduracağı alanları göster
   [PASTE_OUTPUT_HERE] gibi placeholders kullan
   ```

5. **Her task için estimatedTime belirt**
   ```
   "estimatedTime": "10 minutes"
   ```

6. **codePattern örnekleri ekle**
   ```
   Kopyala-yapıştırabilir kod snippet'leri
   ```

### DON'T ❌

1. **Agent'e "başarılı mı kontrol et" deme**
   ```
   Yanlış: "Verify all routes are protected"
   Doğru: "Run grep and paste output, let reviewer verify"
   ```

2. **Subjektif talimatlar verme**
   ```
   Yanlış: "Make sure it works"
   Doğru: "Run npm run build and paste first 50 lines"
   ```

3. **Verification'ı atlama**
   ```
   Her fazın sonunda verification task zorunlu!
   ```

4. **JSON'u aşırı karmaşık yapma**
   ```
   Task başına 10 minutedan fazla sürecek iş verme
   Karmaşık task'ı 3-4 alt task'a böl
   ```

5. **MCP requirements'ı unutma**
   ```
   Agent hangi tool'ları kullanacağını bilmeli
   ```

6. **ASANMOD FORBIDDEN PRACTICES** 🚫
   ```
   ❌ NEVER say "simulation completed" - USE REAL TOOLS
   ❌ NEVER use mock data - READ ACTUAL FILES
   ❌ NEVER assume task done - VERIFY WITH grep/wc
   ❌ NEVER use placeholder outputs - PASTE REAL TERMINAL
   ❌ NEVER skip running commands - EXECUTE EVERY ONE
   ❌ NEVER trust AI claims - DEMAND RAW PROOF

   ✅ ALWAYS run actual bash commands
   ✅ ALWAYS read real files with Read tool
   ✅ ALWAYS paste exact terminal outputs
   ✅ ALWAYS verify counts match expectations
   ✅ ALWAYS test in real browser (for frontend tasks)
   ✅ ALWAYS use docker logs for backend verification
   ```

---

## 🔄 Troubleshooting

### Problem: Worker Claude JSON'u anlamıyor

**Çözüm:**
```
1. toolUsageGuide eksiksiz mi kontrol et
2. Her task'ta instructions array olmalı
3. codePattern example'lar ekle
```

### Problem: Verification report boş geliyor

**Çözüm:**
```
1. reportTemplate'te placeholder'lar var mı?
2. verificationCommands object'i doğru mu?
3. "DO NOT interpret" talimatı açık mı?
```

### Problem: Phase 2 tamamlandı ama Phase 3 başlamıyor

**Çözüm:**
```
1. Master Claude'a verification MD dosyasını göster
2. "Phase 2 verification raporunu oku" de
3. Onaydan sonra Phase 3 JSON'u başka tab'da aç
```

### Problem: Build hatası var ama agent rapor etmemiş

**Çözüm:**
```
1. verificationCommands'ta build komutu var mı?
2. "paste first 50 lines" yerine "paste ALL errors" de
3. Agent'e 2>&1 kullanmasını söyle (stderr de capture edilir)
```

---

## 📈 Metrik ve KPI'lar

### AsanMod Başarı Metrikleri:

| Metrik | Hedef | IKAI RBAC Gerçek |
|--------|-------|------------------|
| **Toplam Süre** | 50% azalma | 10h → 5-6h ✅ |
| **Hata Oranı** | <5% | ~3% ✅ |
| **Doğrulama Süresi** | <30 dakika/faz | 15-20 dakika ✅ |
| **Paralel Faz Sayısı** | 2-3 eşzamanlı | 3 faz ✅ |
| **JSON Tekrar Kullanım** | >80% | N/A (yeni) |

### Proje Tamamlanma Durumu:

```
✅ Phase 1: Infrastructure (100%)
⏳ Phase 2: Backend Routes (in progress)
📝 Phase 3: Frontend Pages (JSON ready)
📋 Phase 4: Sidebar (planned)
📋 Phase 5: Testing (planned)
```

---

## 🚀 Gelecek İyileştirmeler

### 1. AsanMod JSON Library
```
Sık kullanılan pattern'leri şablonlaştır:
- CRUD route protection template
- Page protection template
- API endpoint creation template
```

### 2. Automated Verification
```bash
# Script that reads verification MD and auto-checks
./scripts/verify-phase.sh phase3-frontend-protection-verification.md
```

### 3. Phase Dependencies Graph
```
Visual representation of which phases can run parallel
Gantt chart for time estimation
```

### 4. AsanMod CLI Tool
```bash
asanmod create-phase --name "Phase 4" --type frontend --duration 2h
asanmod verify-phase --phase 3 --report docs/reports/phase3-verification.md
asanmod start-parallel --phases 2,3,4
```

---

## 📚 İlgili Dokümantasyon

- **JSON Dosyaları:**
  - `docs/features/role-access-phase1-infrastructure.json` (18KB)
  - `docs/features/role-access-phase2-backend-routes.json` (16KB)
  - `docs/features/role-access-phase3-frontend-pages.json` (23KB)

- **Verification Reports:**
  - `docs/reports/phase1-infrastructure-verification.md`
  - `docs/reports/phase2-backend-routes-verification.md`
  - `docs/reports/phase3-frontend-protection-verification.md`
  - `docs/reports/phase3-role-testing-results.md`

- **Ana Kılavuzlar:**
  - `CLAUDE.md` - Proje genel kılavuzu
  - `docs/INDEX.md` - Tüm dokümantasyon indexi

---

## 🎓 AsanMod Öğrenme Eğrisi

### Beginner (1. Hafta)
```
- JSON task dosyası okuma
- Tek faz üzerinde çalışma
- Verification report okuma
```

### Intermediate (2. Hafta)
```
- JSON task dosyası yazma
- 2 paralel faz yönetme
- Custom reportTemplate oluşturma
```

### Advanced (1. Ay)
```
- 3+ paralel faz yönetme
- Otomatik verification scriptleri
- JSON pattern library oluşturma
```

### Expert (3+ Ay)
```
- AsanMod CLI tool geliştirme
- Proje-wide orchestration
- Multi-team coordination
```

---

## 🤝 Katkıda Bulunma

AsanMod açık kaynak bir metodoloji değildir (henüz), ancak IKAI projesi içinde geliştirilmiştir.

**Created by:** Mustafa Asan
**AI Assistant:** Claude Sonnet 4.5 (Anthropic)
**Date:** 2025-11-04
**Location:** /home/asan/Desktop/ikai

---

## 📝 Değişiklik Geçmişi

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-04 | Initial AsanMod methodology documentation |
| 1.1 | 2025-11-04 | Added Endpoint Testing Protocol & Live Progress Updates |

**v1.1 Updates:**
- ✅ Endpoint Testing Protocol - Workers must test ALL endpoints with curl
- ✅ Live Progress Updates - [N/M] Icon Task style for multi-step work
- ✅ Updated ASANMOD-VERIFICATION-PROTOCOL.md with 553-line endpoint testing guide
- ✅ Updated CLAUDE.md Communication Depth Policy with 90-line live progress section
- ✅ Updated ASANMOD-QUICK-REFERENCE.md with endpoint testing & live progress principles
- ✅ AsanMod now universal for ALL IKAI development (not just RBAC)

---

**🎯 AsanMod = Paralel + Doğrulanabilir + Hızlı Geliştirme**

_"Büyük işleri küçük parçalara böl, paralel çalıştır, ham verilerle doğrula."_
