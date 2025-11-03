# AsanMod Quick Reference Card

**Version:** 1.0 | **Date:** 2025-11-04
**Full Docs:** [ASANMOD-METHODOLOGY.md](ASANMOD-METHODOLOGY.md)

---

## 🎯 What is AsanMod?

**Parallel + Verifiable + Fast Development Methodology**

Big projects → Split into phases → Execute in parallel tabs → Verify with raw data

---

## 🚀 Quick Start

### User says: "AsanMod"

**Claude switches to AsanMod mode:**
1. Create ultra-detailed JSON task files
2. User executes in parallel browser tabs
3. Claude verifies completion by reading MD reports (raw terminal outputs)
4. Next phase starts

---

## 📋 Common Commands

| User Says | Claude Does |
|-----------|-------------|
| `asanmod` or `AsanMod` | Switch to AsanMod workflow mode |
| `p1 hazırla` | Create Phase 1 JSON with all tasks |
| `p1 başladı p2 hazırla` | P1 running elsewhere, prepare P2 |
| `p1 bitti doğrula` | Read `docs/reports/phase1-verification.md` and verify |
| `p2 başladı 3 hazurla` | P2 running, prepare P3 |

---

## 📝 JSON Task File Structure

```json
{
  "phase": "Phase X - Title",
  "mcpRequirements": {
    "required": ["filesystem"],
    "usage": { "filesystem": "Read/edit files" }
  },
  "toolUsageGuide": {
    "forTasks_X_to_Y": {
      "step1": "Use Read tool...",
      "step2": "Use Edit tool..."
    }
  },
  "tasks": [
    {
      "id": "X.1",
      "file": "path/to/file.tsx",
      "instructions": ["1. Read", "2. Edit", "3. Verify"],
      "codePattern": "// Exact code..."
    }
  ]
}
```

**Key elements:**
- `mcpRequirements` - Which MCP servers needed
- `toolUsageGuide` - How to use tools (Read, Edit, Write, Bash)
- `reportTemplate` - MD template for verification reports
- `verificationCommands` - Bash commands to run (no interpretation!)

---

## ✅ Verification Reports (Raw Data Only!)

**WRONG (AI can lie):**
```
✅ Task completed successfully
✅ All 19 pages protected
```

**RIGHT (AsanMod raw data):**
```markdown
## 1. Protected Pages Count

```bash
$ grep -r 'withRoleProtection' frontend/app/ | wc -l
```

**Output:**
```
19
```

**Expected:** 19
```

**Why?** Master Claude reads MD and sees "19" from terminal → Cannot be faked!

---

## 🚫 ASANMOD STRICT MODE

**FORBIDDEN PRACTICES:**
```
❌ NO simulation or mocking - REAL tools only
❌ NO placeholder outputs - REAL terminal data
❌ NO "completed successfully" - show PROOF
❌ NO fake browser tests - HUMAN must test
❌ NO assumptions - VERIFY with grep/Read
❌ NO skipping commands - RUN every one
```

**REQUIRED PRACTICES:**
```
✅ ALWAYS use Bash tool for real commands
✅ ALWAYS use Read tool before Edit
✅ ALWAYS paste exact terminal outputs
✅ ALWAYS verify file exists (Read/Glob)
✅ ALWAYS run real npm build/docker logs
✅ ALWAYS let reviewer decide completion
✅ ALWAYS test endpoints with curl (real HTTP responses)
✅ ALWAYS show live progress updates [N/M] 🔍
```

**VERIFICATION PRINCIPLE:**
> "Ham veri konuşur" - AI cannot lie with real grep/wc outputs!

**ENDPOINT TESTING PRINCIPLE:**
> Worker MUST test ALL endpoints with curl - Mod re-runs same curl to verify!

**LIVE PROGRESS PRINCIPLE:**
> [N/M] Icon Task - User sees what's happening NOW

---

## 🔧 MCP & Tool Usage

| Tool | AsanMod Usage |
|------|---------------|
| **Read** | Read existing files before editing |
| **Edit** | Make changes to files (old_string → new_string) |
| **Write** | Create new files (reports, JSON outputs) |
| **Bash** | Run verification commands (grep, build, docker logs) |
| **Glob** | Find files by pattern |
| **Grep** | Search code content |

**Required MCPs:**
- `filesystem` - File operations (read/write/edit)
- `git` - Optional for commits

---

## 📊 Workflow Diagram

```
┌─────────────┐
│   Master    │  "p1 hazırla"
│   Claude    │────────────────► Create phase1.json (18KB)
│  (This tab) │
└─────────────┘
       │
       │ User opens new tab
       ▼
┌─────────────┐
│   Worker    │  Reads phase1.json
│   Claude    │  Executes 7 tasks
│  (Tab 2)    │  Creates verification MD
└─────────────┘
       │
       │ "p1 bitti doğrula"
       ▼
┌─────────────┐
│   Master    │  Reads docs/reports/phase1-verification.md
│   Claude    │  Sees raw grep outputs
│  (This tab) │  Verifies: "✅ 6 files created, imports correct"
└─────────────┘
```

---

## 🎓 AsanMod Checklist

**When creating JSON:**
- [ ] mcpRequirements added with "required" and "usage"
- [ ] toolUsageGuide for each task group
- [ ] Verification task with reportTemplate
- [ ] verificationCommands object with bash commands
- [ ] codePattern examples (copy-pasteable)
- [ ] Instructions say "DO NOT interpret - paste RAW output"
- [ ] **ASANMOD_STRICT_MODE section added (FORBIDDEN/REQUIRED lists)**
- [ ] **Explicit warnings: NO simulation, NO mocking, NO placeholders**

**When verifying:**
- [ ] Read verification MD file
- [ ] Check raw terminal outputs (grep, wc -l, build logs)
- [ ] Count matches expected numbers
- [ ] **Check endpoint test sections (curl outputs, status codes)**
- [ ] **Re-run Worker's curl commands - compare HTTP responses**
- [ ] Report findings to user
- [ ] DON'T trust "completed successfully" - verify with data!
- [ ] **NEVER accept simulated/mocked/placeholder outputs**
- [ ] **ALWAYS demand real Bash executions and Read confirmations**
- [ ] **Show live progress during verification [N/M] Icon**

---

## 🔥 Real Example: IKAI RBAC

**Problem:** 130 routes + 21 pages unprotected

**AsanMod Solution:**
1. **Phase 1:** Infrastructure (1.5h) - 6 files created
2. **Phase 2:** Backend routes (3h) - 130 routes protected
3. **Phase 3:** Frontend pages (2.5h) - 19 pages protected

**Result:** 7 hours total (vs 10-12 traditional) = **2x faster**

**Files created:**
- `role-access-phase1-infrastructure.json` (18KB)
- `role-access-phase2-backend-routes.json` (16KB)
- `role-access-phase3-frontend-pages.json` (23KB)

**Verification:**
- `phase1-infrastructure-verification.md` (raw file list)
- `phase2-backend-routes-verification.md` (grep outputs)
- `phase3-frontend-protection-verification.md` (build logs)

---

## 💡 Key Principles

### 1. Paralel (Parallel)
```
Tab 1: Phase 3 preparing
Tab 2: Phase 2 executing
Tab 3: Phase 1 verifying
```

### 2. Doğrulanabilir (Verifiable)
```
Agent cannot lie with grep output:
19 files found = 19 files exist
```

### 3. Ham Veri (Raw Data)
```
No interpretation, just paste terminal output
Master Claude reads and decides
```

### 4. Ultra-Detaylı (Ultra-Detailed)
```
Every task has:
- Exact file path
- Step-by-step instructions
- Code pattern to copy
- Verification command
```

---

## 🚨 Troubleshooting

**Problem:** Worker Claude doesn't follow JSON
**Solution:** Add more detail to toolUsageGuide

**Problem:** Verification report empty
**Solution:** Check reportTemplate has placeholders: `[PASTE_OUTPUT_HERE]`

**Problem:** Build errors not reported
**Solution:** verificationCommands must use `2>&1` to capture stderr

**Problem:** User says "done" but no MD file
**Solution:** Never trust "done" - always ask for MD report path

---

## 📚 Related Docs

- **Full Methodology:** [ASANMOD-METHODOLOGY.md](ASANMOD-METHODOLOGY.md) (20KB)
- **CLAUDE.md:** AsanMod section added (see line 13-39)
- **INDEX.md:** Workflow category added

**Example JSON Files:**
- [Phase 1 Infrastructure](../features/role-access-phase1-infrastructure.json)
- [Phase 2 Backend Routes](../features/role-access-phase2-backend-routes.json)
- [Phase 3 Frontend Pages](../features/role-access-phase3-frontend-pages.json)

---

## 🎯 Remember

**User says "AsanMod"** → You know exactly what to do:

1. Create JSON with mcpRequirements + toolUsageGuide + reportTemplate
2. User opens new tab, executes
3. You read MD report (raw grep/build outputs)
4. Verify with data, not trust
5. Prepare next phase

**AsanMod = Speed × Verification × Parallel = 2-3x Faster!**

---

**Created:** 2025-11-04 by Mustafa Asan + Claude Sonnet 4.5
