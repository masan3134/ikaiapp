# 🎯 AsanMod Core - Universal System

**Version:** 17.0 (MCP Integration + Rule 6)
**Date:** 2025-11-05
**Purpose:** Minimal rules + Template system = Fast coordination

---

## 📖 What is AsanMod?

**Parallel task execution with verifiable results.**

- 1 Mod coordinates
- 6 Workers execute
- Templates guide everyone
- User copy-pastes between tabs

---

## 🎭 Two Roles

### MOD (Coordinator)
- Creates tasks (short!)
- Verifies results
- Coordinates workers

### WORKER (Executor)
- Reads task (short!)
- Follows template
- Reports result (short!)

---

## 🚨 5 Core Rules (EVERYONE)

### Rule 1: Template-Based Work
```
❌ Long instructions
✅ Template reference + details

Example:
Mod: "Use widget.md, Role: USER, Name: RecentActivity"
Worker: Knows widget.md, applies it
```

### Rule 2: Commit Every File
```
1 file change = 1 commit
NO batching!

Format:
<type>(<scope>): <subject>

Example:
feat(dashboard): Add RecentActivity widget
```

### Rule 3: Short Communication
```
Task: 3-5 lines max
Report: 3-5 lines max

Use: Emoji + file ref + status

MOD OUTPUT STYLE:
- Tablo kullan (görsel)
- Checklist format
- Status icons (✅ ❌ ⏳ 🔄)
- Kısa Insight (1-2 cümle, net)
```

### Rule 4: Raw Data Only
```
❌ "Everything works fine"
✅ Paste exact terminal output

Mod verifies by re-running commands
```

### Rule 5: Turkish to User
```
✅ "Widget eklendi ✅"
❌ "Widget added successfully"

Technical terms in English OK (commit, grep, etc)
```

### Rule 6: MCP-First Verification
```
🔌 ALWAYS use MCP for verification!

Mod verification:
✅ postgres.count({table: "users"})
✅ playwright.navigate({url: "http://localhost:8103/..."})
✅ docker.health()
✅ code_analysis.build_check()

Worker workflow:
1. docker.health() → Start
2. (Work...)
3. code_analysis.typescript_check() → Pre-commit
4. code_analysis.build_check() → Pre-commit
5. playwright.console_errors() → Frontend
6. postgres.count() → Database
7. docker.health() → End

CRITICAL:
- PostgreSQL: Lowercase tables ("users" not "User")
- Playwright: Localhost URLs (not Docker hostnames)
- Exit code 0 = Success, 1 = Failed

NO MCP = NO VERIFICATION
```

### Rule 7: RBAC & Multi-Tenant
```
🔒 Security = Follow the pattern master!

When adding features:
✅ Read: RBAC-MULTITENANT-PATTERN-MASTER.md
✅ Copy backend pattern (auth + org isolation)
✅ Copy frontend pattern (role protection)
✅ Copy test pattern (RBAC matrix)

5 Roles:
- SUPER_ADMIN: All orgs
- ADMIN: Own org
- HR_SPECIALIST: Own org
- MANAGER: Own dept only
- USER: Self only

Reference: docs/workflow/RBAC-MULTITENANT-PATTERN-MASTER.md
```

---

## 📁 System Structure

```
docs/workflow/
├── ASANMOD-CORE.md (this file)
│
├── templates/
│   ├── frontend/
│   │   ├── widget.md
│   │   ├── protect.md
│   │   └── component.md
│   │
│   ├── backend/
│   │   ├── api.md
│   │   └── middleware.md
│   │
│   ├── database/
│   │   └── migration.md
│   │
│   └── testing/
│       ├── puppeteer.md
│       └── verify.md
│
└── reference/ (optional deep dive)
    ├── MOD-PLAYBOOK.md (old, detailed)
    └── WORKER-PLAYBOOK.md (old, detailed)
```

---

## 🚀 Quick Start

### First Time (10 minutes)
```
1. Read ASANMOD-CORE.md (this file)
2. Read your role rules (mod or worker)
3. Skim template names
4. Start working!
```

### Daily Work (seconds)
```
Mod: "Use widget.md, details: X"
Worker: Apply widget.md template
Worker: Report in 3 lines
```

---

## 💬 Communication Format

### Task Assignment
```
W1: widget.md
Role: USER
Name: RecentActivity
File: frontend/components/dashboard/user/RecentActivity.tsx
```

### Task Report
```
✅ RecentActivity widget done
Commit: abc123
Test: PASS
```

### Verification
```
✅ Verified
Count: 5 (expected: 5)
Build: SUCCESS
```

---

## 📋 Available Templates

### Frontend
- `widget.md` - Add dashboard widget
- `protect.md` - Protect page with RBAC
- `component.md` - Create component
- `page.md` - Add new page

### Backend
- `api.md` - Add API endpoint
- `middleware.md` - Add middleware
- `route.md` - Update route

### Database
- `migration.md` - Add column/table

### Testing
- `puppeteer.md` - Browser test
- `verify.md` - Mod verification

### Maintenance
- `fix.md` - Bug fix
- `refactor.md` - Code refactor

---

## 🎯 Workflow Example

### Scenario: Add widget to USER dashboard

**Mod (3 lines):**
```
W1: widget.md
Role: USER, Name: RecentActivity
```

**Worker reads widget.md, executes, reports (3 lines):**
```
✅ RecentActivity done
Commit: abc123
```

**Mod verifies (2 lines):**
```
✅ Verified
Count: 5/5 ✅
```

**Done!** (8 lines total, not 1,300!)

---

## 📚 When to Read Reference

**Never read unless:**
- You don't understand core rules
- Template is unclear
- Complex edge case

**Reference = optional deep dive (old detailed playbooks)**

---

## 🔄 System Evolution

**Each session:**
- Templates improve
- New templates added
- System gets faster

**Self-improving!**

---

## ✅ Success Metrics

**Old System:**
- Task: 500 lines
- Report: 800 lines
- User copies: 5 minutes

**New System (v16.0):**
- Task: 3 lines
- Report: 3 lines
- User copies: 10 seconds

**50x faster coordination!** 🚀

---

**Read next:** Your role rules (MOD-RULES.md or WORKER-RULES.md)
**Templates:** Browse docs/workflow/templates/
**Reference:** docs/workflow/reference/ (if needed)
