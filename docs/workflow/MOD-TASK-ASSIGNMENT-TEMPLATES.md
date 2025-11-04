# 📋 MOD - Task Assignment Templates (Copy-Paste Ready!)

**Version:** 1.0 (AsanMod v15.7)
**Purpose:** Standart görev atama mesajları (Mod → Worker)
**Usage:** Copy-paste, worker ID değiştir, gönder!

---

## 🎯 TEMPLATE STRUCTURE

**Her worker mesajı içerir:**
1. 📚 Gerekli dökümanlar (CLAUDE.md, AsanMod)
2. 🎭 Worker rolü (sen W1'sin)
3. 🎯 Görev tanımı (ne yapacak)
4. 📖 Kurallar (hangi rule'ları takip edecek)
5. 📄 Görev dosyası (detaylı instructions)
6. 🚀 Başlatma komutu (başla!)

---

## 📋 TEMPLATE 1: Mock Elimination Tasks (W1-W5)

### 🔴 W1 (USER) - Mock Elimination

```
📚 CLAUDE.md oku, AsanMod oku (MOD-PLAYBOOK + WORKER-PLAYBOOK)

🎭 Sen W1'sin (USER scope - Dashboard + Settings)

🎯 Görevin: USER scope mock/TODO elimination
- USER dashboard widgets
- Settings pages
- Profile pages
- Real API integration

📖 Kritik Kuralların:
- Rule 2: NO SIMULATION (real outputs only!)
- Rule 8: Production-Ready Delivery (NO mock, NO TODO!)
- Rule 11: Python First (NO curl!)
- Rule 12: Test in Target Environment (browser F12 MANDATORY!)
- Rule 13: ALWAYS use apiClient (NO fetch!)
- Rule 14: Dependency Installation (npm install + verify!)

📄 Görev dosyan: docs/tasks/WORKER-1-USER-MOCK-ELIMINATION.md

🚀 Bu dosyayı oku, tüm adımları uygula, bitti mi diye SORMA, tamamlayınca rapor ver!

Tahmini süre: 2 saat
Başla! 🔥
```

---

### 🟢 W2 (HR_SPECIALIST) - Mock Elimination

```
📚 CLAUDE.md oku, AsanMod oku (MOD-PLAYBOOK + WORKER-PLAYBOOK)

🎭 Sen W2'sin (HR_SPECIALIST scope - EN BÜYÜK SCOPE!)

🎯 Görevin: HR scope mock/TODO elimination
- HR dashboard widgets (9 widgets!)
- Candidates pages
- Analyses pages
- Interviews pages
- Wizard components
- Real API integration

📖 Kritik Kuralların:
- Rule 2: NO SIMULATION
- Rule 8: Production-Ready Delivery
- Rule 11: Python First (NO curl!)
- Rule 12: Test in Target Environment (browser MANDATORY!)
- Rule 13: ALWAYS use apiClient
- Rule 14: Dependency Installation

📄 Görev dosyan: docs/tasks/WORKER-2-HR-MOCK-ELIMINATION.md

⚠️ EN BÜYÜK SCOPE! Acele etme, her adımı dikkatli yap!

🚀 Dosyayı oku, uygula, rapor ver!

Tahmini süre: 3 saat
Başla! 🔥
```

---

### 🔵 W3 (MANAGER) - Mock Elimination

```
📚 CLAUDE.md oku, AsanMod oku (MOD-PLAYBOOK + WORKER-PLAYBOOK)

🎭 Sen W3'sün (MANAGER scope - Team Management)

🎯 Görevin: MANAGER scope mock/TODO elimination
- MANAGER dashboard widgets
- Team pages
- Department pages
- Reports pages
- Real API integration

📖 Kritik Kuralların:
- Rule 2: NO SIMULATION
- Rule 8: Production-Ready Delivery
- Rule 11: Python First (NO curl!)
- Rule 12: Test in Target Environment (browser MANDATORY!)
- Rule 13: ALWAYS use apiClient
- Rule 14: Dependency Installation

📄 Görev dosyan: docs/tasks/WORKER-3-MANAGER-MOCK-ELIMINATION.md

🚀 Dosyayı oku, uygula, rapor ver!

Tahmini süre: 2.5 saat
Başla! 🔥
```

---

### 🟣 W4 (ADMIN) - Mock Elimination

```
📚 CLAUDE.md oku, AsanMod oku (MOD-PLAYBOOK + WORKER-PLAYBOOK v2.3!)

🎭 Sen W4'sün (ADMIN scope - Organization Settings)

🎯 Görevin: ADMIN scope mock/TODO elimination
- ADMIN dashboard widgets
- Organization pages
- Users pages
- Team management
- Billing pages
- Real API integration

📖 Kritik Kuralların (ÖZELLİKLE YENİ KURALLARI OKU!):
- Rule 2: NO SIMULATION
- Rule 8: Production-Ready Delivery
- Rule 11: Python First (NO curl!)
- Rule 12: Test in Target Environment (browser + npm run build MANDATORY!) ⭐ NEW
- Rule 13: ALWAYS use apiClient (NO native fetch!) ⭐ NEW
- Rule 14: Dependency Installation (npm install + verify!) ⭐ NEW

⚠️ CRITICAL: npm install sonrası npm run build ÇOK ÖNEMLİ!

📄 Görev dosyan: docs/tasks/WORKER-4-ADMIN-MOCK-ELIMINATION.md

🚀 Dosyayı oku, YENİ KURALLARI uygula, rapor ver!

Tahmini süre: 2.5 saat
Başla! 🔥
```

---

### ⚡ W5 (SUPER_ADMIN) - Mock Elimination

```
📚 CLAUDE.md oku, AsanMod oku (MOD-PLAYBOOK + WORKER-PLAYBOOK v2.3!)

🎭 Sen W5'sin (SUPER_ADMIN scope - System Pages + Cross-Org!)

🎯 Görevin: SUPER_ADMIN scope mock/TODO elimination
- SUPER_ADMIN dashboard widgets
- Organizations page
- System health
- Security logs
- Queue management
- Real API integration (CROSS-ORG!)

📖 Kritik Kuralların (YENİ KURALLARI MUTLAKAÇok OKUYOR!):
- Rule 2: NO SIMULATION
- Rule 8: Production-Ready Delivery
- Rule 11: Python First (NO curl!)
- Rule 12: Test in Target Environment (browser F12 MANDATORY!) ⭐ NEW
- Rule 13: ALWAYS use apiClient (NO fetch!) ⭐ NEW
- Rule 15: Browser vs Docker Context (localhost for browser!) ⭐ NEW

⚠️ CRITICAL:
- Docker hostname (ikai-backend) → Browser'da ÇALIŞMAZ!
- NEXT_PUBLIC_API_URL = Browser code = localhost:8102
- apiClient kullan, fetch YASAK!
- Browser console (F12) kontrol et!

📄 Görev dosyan: docs/tasks/WORKER-5-SUPERADMIN-MOCK-ELIMINATION.md

🚀 Dosyayı oku, YENİ KURALLARI uygula, browser'dan test et, rapor ver!

Tahmini süre: 2 saat
Başla! 🔥
```

---

## 📋 TEMPLATE 2: Debugger & Build Task (W6)

### 🔧 W6 (DEBUGGER) - Final Build & QA

```
📚 CLAUDE.md oku, AsanMod oku (MOD-PLAYBOOK + WORKER-PLAYBOOK v2.3!)

🎭 Sen W6'sın (DEBUGGER & BUILD MASTER - Final Gate!)

🎯 Görevin: W1-W5 sonrası QA + Final Build
- Error scan (TypeScript, ESLint, Console)
- Bug fixing (her fix 1 commit!)
- Deep clean (cache clear!)
- Final build (0 error!)
- Integration test (5 role - Python!)
- Cross-verify all workers
- Final report

📖 Kritik Kuralların:
- Rule 2: NO SIMULATION
- Rule 11: Python First (integration test!)
- Rule 12: Test in Target Environment (browser + build!)
- Rule 13: Enforce apiClient (migrate if needed!)

⚠️ SEN SON KAPI! W1-W5'ten gelen hataları YAKALA ve FİXLE!

📄 Görev dosyan: docs/tasks/WORKER-6-DEBUGGER-FINAL-BUILD.md

🚨 W1-W5 tamamlanmadan BAŞLAMA!

🚀 W1-W5 bitti mi? Dosyayı oku, uygula, rapor ver!

Tahmini süre: 1-1.5 saat
Başla! 🔥
```

---

## 📋 TEMPLATE 3: Sidebar Audit Task (W1 Second Task)

### 🔍 W1 (Sidebar) - Post-Implementation Audit

```
📚 CLAUDE.md oku, AsanMod oku

🎭 Sen W1'sin (Sidebar Menu Master - İkinci görev!)

🎯 Görevin: Sidebar audit & update
- Tüm authenticated pages'i tara (Python!)
- Mevcut sidebar ile karşılaştır
- Eksik sayfaları bul
- Mantıksal sırada ekle (HR workflow order!)
- 5 role visibility test
- Rapor yaz

📖 Kritik Kuralların:
- Rule 11: Python First (page discovery!)
- Rule 12: Test in Target Environment (browser test!)
- Rule 13: Use apiClient

⚠️ MANTIKSAL SIRA ÇOK ÖNEMLİ:
1. Dashboard (always first!)
2. HR Workflow (job → candidate → analysis → interview → offer)
3. Team Management
4. Reports
5. Admin
6. Super Admin
7. Settings (always last!)

📄 Görev dosyan: docs/tasks/WORKER-1-SIDEBAR-AUDIT-UPDATE.md

🚨 W6 tamamlanmadan BAŞLAMA! (W6 build temizlemeli önce)

🚀 W6 bitti mi? Dosyayı oku, uygula, rapor ver!

Tahmini süre: 1.5 saat
Başla! 🔥
```

---

## 📋 TEMPLATE 4: General Task Assignment

### 🎯 Generic Worker Task

```
📚 CLAUDE.md oku, AsanMod oku (MOD-PLAYBOOK + WORKER-PLAYBOOK v2.3)

🎭 Sen W[X]'sin ([ROLE] scope - [DESCRIPTION])

🎯 Görevin: [TASK NAME]
- [Subtask 1]
- [Subtask 2]
- [Subtask 3]
- Real API integration

📖 Kritik Kuralların:
- Rule 2: NO SIMULATION (real outputs!)
- Rule 8: Production-Ready (NO mock, NO TODO!)
- Rule 11: Python First (NO curl!)
- Rule 12: Test in Browser (F12 console!)
- Rule 13: Use apiClient (NO fetch!)
- Rule 14: npm install + verify!
- [Add task-specific rules]

📄 Görev dosyan: docs/tasks/[TASK-FILE].md

⚠️ [ÖZEL UYARILAR - task'a özel]

🚀 Dosyayı oku, uygula, rapor ver!

Tahmini süre: [X] saat
Başla! 🔥
```

---

## 🎨 TEMPLATE CUSTOMIZATION GUIDE

### Mod Task Assignment Checklist

**Görev vermeden önce:**

1. ✅ Task file hazırlandı mı? (`docs/tasks/WORKER-X-*.md`)
2. ✅ Worker scope açık mı? (hangi dosyalar)
3. ✅ İlgili kurallar belirlendi mi?
4. ✅ Tahmini süre gerçekçi mi?
5. ✅ Dependencies var mı? (W6'dan sonra vs)

**Template hazırlarken:**

```markdown
📚 [Always same - CLAUDE.md + AsanMod]

🎭 Sen W[NUMBER]'sin ([ROLE] scope - [1-2 kelime açıklama])

🎯 Görevin: [Task name]
[3-5 bullet subtask]

📖 Kritik Kuralların:
[List relevant rules - always include 2, 8, 11, 12, 13]
[Add task-specific rules]

📄 Görev dosyan: docs/tasks/[FILE].md

⚠️ [Task-specific warnings]
[CRITICAL items]
[What to watch out for]

🚀 Dosyayı oku, uygula, rapor ver!

Tahmini süre: [X] saat
Başla! 🔥
```

---

## 📞 USAGE EXAMPLES

### Example 1: Starting 5 Parallel Workers

**Mod opens 5 tabs, sends:**

**Tab 1 (W1):**
```
📚 CLAUDE.md oku, AsanMod oku
🎭 Sen W1'sin (USER scope)
🎯 Görevin: Mock elimination
📖 Kurallar: 2, 8, 11, 12, 13, 14
📄 Dosya: docs/tasks/WORKER-1-USER-MOCK-ELIMINATION.md
🚀 Başla!
```

**Tab 2 (W2):**
```
📚 CLAUDE.md oku, AsanMod oku
🎭 Sen W2'sin (HR_SPECIALIST scope - EN BÜYÜK!)
🎯 Görevin: HR mock elimination
📖 Kurallar: 2, 8, 11, 12, 13, 14
📄 Dosya: docs/tasks/WORKER-2-HR-MOCK-ELIMINATION.md
🚀 Başla!
```

**Tab 3-5:** (Same pattern...)

**Result:** 5 workers start immediately, clearly know their role!

---

### Example 2: Sequential Task (W6 After W1-W5)

**Mod waits for W1-W5 completion, then:**

**Tab 6 (W6):**
```
📚 CLAUDE.md oku, AsanMod oku
🎭 Sen W6'sın (DEBUGGER & BUILD MASTER - SON KAPI!)
🎯 Görevin: Debug + Final build
📖 Kurallar: 2, 11, 12, 13 + Enforce all standards
📄 Dosya: docs/tasks/WORKER-6-DEBUGGER-FINAL-BUILD.md
⚠️ W1-W5 tamamlandı, sen SON KAPI!
🚀 Başla!
```

---

### Example 3: Second Task Assignment

**W1 finishes mock elimination, Mod assigns sidebar:**

**To W1:**
```
📚 CLAUDE.md oku, AsanMod oku
🎭 Sen W1'sin (İKİNCİ GÖREV: Sidebar Menu Master!)
🎯 Görevin: Sidebar audit & update
📖 Kurallar: 11 (Python!), 12 (Browser test!), 13 (apiClient!)
📄 Dosya: docs/tasks/WORKER-1-SIDEBAR-AUDIT-UPDATE.md
⚠️ W6 tamamlandı, sidebar'a eksik sayfalar ekle!
🚀 Başla!
```

---

## 🎯 QUICK REFERENCE CARDS

### W1 Quick Card

```
W1 (USER)
Scope: Dashboard + Settings
Rules: 2, 8, 11, 12, 13, 14
File: WORKER-1-[TASK].md
Time: ~2h
```

### W2 Quick Card

```
W2 (HR_SPECIALIST) ⚠️ LARGEST
Scope: HR + Candidates + Wizard
Rules: 2, 8, 11, 12, 13, 14
File: WORKER-2-[TASK].md
Time: ~3h
```

### W3 Quick Card

```
W3 (MANAGER)
Scope: Team + Reports
Rules: 2, 8, 11, 12, 13, 14
File: WORKER-3-[TASK].md
Time: ~2.5h
```

### W4 Quick Card

```
W4 (ADMIN) ⚠️ Re-read Rule 14!
Scope: Organization + Users
Rules: 2, 8, 11, 12, 13, 14
File: WORKER-4-[TASK].md
Time: ~2.5h
```

### W5 Quick Card

```
W5 (SUPER_ADMIN) ⚠️ Re-read Rule 15!
Scope: System + Cross-org
Rules: 2, 8, 11, 12, 13, 15
File: WORKER-5-[TASK].md
Time: ~2h
```

### W6 Quick Card

```
W6 (DEBUGGER) - After W1-W5!
Scope: ALL (QA + Build)
Rules: 2, 11, 12, 13 + Enforce standards
File: WORKER-6-[TASK].md
Time: ~1.5h
```

---

## 📝 RULE NUMBER QUICK REFERENCE

**For quick inclusion in messages:**

```
Rule 2:  NO SIMULATION (real outputs only!)
Rule 8:  Production-Ready Delivery (NO mock, NO TODO!)
Rule 11: Python First (NO curl for API tests!)
Rule 12: Test in Target Environment (browser F12 + npm run build!) ⭐
Rule 13: ALWAYS use apiClient (NO native fetch!) ⭐
Rule 14: Dependency Installation Protocol (npm install + verify!) ⭐
Rule 15: Browser vs Docker Context (localhost for browser!) ⭐

⭐ = NEW (AsanMod v15.7 - W6 Lessons Learned)
```

---

## 🔄 MULTI-PHASE WORKFLOW

### Phase 1: Mock Elimination

**Mod sends:**
- W1-W5 prompts (parallel)
- Each with mock elimination task
- Standard rules: 2, 8, 11, 12, 13, 14

**Workers execute** → Report to Mod

---

### Phase 2: Debugging

**Mod sends:**
- W6 prompt (after W1-W5)
- Debug + build task
- Enforce standards

**W6 executes** → Report to Mod

---

### Phase 3: Sidebar/UI

**Mod sends:**
- W1 prompt (after W6)
- Sidebar audit task
- Python discovery + manual update

**W1 executes** → Report to Mod

---

## 📋 MOD WORKFLOW WITH TEMPLATES

### Step 1: Prepare Task Files

```bash
# Create task files (or use existing)
docs/tasks/WORKER-1-[TASK].md
docs/tasks/WORKER-2-[TASK].md
...
```

### Step 2: Open Tabs

```
Open 5-6 browser tabs (one per worker)
```

### Step 3: Copy-Paste Templates

```
Tab 1: [W1 template from above]
Tab 2: [W2 template from above]
Tab 3: [W3 template from above]
...
```

### Step 4: Send All at Once

```
Send all 5 messages simultaneously (parallel start!)
```

### Step 5: Monitor

```
Workers execute → Mod waits
Each worker reports → Mod verifies independently
All verified → Next phase!
```

---

## 🎯 BENEFITS

**For Mod:**
- ✅ Copy-paste ready (no thinking, fast!)
- ✅ Consistent messaging
- ✅ Clear role assignment
- ✅ No ambiguity

**For Workers:**
- ✅ Immediately understand role
- ✅ Know which rules to follow
- ✅ Know where to find details
- ✅ Can start right away

**For User:**
- ✅ Easy to distribute tasks (copy-paste!)
- ✅ Clear workflow
- ✅ Fast parallel execution

---

## 🚨 CRITICAL REMINDERS

**Always include:**
- 📚 CLAUDE.md + AsanMod (context!)
- 🎭 Worker role (identity!)
- 📖 Relevant rules (guidance!)
- 📄 Task file (details!)

**Never forget:**
- ⚠️ Task-specific warnings
- ⏰ Time estimate
- 🚀 "Başla!" (start signal)

**For failed workers (W4, W5):**
- ⚠️ Emphasize NEW rules
- ⚠️ Reference their failures
- ⚠️ Extra warnings

---

## 📚 VERSION HISTORY

**v1.0 (2025-11-04):**
- Initial templates created
- 6 worker templates (W1-W6)
- Generic template
- Quick reference cards
- Rule number reference

**Purpose:**
- Standardize Mod → Worker communication
- Make task assignment instant (copy-paste!)
- Ensure workers get all context
- Reduce Mod cognitive load

---

**🎯 MOD: COPY-PASTE THESE TEMPLATES TO START WORKERS INSTANTLY!**
