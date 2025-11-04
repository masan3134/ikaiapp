# 🔧 Template: Bug Fix

**Use case:** Fixing a bug
**Duration:** Varies
**Difficulty:** Varies

---

## Step 1: Reproduce Bug

**Understand the problem:**
```
- What's broken?
- Expected vs Actual behavior?
- Which file(s) affected?
```

---

## Step 2: Locate Issue

**Check logs:**
```bash
# Frontend errors
docker logs ikai-frontend --tail 100 | grep -i "error"

# Backend errors
docker logs ikai-backend --tail 100 | grep -i "error"
```

**Read code:**
```bash
# Find relevant file
grep -r "problematic function" frontend/ backend/
```

---

## Step 3: Fix

**Edit file:**
```bash
Read('path/to/file')
# Understand code
# Make minimal change
Edit('path/to/file', old_string, new_string)
```

---

## Step 4: Test Fix

**Verify bug is gone:**
```bash
# Re-check logs
docker logs ikai-frontend --tail 20 | grep -i "error"

# Test in browser/API
# Bug should not appear anymore
```

---

## Step 5: Commit

```bash
git add path/to/file
git commit -m "fix(scope): Fix {bug-description}

Before: {what-was-broken}
After: {what-works-now}
Root cause: {why-it-broke}"
```

---

## Step 6: Report

**Format:**
```
✅ Bug fixed
Issue: {bug-description}
File: {path/to/file}
Commit: {hash}
Test: Bug no longer appears ✅
```

---

## Scope Rules

**YOU fix:**
- ✅ Bugs in files YOU created
- ✅ Bugs in YOUR task scope

**YOU DON'T fix:**
- ❌ Bugs in other worker's files
- ❌ Infrastructure bugs (Docker, DB)

**If out of scope → Report to Mod!**
