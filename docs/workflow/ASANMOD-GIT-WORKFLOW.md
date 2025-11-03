# AsanMod Git Workflow Protocol

**Version:** 1.0
**Date:** 2025-11-04
**Purpose:** Standardize Git operations between Mod and Worker roles

---

## 🎯 The Problem

**Without Git standards:**
- Worker commits directly to `main` → breaks production
- Mod cannot review code before merge
- No rollback mechanism for bad Worker code
- Conflicts when Worker and Mod work simultaneously
- Unclear who commits, who approves, who merges

**AsanMod Solution:**
- Worker works in feature branches
- Worker commits after each task completion
- Mod reviews Worker's commits before merge
- Clear Git responsibilities for each role

---

## 🌳 Branch Strategy

### Main Branch Protection

**`main` branch rules:**
- ✅ Only Mod can merge to `main`
- ✅ Only verified phases get merged
- ❌ Worker CANNOT push directly to `main`
- ❌ No force-push allowed
- ✅ Production-ready code only

### Worker Branch Naming

**Format:** `asanmod/phase-N-description`

**Examples:**
```bash
asanmod/phase1-infrastructure
asanmod/phase2-backend-routes
asanmod/phase3-frontend-pages
asanmod/phase4-sidebar-navigation
asanmod/phase5-final-testing
```

**Why this format?**
- `asanmod/` prefix → Easy filtering
- `phase-N` → Clear phase number
- `description` → Human-readable purpose
- Easy to find: `git branch --list "asanmod/*"`

---

## 👷 Worker Git Workflow

### Step 1: Create Phase Branch

**Before starting phase work:**

```bash
# Worker creates new branch from main
git checkout main
git pull origin main
git checkout -b asanmod/phase3-frontend-pages
```

**Push branch to remote immediately:**
```bash
git push -u origin asanmod/phase3-frontend-pages
```

**Why push empty branch?**
- Mod knows Worker started phase
- Backup if Worker's machine crashes
- Transparency (visible in GitHub)

### Step 2: Work on Tasks

Worker executes tasks from phase JSON, making commits after each task.

**Commit frequency:**
- ✅ After each task completion (Task 3.1 done → commit)
- ✅ After verification report created → commit
- ❌ NOT after every file edit (too granular)
- ❌ NOT at end of entire phase (too large)

**Example workflow:**
```bash
# Task 3.1: Protect job-postings page
# Worker edits file, tests, verifies

git add frontend/app/(authenticated)/job-postings/page.tsx
git commit -m "asanmod: Task 3.1 - Protect job-postings page with HR_MANAGERS role

- Wrapped with withRoleProtection HOC
- Required roles: RoleGroups.HR_MANAGERS
- Tested with grep: import found
- Related: Phase 3 Frontend Pages Protection

🤖 AsanMod Worker - Phase 3 Task 3.1"

git push origin asanmod/phase3-frontend-pages
```

### Step 3: Create Verification Report Commit

**After all phase tasks complete:**

```bash
# Worker creates verification MD report
# Runs all verification commands (grep, build, docker logs)
# Pastes REAL outputs to MD file

git add docs/reports/phase3-frontend-protection-verification.md
git commit -m "asanmod: Phase 3 Verification Report

- Created verification MD with RAW outputs
- 16 pages protected (grep output included)
- Build test output included
- Console logs included
- Ready for Mod cross-check

🤖 AsanMod Worker - Phase 3 Complete"

git push origin asanmod/phase3-frontend-pages
```

### Step 4: Report to Mod

**Worker notifies Mod:**

```
"Phase 3 complete.
Branch: asanmod/phase3-frontend-pages
Verification: docs/reports/phase3-frontend-protection-verification.md
Commits: 17 (1 per task + 1 verification)
Ready for review."
```

### Step 5: Wait for Mod Approval

**Worker MUST NOT:**
- ❌ Merge to `main` themselves
- ❌ Start Phase 4 before Mod approves Phase 3
- ❌ Delete branch before Mod merge
- ❌ Force-push or rewrite history

**Worker can:**
- ✅ Fix issues if Mod finds problems
- ✅ Push additional commits to same branch
- ✅ Respond to Mod's feedback

---

## 🔍 Mod Git Workflow

### Step 1: Worker Reports "Done"

Mod receives notification:
```
Worker: "Phase 3 bitti, branch: asanmod/phase3-frontend-pages"
```

### Step 2: Checkout Worker's Branch

**Mod checks out Worker branch locally:**

```bash
# Fetch latest from remote
git fetch origin

# Checkout Worker's branch
git checkout asanmod/phase3-frontend-pages
git pull origin asanmod/phase3-frontend-pages
```

**Why checkout Worker's branch?**
- See exact code Worker wrote
- Run verification commands on Worker's code
- Ensure Worker's commits match their MD report

### Step 3: Read Verification Report

```bash
# Mod reads Worker's verification MD
cat docs/reports/phase3-frontend-protection-verification.md
```

**Mod analyzes:**
- Worker's grep outputs
- Worker's build outputs
- Worker's console log checks
- Worker's claimed numbers

### Step 4: Re-Run Verification Commands

**CRITICAL:** Mod MUST re-run ALL commands Worker claimed to run.

```bash
# Example: Verify protected pages count
grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l
# Mod's output: 16
# Worker's output (from MD): 16
# Match? YES ✅

# Example: Verify imports
grep -r "import.*withRoleProtection" frontend/app/(authenticated) --include='page.tsx' | wc -l
# Mod's output: 16
# Worker's output (from MD): 16
# Match? YES ✅

# Build test
cd frontend && npm run build 2>&1 | head -50
# Mod sees: [build output]
# Compare with Worker's MD report
```

**Mod cross-check result:**
- ✅ **ALL outputs match** → Worker used REAL tools → VERIFIED
- ❌ **ANY mismatch** → Worker LIED → Reject branch, request re-work

### Step 5: Update Verification Report

**Mod adds cross-check section to Worker's MD:**

```bash
# Mod edits verification MD file
nano docs/reports/phase3-frontend-protection-verification.md

# Add Mod's cross-check section:
## MOD CROSS-CHECK VERIFICATION

**Mod Re-Ran Commands:** 2025-11-04

### 1. Protected Pages Count
**Mod's Output:** 16
**Worker's Output:** 16
**Match?** ✅ YES

### 2. Import Statements
**Mod's Output:** 16
**Worker's Output:** 16
**Match?** ✅ YES

...

## MOD VERDICT

✅ **WORKER OUTPUT VERIFIED - NO FAKE DATA DETECTED**

All Worker outputs match Mod's re-run results. Worker used REAL tools.
Phase 3 approved for merge to main.

---

**Mod commit:**
git add docs/reports/phase3-frontend-protection-verification.md
git commit -m "asanmod: Mod cross-check verification for Phase 3

- Re-ran all verification commands
- Compared outputs with Worker's report
- All outputs match (16 pages, 16 imports)
- Worker used REAL tools confirmed
- Phase 3 VERIFIED and approved

✅ AsanMod Mod - Phase 3 Verified"

git push origin asanmod/phase3-frontend-pages
```

### Step 6: Merge to Main (if Verified)

**If ALL checks pass:**

```bash
# Switch to main
git checkout main
git pull origin main

# Merge Worker's branch (no fast-forward for clear history)
git merge --no-ff asanmod/phase3-frontend-pages -m "asanmod: Merge Phase 3 - Frontend Pages Protection

Phase: Phase 3 - Frontend Pages Protection
Branch: asanmod/phase3-frontend-pages
Worker: Claude Worker
Mod Verification: PASSED (all outputs match)

Changes:
- 16 frontend pages protected with withRoleProtection HOC
- Role configurations verified (HR_MANAGERS, ADMINS, etc.)
- Build test completed
- Console logs clean

Verification Report:
- docs/reports/phase3-frontend-protection-verification.md
- Mod cross-check: All Worker outputs verified

✅ AsanMod Mod - Phase 3 Merged to Main"

# Push to remote
git push origin main

# Delete Worker's branch (cleanup)
git branch -d asanmod/phase3-frontend-pages
git push origin --delete asanmod/phase3-frontend-pages
```

**Merge commit format:**
- Clear phase description
- Worker branch name
- Verification status
- Changes summary
- Link to verification report

### Step 7: Notify Worker

**Mod confirms to Worker:**

```
"✅ Phase 3 VERIFIED and merged to main.
- All outputs matched (16 pages protected)
- Branch asanmod/phase3-frontend-pages merged
- Branch deleted (cleanup)
- Ready for Phase 4"
```

### Step 8: If Verification Fails

**If Mod finds mismatches:**

```
"❌ Phase 3 VERIFICATION FAILED

Mismatch in Section 2:
- Worker claimed: 16 protected pages
- Mod's grep output: 12 protected pages
- 4 files missing withRoleProtection

Action required:
1. Fix missing protections
2. Re-run verification commands
3. Update verification MD with REAL outputs
4. Push to asanmod/phase3-frontend-pages
5. Notify Mod for re-review

Branch NOT merged. Phase 4 BLOCKED until Phase 3 verified."
```

**Worker fixes issues:**

```bash
# Worker still on asanmod/phase3-frontend-pages branch
# Fix the 4 missing files
# Re-run verification commands
# Update MD report with correct outputs

git add [fixed files]
git add docs/reports/phase3-frontend-protection-verification.md
git commit -m "asanmod: Fix Phase 3 verification issues

- Added withRoleProtection to 4 missing files
- Re-ran grep verification (now shows 16)
- Updated verification MD with correct outputs

Fixes Mod feedback: 4 missing protections"

git push origin asanmod/phase3-frontend-pages
```

**Mod re-reviews** (goes back to Step 3)

---

## 🔄 Parallel Phase Workflow

**Scenario:** Mod prepares Phase 4 while Worker executes Phase 3

### Mod Creates Phase 4 Branch

```bash
# Mod creates Phase 4 branch from main (NOT from Phase 3 branch)
git checkout main
git pull origin main
git checkout -b asanmod/phase4-sidebar-navigation

# Mod creates Phase 4 JSON file
# Commits and pushes

git add docs/features/role-access-phase4-sidebar-navigation.json
git commit -m "asanmod: Phase 4 JSON - Sidebar Navigation

- Created ultra-detailed task definitions
- mcpRequirements, toolUsageGuide included
- Verification template with Mod cross-check sections
- Ready for Worker execution after Phase 3 verified

🤖 AsanMod Mod - Phase 4 Prepared"

git push -u origin asanmod/phase4-sidebar-navigation
```

### Mod Merges Phase 4 Prep to Main

**Once Phase 4 JSON is ready:**

```bash
git checkout main
git merge --no-ff asanmod/phase4-sidebar-navigation -m "asanmod: Add Phase 4 JSON preparation

- Phase 4 task definitions ready
- Can start after Phase 3 verified"

git push origin main
git branch -d asanmod/phase4-sidebar-navigation
git push origin --delete asanmod/phase4-sidebar-navigation
```

**Now:**
- Worker still working on Phase 3 (asanmod/phase3-frontend-pages)
- Phase 4 JSON ready in `main` branch
- After Phase 3 verified → Worker creates `asanmod/phase4-sidebar-navigation` (new branch from main)

---

## 📦 Yerel (Local) vs Uzak (Remote) Repo

### Worker Local + Remote Workflow

**Worker's local repo:**
```bash
/home/asan/Desktop/ikai/
├── .git/
├── frontend/
├── backend/
└── docs/
```

**Worker's branch lifecycle:**

1. **Create local branch:**
   ```bash
   git checkout -b asanmod/phase3-frontend-pages
   ```

2. **Push to remote immediately:**
   ```bash
   git push -u origin asanmod/phase3-frontend-pages
   ```
   **Remote:** `github.com/masan3134/ikaiapp` now has `asanmod/phase3-frontend-pages`

3. **Make commits locally:**
   ```bash
   git add file.tsx
   git commit -m "Task 3.1 done"
   ```
   **Local:** Commit exists on Worker's machine
   **Remote:** Commit NOT yet on GitHub

4. **Push to remote frequently:**
   ```bash
   git push origin asanmod/phase3-frontend-pages
   ```
   **Remote:** Now has Worker's commits (backup!)

5. **After phase complete:**
   ```bash
   git push origin asanmod/phase3-frontend-pages
   ```
   **Worker:** "Done, check branch asanmod/phase3-frontend-pages on GitHub"

### Mod Local + Remote Workflow

**Mod's local repo:**
```bash
/home/asan/Desktop/ikai/  # Same path (or different machine)
├── .git/
├── frontend/
├── backend/
└── docs/
```

**Mod verification workflow:**

1. **Fetch Worker's branch from remote:**
   ```bash
   git fetch origin
   git checkout asanmod/phase3-frontend-pages
   git pull origin asanmod/phase3-frontend-pages
   ```
   **Mod's local:** Now has Worker's exact code

2. **Run verification commands locally:**
   ```bash
   grep -r 'withRoleProtection' frontend/app/(authenticated)
   # Mod sees: 16 files
   # Compares with Worker's MD report: 16 files
   # Match! ✅
   ```

3. **Add Mod verification to branch:**
   ```bash
   git add docs/reports/phase3-frontend-protection-verification.md
   git commit -m "Mod cross-check: Phase 3 verified"
   git push origin asanmod/phase3-frontend-pages
   ```
   **Remote:** Branch now has Mod's verification commit

4. **Merge to main locally:**
   ```bash
   git checkout main
   git pull origin main
   git merge --no-ff asanmod/phase3-frontend-pages
   ```
   **Mod's local:** main has Phase 3 changes

5. **Push main to remote:**
   ```bash
   git push origin main
   ```
   **Remote:** Production (`main` branch) updated

6. **Delete branch (local + remote):**
   ```bash
   git branch -d asanmod/phase3-frontend-pages
   git push origin --delete asanmod/phase3-frontend-pages
   ```
   **Remote:** Branch deleted (cleanup)

### Sync Rules

**Worker MUST:**
- ✅ Push to remote after every commit (backup)
- ✅ Pull from `origin main` before creating new branch
- ✅ Never force-push (`git push -f`) to Worker branch
- ✅ Keep local and remote in sync

**Mod MUST:**
- ✅ Fetch latest before checkout Worker branch
- ✅ Pull Worker's branch before verification
- ✅ Push main to remote after merge
- ✅ Delete remote branch after merge (cleanup)

**Both:**
- ✅ Always pull `main` before creating new branches
- ✅ Never work directly on `main` branch
- ✅ Use `git status` to check local vs remote sync

---

## 🚫 FORBIDDEN Git Practices

**Worker FORBIDDEN:**
- ❌ `git push origin main` (only Mod merges to main)
- ❌ `git push -f` (force push breaks history)
- ❌ `git merge main` into Worker branch before Mod review
- ❌ `git commit --amend` after pushing (rewrites history)
- ❌ Deleting Worker branch before Mod merge
- ❌ Creating branches from other Worker branches
- ❌ Committing without descriptive messages

**Mod FORBIDDEN:**
- ❌ Merging unverified Worker branches
- ❌ Force-pushing to `main`
- ❌ Skipping cross-check verification
- ❌ Merging without reading Worker's commits
- ❌ Deleting Worker branch before verification
- ❌ Trusting Worker's MD report without re-running commands

**Both FORBIDDEN:**
- ❌ Committing secrets (.env files with real credentials)
- ❌ Committing `node_modules/` or `.next/`
- ❌ Large binary files (>10MB) without Git LFS
- ❌ Merge conflicts resolved without testing
- ❌ Committing broken code to any branch

---

## ✅ REQUIRED Git Practices

**Worker REQUIRED:**
- ✅ Create branch for each phase: `asanmod/phase-N-description`
- ✅ Push branch to remote immediately after creation
- ✅ Commit after each task completion (not every file edit)
- ✅ Write descriptive commit messages (what + why)
- ✅ Push to remote after every commit (backup)
- ✅ Include `🤖 AsanMod Worker` in commit messages
- ✅ Create verification report commit after phase complete
- ✅ Wait for Mod approval before starting next phase

**Mod REQUIRED:**
- ✅ Checkout Worker's branch before verification
- ✅ Read Worker's verification MD report
- ✅ Re-run ALL verification commands Worker ran
- ✅ Compare outputs: Worker's MD vs Mod's terminal
- ✅ Add Mod cross-check section to verification MD
- ✅ Commit Mod's verification to Worker's branch
- ✅ Merge to `main` only if ALL outputs match
- ✅ Delete Worker branch after successful merge
- ✅ Include `✅ AsanMod Mod` in commit messages

**Both REQUIRED:**
- ✅ Pull `main` before creating new branches
- ✅ Use `git status` before committing
- ✅ Use `.gitignore` for generated files
- ✅ Sign commits (optional but recommended)
- ✅ Keep commit history clean and meaningful

---

## 🔍 Git Verification Checklist

### Worker Pre-Commit Checklist

Before `git commit`:
- [ ] All task changes tested locally
- [ ] No console errors in browser
- [ ] Backend logs clean (docker logs)
- [ ] Files actually modified (git status)
- [ ] Commit message descriptive
- [ ] No secrets in files (.env, tokens)

Before `git push`:
- [ ] Committed to correct branch (not main!)
- [ ] Remote branch exists (`git branch -r`)
- [ ] Network connection stable
- [ ] Push will succeed (no conflicts)

### Mod Pre-Merge Checklist

Before merging to `main`:
- [ ] Worker's branch checked out locally
- [ ] Verification MD report read
- [ ] ALL verification commands re-run
- [ ] ALL outputs match (Worker's MD == Mod's terminal)
- [ ] No fake data detected
- [ ] Build successful (no errors)
- [ ] Console logs clean
- [ ] Services healthy (docker ps)
- [ ] Mod's cross-check added to MD
- [ ] Main branch pulled (up to date)

After merge:
- [ ] Main branch pushed to remote
- [ ] Worker branch deleted locally
- [ ] Worker branch deleted remotely
- [ ] Worker notified (merge complete)

---

## 📊 Git Command Reference

### Worker Common Commands

```bash
# Start new phase
git checkout main && git pull origin main
git checkout -b asanmod/phase3-frontend-pages
git push -u origin asanmod/phase3-frontend-pages

# Work on task
# ... edit files ...
git add [files]
git commit -m "asanmod: Task 3.1 - [description]"
git push origin asanmod/phase3-frontend-pages

# Create verification report
# ... create MD file ...
git add docs/reports/phase3-verification.md
git commit -m "asanmod: Phase 3 Verification Report"
git push origin asanmod/phase3-frontend-pages

# Check branch status
git status
git log --oneline
git branch -a
```

### Mod Common Commands

```bash
# Verify Worker's phase
git fetch origin
git checkout asanmod/phase3-frontend-pages
git pull origin asanmod/phase3-frontend-pages

# Read verification report
cat docs/reports/phase3-verification.md

# Re-run verification commands
grep -r 'withRoleProtection' frontend/app/(authenticated) | wc -l
# Compare with Worker's MD...

# Add Mod cross-check
nano docs/reports/phase3-verification.md
# Add Mod's verification section
git add docs/reports/phase3-verification.md
git commit -m "asanmod: Mod cross-check verification for Phase 3"
git push origin asanmod/phase3-frontend-pages

# Merge to main (if verified)
git checkout main && git pull origin main
git merge --no-ff asanmod/phase3-frontend-pages -m "asanmod: Merge Phase 3"
git push origin main

# Cleanup
git branch -d asanmod/phase3-frontend-pages
git push origin --delete asanmod/phase3-frontend-pages

# Check merge result
git log --oneline --graph
```

### Troubleshooting Commands

```bash
# See what changed
git diff
git diff --staged

# Undo last commit (before push)
git reset --soft HEAD~1

# Fix commit message (before push)
git commit --amend -m "New message"

# Check remote branches
git branch -r

# See commit history
git log --oneline --graph --all

# Sync with remote
git fetch origin
git status  # Shows if local behind/ahead

# Resolve merge conflict
git status  # Shows conflict files
# Edit files to resolve
git add [resolved files]
git commit -m "Resolve merge conflict"
```

---

## 🎯 Example: Full Phase 3 Git Workflow

### Worker Execution

```bash
# Day 1: Start Phase 3
git checkout main
git pull origin main
git checkout -b asanmod/phase3-frontend-pages
git push -u origin asanmod/phase3-frontend-pages

# Task 3.1: job-postings page
# Edit frontend/app/(authenticated)/job-postings/page.tsx
git add frontend/app/(authenticated)/job-postings/page.tsx
git commit -m "asanmod: Task 3.1 - Protect job-postings page

- Wrapped with withRoleProtection HOC
- Required roles: RoleGroups.HR_MANAGERS
- Tested with grep: import verified

🤖 AsanMod Worker - Phase 3 Task 3.1"
git push origin asanmod/phase3-frontend-pages

# Task 3.2: candidates page
# Edit frontend/app/(authenticated)/candidates/page.tsx
git add frontend/app/(authenticated)/candidates/page.tsx
git commit -m "asanmod: Task 3.2 - Protect candidates page

- Wrapped with withRoleProtection HOC
- Required roles: RoleGroups.HR_MANAGERS
- Tested with grep: import verified

🤖 AsanMod Worker - Phase 3 Task 3.2"
git push origin asanmod/phase3-frontend-pages

# ... Tasks 3.3 through 3.16 ...

# Day 2: Create verification report
# Run verification commands, create MD file
git add docs/reports/phase3-frontend-protection-verification.md
git commit -m "asanmod: Phase 3 Verification Report

- Created verification MD with RAW outputs
- 16 pages protected (grep: withRoleProtection count = 16)
- Build test output included
- Console logs included (docker logs)
- Ready for Mod cross-check

🤖 AsanMod Worker - Phase 3 Complete"
git push origin asanmod/phase3-frontend-pages

# Notify Mod
echo "Phase 3 complete. Branch: asanmod/phase3-frontend-pages"
```

### Mod Verification

```bash
# Day 2: Mod receives notification
git fetch origin
git checkout asanmod/phase3-frontend-pages
git pull origin asanmod/phase3-frontend-pages

# Read Worker's verification report
cat docs/reports/phase3-frontend-protection-verification.md
# Worker claimed: 16 pages protected

# Re-run verification commands
grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l
# Mod's output: 16 ✅ MATCH

grep -r "import.*withRoleProtection" frontend/app/(authenticated) --include='page.tsx' | wc -l
# Mod's output: 16 ✅ MATCH

cd frontend && npm run build 2>&1 | head -50
# Mod sees build output
# Compare with Worker's MD report
# ✅ MATCH

docker logs ikai-frontend --tail 50 | grep -i "error\|warning"
# Mod's output: (clean logs)
# Worker's MD report: (clean logs)
# ✅ MATCH

# All outputs match! Add Mod cross-check
nano docs/reports/phase3-frontend-protection-verification.md
# Add:
## MOD CROSS-CHECK VERIFICATION
**Mod Re-Ran Commands:** 2025-11-04
1. Protected Pages: 16 (Worker: 16) ✅ MATCH
2. Imports: 16 (Worker: 16) ✅ MATCH
3. Build: Success (Worker: Success) ✅ MATCH
4. Logs: Clean (Worker: Clean) ✅ MATCH
## MOD VERDICT
✅ WORKER OUTPUT VERIFIED - NO FAKE DATA DETECTED

git add docs/reports/phase3-frontend-protection-verification.md
git commit -m "asanmod: Mod cross-check verification for Phase 3

- Re-ran all verification commands
- All outputs match Worker's report
- 16 pages protected (verified with grep)
- Build successful (verified with npm build)
- Logs clean (verified with docker logs)
- Worker used REAL tools confirmed

✅ AsanMod Mod - Phase 3 Verified"
git push origin asanmod/phase3-frontend-pages

# Merge to main
git checkout main
git pull origin main
git merge --no-ff asanmod/phase3-frontend-pages -m "asanmod: Merge Phase 3 - Frontend Pages Protection

Phase: Phase 3 - Frontend Pages Protection
Branch: asanmod/phase3-frontend-pages
Worker: Claude Worker
Mod Verification: PASSED

Changes:
- 16 frontend pages protected with withRoleProtection HOC
- Role configurations: HR_MANAGERS, ADMINS, ANALYTICS_VIEWERS
- Build test: Success
- Console logs: Clean

Verification Report:
- docs/reports/phase3-frontend-protection-verification.md
- Mod cross-check: All outputs verified

✅ AsanMod Mod - Phase 3 Merged"

git push origin main

# Cleanup
git branch -d asanmod/phase3-frontend-pages
git push origin --delete asanmod/phase3-frontend-pages

# Notify Worker
echo "✅ Phase 3 VERIFIED and merged to main. Ready for Phase 4."
```

---

## 🔗 Integration with AsanMod

### Phase JSON Updates

**All phase JSONs must include Git task:**

```json
{
  "id": "X.15",
  "title": "Git Commit & Push to Worker Branch",
  "priority": "CRITICAL",
  "estimatedTime": "5 minutes",
  "description": "Commit all changes to Worker branch and push to remote",
  "dependencies": ["X.14"],
  "instructions": [
    "⚠️ ASANMOD GIT WORKFLOW - WORKER BRANCH ONLY ⚠️",
    "1. Verify you are on Worker branch: git branch --show-current",
    "2. Expected output: asanmod/phaseX-description (NOT main!)",
    "3. Add all changed files: git add [files]",
    "4. Create descriptive commit with task summary",
    "5. Include '🤖 AsanMod Worker - Phase X' in message",
    "6. Push to remote: git push origin asanmod/phaseX-description",
    "7. Verify push successful (no errors)",
    "❌ FORBIDDEN: Committing to main branch",
    "❌ FORBIDDEN: Force pushing (git push -f)",
    "❌ FORBIDDEN: Committing secrets or node_modules",
    "✅ REQUIRED: Descriptive commit message (what + why)",
    "✅ REQUIRED: Push to remote for backup",
    "✅ REQUIRED: Verify branch name before committing"
  ],
  "gitCommands": {
    "check_branch": "git branch --show-current",
    "check_status": "git status",
    "commit_example": "git add [files] && git commit -m 'asanmod: Task X.Y - Description\n\n- Change 1\n- Change 2\n\n🤖 AsanMod Worker - Phase X Task X.Y'",
    "push_to_remote": "git push origin asanmod/phaseX-description",
    "verify_push": "git log origin/asanmod/phaseX-description --oneline | head -1"
  }
}
```

### Verification Report Template Updates

**Add Git section to verification templates:**

```markdown
## 10. Git Branch Verification

### Worker Branch Check

```bash
$ git branch --show-current
```

**Worker Output:**
```
asanmod/phase3-frontend-pages
```

**Expected:** asanmod/phaseX-description (NOT main!)

---

### Commits Count

```bash
$ git log --oneline | head -20
```

**Worker Output:**
```
[PASTE_COMMIT_HISTORY_HERE]
```

**Expected:** 1 commit per task + 1 verification commit

---

### Remote Push Verification

```bash
$ git log origin/asanmod/phase3-frontend-pages --oneline | head -5
```

**Worker Output:**
```
[PASTE_REMOTE_COMMITS_HERE]
```

**Expected:** Local and remote commits match

---

## Summary

**Branch:** asanmod/phaseX-description ✅
**Commits:** [COUNT] (1 per task + 1 verification)
**Pushed to remote:** YES/NO
**Ready for Mod review:** YES/NO
```

---

## 🗣️ İLETİŞİM KURALLARI (Türkçe Zorunlu)

### Mod ve Worker - Kullanıcı İletişimi

**KURAL:** Mod ve Worker, kullanıcıyla (Mustafa Asan) **SADECE TÜRKÇE** konuşacak.

**Teknik terimler:**
- ✅ İngilizce kalabilir (withRoleProtection, commit, grep, docker)
- ✅ Ama açıklama Türkçe olacak

**Yapılan işin gerçek dünya açıklaması:**
- ✅ "Ne yaptım?" sorusuna cevap ver
- ✅ "Gerçek dünyada ne çözüldü?" açıkla
- ❌ Sadece teknik terimleri sıralama

### İyi İletişim Örnekleri

**❌ Kötü (Sadece teknik):**
```
Phase 3 complete.
- 16 pages wrapped with withRoleProtection HOC
- RoleGroups.HR_MANAGERS configured
- Build successful
```

**✅ İyi (Türkçe + Gerçek dünya):**
```
Phase 3 tamamlandı.

Ne yapıldı:
- 16 sayfaya rol tabanlı erişim koruması eklendi
- Artık HR yetkisi olmayan kullanıcılar iş ilanları, adaylar gibi
  hassas sayfaları göremiyor
- Sistem admin olmayanları ayarlar sayfasından engelliyor

Gerçek dünyada ne değişti:
- USER rolündeki kişi → sadece Dashboard görebiliyor
- HR_SPECIALIST → iş ilanları + aday yönetimi sayfalarını görebiliyor
- ADMIN → tüm sayfalar + ekip yönetimi + ayarlar erişimi var
- SUPER_ADMIN → sistem yönetim paneli de dahil her şeye erişebiliyor

Teknik detay (kanıt):
- withRoleProtection HOC: 16 dosya
- RoleGroups kullanımı: RoleGroups.HR_MANAGERS, RoleGroups.ADMINS
- grep çıktısı: 16 sayfa korumalı
```

**❌ Kötü (İngilizce):**
```
I've added role checks to AppLayout component using useHasRole hook.
Menu items now conditionally render based on user permissions.
```

**✅ İyi (Türkçe + Gerçek dünya):**
```
AppLayout bileşenine rol kontrolleri eklendi.

Ne yapıldı:
- Yan menüdeki linkler artık kullanıcının rolüne göre görünüyor/gizleniyor
- useHasRole hook'u ile rol kontrolü yapılıyor

Gerçek dünyada ne değişti:
- USER → sadece Dashboard menüsünü görüyor
- HR_SPECIALIST → Dashboard + İş İlanları + Adaylar + Teklifler menüsü
- ADMIN → Ek olarak "Team" ve "Settings" menüleri görünüyor
- SUPER_ADMIN → "Super Admin" panel menüsü de ekleniyor

Önceden: Herkes tüm menüleri görüyordu (ama tıklayınca 403 hatası)
Şimdi: Menüde zaten görmüyorlar, karışıklık yok

Teknik detay:
- canManageHR, isAdmin, isSuperAdmin hook'ları kullanıldı
- Conditional rendering: {isAdmin && <AdminMenu />}
```

### Commit Mesajları

**Worker commit mesajları Türkçe olacak:**

**❌ Kötü (İngilizce):**
```bash
git commit -m "asanmod: Task 3.1 - Protect job-postings page

- Wrapped with withRoleProtection HOC
- Required roles: RoleGroups.HR_MANAGERS"
```

**✅ İyi (Türkçe + Açıklama):**
```bash
git commit -m "asanmod: Görev 3.1 - İş ilanları sayfası koruması

Ne yapıldı:
- İş ilanları sayfasına (job-postings) rol koruması eklendi
- Sadece HR yetkisi olanlar artık bu sayfayı görebiliyor

Gerçek dünyada ne değişti:
- USER rolü → iş ilanları sayfasına giremez (403 hatası)
- HR_SPECIALIST, MANAGER, ADMIN, SUPER_ADMIN → erişebilir

Teknik detay:
- withRoleProtection(RoleGroups.HR_MANAGERS) kullanıldı
- İlgili dosya: frontend/app/(authenticated)/job-postings/page.tsx

🤖 AsanMod Worker - Phase 3 Görev 3.1"
```

### Verification Report Dili

**Verification MD raporları:**
- Başlıklar: Türkçe
- Terminal çıktıları: İngilizce (olduğu gibi paste edilecek)
- Açıklamalar: Türkçe

**Örnek:**

```markdown
# Phase 3 - Frontend Sayfa Koruması Doğrulama Raporu

**Tarih:** 2025-11-04
**Çalıştıran:** Worker Claude

## Ne Yapıldı (Özet)

16 frontend sayfasına rol tabanlı erişim koruması eklendi.

Gerçek dünyada ne değişti:
- Artık kullanıcılar sadece yetkisi olduğu sayfaları görebiliyor
- Yetkisiz sayfaya gitmeye çalışan kullanıcı 403 hatası alıyor
- URL'yi bilse bile yetkisiz sayfaya erişemiyor

---

## 1. Korumalı Sayfa Sayısı

```bash
$ grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l
```

**Worker Çıktısı:**
```
16
```

**Beklenen:** 16 sayfa korumalı olmalı

**Açıklama:** 16 sayfa başarıyla withRoleProtection ile sarıldı.
Bu sayfalar artık rol kontrolü yapıyor.

---

## Mod Çapraz Kontrol

**Mod Komutları Yeniden Çalıştırdı:** 2025-11-04

### 1. Korumalı Sayfa Sayısı
**Mod Çıktısı:** 16
**Worker Çıktısı:** 16
**Eşleşti mi?** ✅ EVET

**Açıklama:** Worker gerçek grep komutu kullanmış, sahte veri yok.

---

## Mod Kararı

✅ **WORKER ÇIKTISI DOĞRULANDI - SAH researchTE VERİ YOK**

Tüm Worker çıktıları Mod'un yeniden çalıştırdığı komutlarla eşleşiyor.
Worker GERÇEK araçları kullanmış onaylandı.

Gerçek dünyada durum:
- 16 sayfa başarıyla korunuyor
- Rol kontrolleri çalışıyor
- Sistem production'a hazır
```

### Mod - Worker Arası İletişim

**Worker → Mod:**
```
Phase 3 tamamlandı.

Branch: asanmod/phase3-frontend-pages
Doğrulama raporu: docs/reports/phase3-frontend-protection-verification.md
Commit sayısı: 17 (her görev için 1 + doğrulama raporu için 1)

Ne yaptım:
- 16 frontend sayfasına rol koruması ekledim
- Her sayfa için withRoleProtection HOC kullandım
- Terminal komutlarını çalıştırıp gerçek çıktıları MD dosyasına yapıştırdım

Gerçek dünyada ne değişti:
- Artık USER rolündeki kişi sadece Dashboard'u görebiliyor
- HR yetkisi olmayan kişi iş ilanlarına, adaylara erişemiyor
- Admin olmayanlar ayarlar sayfasını açamıyor

Doğrulama için hazır.
```

**Mod → Worker:**
```
✅ Phase 3 DOĞRULANDI ve main'e merge edildi.

Ne kontrol ettim:
- Doğrulama MD raporunu okudum
- Senin çalıştırdığın TÜM grep komutlarını tekrar çalıştırdım
- Çıktılar eşleşti: 16 sayfa korumalı (senin raporunda 16, benim terminalimde 16)
- Build test başarılı, console logları temiz

Gerçek dünyada durum:
- Sistem production'a hazır
- Rol korumaları çalışıyor
- Branch asanmod/phase3-frontend-pages main'e merge edildi ve silindi

Phase 4'e hazırız.
```

### Kullanıcı (Mustafa Asan) ile İletişim

**Mod/Worker → Mustafa:**
```
P4 sidebar verification tamamlandı.

Ne yapıldı:
- Yan menü artık kullanıcı rolüne göre değişiyor
- Herkes her menüyü görmüyor, sadece yetkisi olanları görüyor

Gerçek dünyada ne değişti:
- USER → sadece Dashboard menüsü var
- HR_SPECIALIST → Dashboard + İş İlanları + Adaylar + Teklifler menüsü
- ADMIN → Ek olarak "Team" ve "Settings" menüleri görünüyor
- SUPER_ADMIN → "Super Admin" yönetim paneli de ekleniyor

Teknik kontroller:
- useHasRole hook'u: 5 satır (import + 4 kullanım)
- canManageHR conditional: 2 yer
- isAdmin conditional: 1 yer
- isSuperAdmin conditional: 1 yer
- Console logları: Temiz ✅
- Servisler: Hepsi çalışıyor ✅

P4 tamam ✅ P5'e geçelim mi?
```

### İletişim Şablonları

**Worker görev tamamlama:**
```
[Görev Numarası] tamamlandı.

Ne yaptım:
- [Teknik değişiklik 1]
- [Teknik değişiklik 2]

Gerçek dünyada ne değişti:
- [Kullanıcı perspektifinden değişiklik 1]
- [Kullanıcı perspektifinden değişiklik 2]

Teknik detay:
- [Kullanılan araçlar/komutlar]
- [Doğrulama çıktıları]
```

**Mod doğrulama:**
```
✅/❌ [Phase Numarası] DOĞRULANDI/REDDEDİLDİ

Ne kontrol ettim:
- [Kontrol edilen şey 1]
- [Kontrol edilen şey 2]

Sonuç:
- [Eşleşme durumu]
- [Bulgu/problem]

Gerçek dünyada durum:
- [Sistemin şu anki hali]
- [Production hazırlık durumu]

Sonraki adım:
- [Ne yapılacak]
```

---

## 📚 Related Documents

- [`ASANMOD-METHODOLOGY.md`](ASANMOD-METHODOLOGY.md) - Core methodology
- [`ASANMOD-VERIFICATION-PROTOCOL.md`](ASANMOD-VERIFICATION-PROTOCOL.md) - Verification rules
- [`ASANMOD-QUICK-REFERENCE.md`](ASANMOD-QUICK-REFERENCE.md) - Quick commands
- [`CLAUDE.md`](../../CLAUDE.md) - Main development guide

---

## 🎯 Git Workflow Summary

**Worker:**
1. Create branch: `asanmod/phase-N-description`
2. Push to remote immediately
3. Commit after each task
4. Push to remote after each commit
5. Create verification report + commit
6. Notify Mod, wait for approval

**Mod:**
1. Fetch + checkout Worker's branch
2. Read verification MD report
3. Re-run ALL verification commands
4. Compare outputs (Worker's MD vs Mod's terminal)
5. Add Mod cross-check to MD + commit + push
6. Merge to `main` if verified
7. Delete Worker branch (cleanup)
8. Notify Worker (merge complete)

**Key Rules:**
- ✅ Worker works in branches, Mod merges to `main`
- ✅ Always push to remote (backup + transparency)
- ✅ Mod verifies before merge (no blind trust)
- ✅ Clear branch naming: `asanmod/phase-N-description`
- ❌ Never commit directly to `main`
- ❌ Never force-push or rewrite history
- ❌ Never skip Mod verification

---

**Version:** 1.0
**Created:** 2025-11-04
**Author:** Mustafa Asan + Claude Sonnet 4.5

**🎯 AsanMod Git Workflow = Worker Branch → Mod Verify → Merge to Main**

_"Worker codes, Mod verifies, Git preserves the truth."_
