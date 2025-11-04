# 🔄 Frontend Change Verification Protocol

**Purpose:** Prevent stale build loops (cache hell!)
**For:** MOD & Workers editing frontend code
**Version:** 1.0 (2025-11-04)

---

## 🚨 THE PROBLEM: Stale Build Loop

**Symptoms:**
1. ✅ Code changed (e.g., AppLayout.tsx)
2. ✅ Git committed
3. ✅ Docker hot reload triggered
4. ✅ Frontend compiled successfully
5. ❌ **Browser shows OLD code!**
6. 🔄 **Infinite loop:** "Why isn't it updating?!"

**Root Causes:**
- Next.js aggressive .next caching
- Browser HTTP/Service Worker cache
- Docker volume persistence
- Hot reload cache invalidation failed

---

## ✅ VERIFICATION PROTOCOL (MANDATORY!)

**After ANY frontend code change, follow these steps:**

### Step 1: Commit Your Change
```bash
git add frontend/components/AppLayout.tsx
git commit -m "feat: Add sidebar items"
```

### Step 2: Verify Compilation
```bash
# Check logs for fresh compile
docker logs ikai-frontend --tail 10

# Should see:
# ✓ Compiled /your-page in Xs
```

### Step 3: Test in Incognito Mode (MANDATORY!)
```
❌ WRONG: Test in normal browser tab
✅ RIGHT: Test in Incognito/Private mode

Why?
- Incognito bypasses ALL browser cache
- Clean slate every time
- Immediate feedback

How:
1. Ctrl + Shift + N (Chrome Incognito)
2. http://localhost:8103/login
3. Login with test account
4. Verify changes visible
5. If YES → ✅ DONE!
6. If NO → Continue to Step 4
```

### Step 4: If Incognito Shows Old Code (Nuclear Option)
```bash
# Clear .next cache in container
docker exec ikai-frontend rm -rf /app/.next

# Restart container
docker restart ikai-frontend

# Wait 15 seconds
sleep 15

# Test in NEW Incognito window
Ctrl + Shift + N (fresh window!)
```

### Step 5: Verify & Document
```markdown
## Verification

**Change:** Added "Yardım" to sidebar
**Commit:** abc123

**Test:**
- Incognito mode: ✅ Visible
- Role tested: SUPER_ADMIN
- Expected items: 12
- Actual items: 12
- Match: ✅

**Status:** VERIFIED
```

---

## 🎯 QUICK CHECKLIST

**After frontend change:**

- [ ] Code edited
- [ ] Git committed
- [ ] Docker logs checked (compiled?)
- [ ] **Incognito test** (bypass cache!)
- [ ] Changes visible?
  - If YES → ✅ DONE
  - If NO → Clear .next, restart, test again

---

## 🚫 COMMON MISTAKES

### Mistake 1: Testing in Normal Browser
```
❌ WRONG:
1. Edit code
2. Commit
3. Refresh normal tab (F5)
4. "Why isn't it updating?!" 😭

✅ RIGHT:
1. Edit code
2. Commit
3. Open Incognito (Ctrl+Shift+N)
4. Login fresh
5. See changes immediately! 😊
```

### Mistake 2: Trusting Hot Reload
```
❌ WRONG:
"Hot reload compiled, must be working!"

✅ RIGHT:
"Hot reload compiled, let me verify in Incognito"
```

### Mistake 3: Skipping Incognito Test
```
❌ WRONG:
"I'll test later / I trust the compile log"

✅ RIGHT:
"Test NOW in Incognito before claiming success"
```

---

## 🛠️ PERMANENT FIXES APPLIED

### Fix 1: next.config.js (Dev Cache Reduced)
```javascript
// Added to next.config.js:
...(process.env.NODE_ENV === 'development' && {
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 1,
  },
}),
```

**Impact:** Less aggressive caching in dev mode

### Fix 2: Incognito Mandatory Testing
**Rule added to WORKER-PLAYBOOK.md Rule 12:**
- Frontend changes → Incognito test MANDATORY!

### Fix 3: MOD Verification Enhanced
**Rule added to MOD-PLAYBOOK.md Rule 12:**
- Mod can clear cache when needed
- Coordination protocol (announce before restart)

---

## 📋 WORKER PROTOCOL

**When you edit frontend code:**

```bash
# 1. Edit
Edit('frontend/components/AppLayout.tsx', ...)

# 2. Commit
git add frontend/components/AppLayout.tsx
git commit -m "feat: Add sidebar item"

# 3. Wait for compile (10-15 seconds)
sleep 15

# 4. Test in Incognito
# Open: Ctrl + Shift + N
# Visit: http://localhost:8103/login
# Login: Your test account
# Verify: Changes visible?

# 5. Report
If visible:
  "✅ AppLayout updated, verified in Incognito!"

If NOT visible:
  "⚠️ Mod, cache issue - need .next clear?"
```

---

## 📋 MOD PROTOCOL

**When worker reports stale build:**

```bash
# 1. Verify cache issue
docker exec ikai-frontend ls -lh /app/.next/cache

# 2. Announce to workers
"Cache clear in 30 seconds - save work!"

# 3. Clear cache
docker exec ikai-frontend rm -rf /app/.next

# 4. Restart (optional)
docker restart ikai-frontend

# 5. Verify
# Wait 15s, test in Incognito

# 6. Announce
"✅ Cache cleared, fresh build ready!"
```

---

## 🎓 PREVENTION RULES

### For Workers:

**Rule:** ALWAYS test frontend changes in Incognito!

**Before reporting "Frontend updated ✅":**
1. Open Incognito
2. Login as test user
3. Verify change visible
4. ONLY THEN report success

**If change NOT visible:**
1. DON'T loop forever!
2. Try ONE cache clear
3. If still not visible → Report to Mod

### For MOD:

**Rule:** Coordinate cache clears!

**Before clearing cache:**
1. Check: Other workers active?
2. Announce: "Cache clear in X seconds"
3. Wait: Workers save
4. Clear: docker exec rm -rf /app/.next
5. Verify: Workers can resume

---

## 🔬 DEBUGGING CHECKLIST

**If stale build detected:**

```bash
# 1. File in container matches host?
diff frontend/components/AppLayout.tsx \
  <(docker exec ikai-frontend cat /app/components/AppLayout.tsx)
# Expected: No diff

# 2. Compilation happened?
docker logs ikai-frontend --tail 20 | grep "Compiled.*AppLayout"
# Expected: Recent compile timestamp

# 3. .next cache age?
docker exec ikai-frontend find /app/.next -name "*.js" -mmin -5 | wc -l
# Expected: Many recent files

# 4. Browser cache?
# Test in Incognito (bypass all cache!)

# If all pass but still old → Nuclear option:
docker exec ikai-frontend rm -rf /app/.next
docker restart ikai-frontend
# Test in NEW Incognito window
```

---

## 🎯 SUCCESS CRITERIA

**Change is VERIFIED when:**
- ✅ Code committed to git
- ✅ Docker compiled successfully
- ✅ **Incognito test shows changes**
- ✅ Expected behavior confirmed

**Until Incognito test passes → NOT verified!**

---

## 📊 PREVENTION METRICS

**Before protocol:**
- Cache issues: 5+ per session
- Time wasted: 30+ minutes
- Worker confusion: High

**After protocol:**
- Cache issues: 0 (Incognito catches!)
- Time wasted: 0 (verify immediately!)
- Worker confidence: High

---

**🎯 GOLDEN RULE: Incognito test = Truth!**

If Incognito shows it → It's real!
If normal browser shows it → Maybe cache!
