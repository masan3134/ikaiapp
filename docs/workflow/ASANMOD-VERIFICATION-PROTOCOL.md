# AsanMod Verification Protocol v2.0

**Problem:** Worker Claude can fake verification reports by typing outputs manually instead of using real tools.

**Solution:** Mod MUST re-run ALL verification commands and compare outputs.

---

## 🚨 The Trust Problem

### Scenario: Worker Can Lie

**Worker claims:**
```markdown
## 1. Protected Pages Count

```bash
$ grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l
```

**Output:**
```
19
```
```

**Problem:** Worker typed "19" manually, never ran grep command!

**Why this is dangerous:**
- Mod reads "19" → thinks task is complete
- Actually 0 pages protected!
- Bug ships to production

---

## ✅ Solution: MOD CROSS-CHECK PROTOCOL

### Step 1: Worker Creates Report (As Before)

Worker runs commands using Bash tool and pastes outputs to MD file.

**Report format:**
```markdown
## 1. Protected Pages Count

```bash
$ grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l
```

**Worker Output:**
```
19
```

**Mod Re-Run (for verification):**
```
[EMPTY - Mod fills this]
```

**Match?** [EMPTY - Mod fills this]
```

### Step 2: Mod Receives "Done" Message

Worker: "Phase 3 verification complete, report saved to docs/reports/phase3-verification.md"

### Step 3: Mod Reads Worker's Report

Mod uses Read tool to see Worker's outputs.

### Step 4: MOD RE-RUNS EVERY COMMAND ⚠️

**CRITICAL:** Mod MUST run the EXACT SAME commands Worker claimed to run.

**Mod's verification checklist:**
```bash
# Command 1: Protected pages count
grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l
# Mod's output: 19
# Worker's output: 19
# Match? YES ✅

# Command 2: List protected pages
grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx'
# Mod's output: [lists 19 files]
# Worker's output: [lists 19 files]
# Match? YES ✅

# Command 3: Build check
cd frontend && npm run build 2>&1 | head -50
# Mod's output: [build success logs]
# Worker's output: [build success logs]
# Match? YES ✅
```

### Step 5: Mod Compares Outputs

**If ALL outputs match:**
✅ Worker used REAL tools → Task VERIFIED

**If ANY output mismatch:**
❌ Worker LIED (used fake data) → Task FAILED → Re-do required

---

## 📋 Mod Verification Template

**After reading Worker's MD report, Mod runs:**

```bash
# 1. Extract commands from Worker's report
# 2. Run each command
# 3. Compare outputs

# Example verification:
echo "=== MOD VERIFICATION STARTED ==="

# Command from Worker's Section 1:
echo "Command: grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l"
RESULT=$(grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l)
echo "Mod's result: $RESULT"
echo "Worker's result: 19"  # Read from MD
if [ "$RESULT" = "19" ]; then
  echo "✅ MATCH - Section 1 verified"
else
  echo "❌ MISMATCH - Worker LIED in Section 1"
fi

# Repeat for all sections...
```

---

## 🔒 Why This Works

1. **Worker cannot predict Mod's re-run results**
   - If Worker types "19" but only 5 files protected
   - Mod re-runs grep → gets "5"
   - Mismatch detected immediately!

2. **Mod's commands are independent**
   - Mod runs Bash tool directly on codebase
   - Worker has no way to "fake" Mod's execution

3. **Timestamps prevent replay attacks**
   - Worker can't copy old outputs
   - File modification times change
   - Build outputs differ

---

## 📝 Updated JSON Schema

**All phase JSONs now include:**

```json
{
  "tasks": [
    {
      "id": "X.13",
      "title": "Generate Verification Report",
      "VERIFICATION_PROOF_REQUIRED": {
        "method": "Mod cross-check",
        "description": "Mod MUST re-run same commands to verify Worker's outputs are real",
        "workflow": "1. Worker runs commands → pastes outputs to MD | 2. Worker reports 'done' | 3. Mod reads MD | 4. Mod RE-RUNS same commands | 5. Mod compares: Worker's output == Mod's output? | 6. If match → VERIFIED | If mismatch → Worker LIED",
        "enforcement": "Mod never trusts MD alone - ALWAYS re-execute verification commands"
      },
      "reportTemplate": "# Phase X Verification\n\n**⚠️ MOD VERIFICATION REQUIRED:**\nAfter Worker creates this report, Mod MUST re-run ALL commands below and compare outputs.\nIf Worker's output != Mod's output → Worker used fake data!\n\n---\n\n## 1. Check Name\n\n```bash\n$ command here\n```\n\n**Worker Output:**\n```\n[PASTE_EXACT_OUTPUT_HERE]\n```\n\n**Mod Re-Run (for verification):**\n```\n[MOD_FILLS_THIS_AFTER_RE-RUNNING_COMMAND]\n```\n\n**Match?** [MOD: YES/NO]\n\n---"
    }
  ]
}
```

---

## 🎯 Mod's Verification Workflow

```
┌─────────────────────────────────────┐
│ 1. Worker executes Phase X tasks   │
│    - Uses Read/Edit/Write/Bash     │
│    - Creates verification MD        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. Worker: "Phase X done"           │
│    - Reports MD file path           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 3. Mod reads Worker's MD report     │
│    - Sees Worker's claimed outputs  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 4. Mod RE-RUNS all commands ⚠️      │
│    - Uses Bash tool                 │
│    - Gets REAL outputs              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 5. Mod compares outputs             │
│    Worker's "19" == Mod's "19"?     │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐  ┌────────────────┐
│ ✅ MATCH    │  │ ❌ MISMATCH    │
│ Task VERIFIED│  │ Worker LIED    │
│ Next phase  │  │ Re-do required │
└─────────────┘  └────────────────┘
```

---

## 🚫 What This Prevents

**Blocked attack vectors:**

1. ❌ Worker types fake numbers
   - Mod re-runs grep → sees real count → mismatch detected

2. ❌ Worker says "build successful" without building
   - Mod runs npm build → sees errors → mismatch detected

3. ❌ Worker copies old verification outputs
   - File timestamps different → Mod sees different results

4. ❌ Worker skips some tasks
   - Mod's grep finds 10 files, Worker claimed 19 → mismatch

5. ❌ Worker simulates/mocks data
   - Simulation != real codebase state → Mod detects

---

## ✅ Required Changes to Existing Phases

**Update all phase JSONs (P1-P5):**

1. Add `VERIFICATION_PROOF_REQUIRED` object to verification tasks
2. Update `reportTemplate` with Mod re-run sections
3. Add cross-check instructions to `instructions` array

**Files to update:**
- `docs/features/role-access-phase1-infrastructure.json`
- `docs/features/role-access-phase2-backend-routes.json`
- `docs/features/role-access-phase3-frontend-pages.json`
- `docs/features/role-access-phase4-sidebar-navigation.json` ✅ (DONE)
- Future phase JSONs

---

## 📊 Verification Report Example

**Worker's Report:**
```markdown
# Phase 3 Verification

## 1. Protected Pages Count

```bash
$ grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l
```

**Worker Output:**
```
19
```

**Mod Re-Run:**
```
19
```

**Match?** ✅ YES

---

## 2. Build Check

```bash
$ cd frontend && npm run build 2>&1 | head -10
```

**Worker Output:**
```
> ikai-frontend@1.0.0 build
> next build

✓ Creating optimized production build
✓ Compiled successfully
```

**Mod Re-Run:**
```
> ikai-frontend@1.0.0 build
> next build

✓ Creating optimized production build
✓ Compiled successfully
```

**Match?** ✅ YES
```

**Mod's verdict:** All sections match ✅ → Task VERIFIED

---

## 🔥 Emergency Protocol

**If Worker is caught lying:**

1. **Report to user:** "Worker provided fake verification data in Section X"
2. **Show evidence:** "Worker claimed 19, actual is 5"
3. **Request re-do:** "Phase X must be re-executed by trustworthy worker"
4. **Document incident:** Add note to session report

**User's options:**
- Re-run phase in same tab (if minor issue)
- Open new worker tab (if trust broken)
- Manual verification (user runs commands themselves)

---

## 🚫 PHASE PROGRESSION RULE (CRITICAL!)

**❌ NEVER START NEXT PHASE BEFORE CURRENT PHASE VERIFIED!**

**Wrong workflow:**
```
P3 Worker: "bitti" → User: "P4 başlasın" → ❌ HATALI!
```

**Correct workflow:**
```
P3 Worker: "bitti"
         ↓
Mod: MD okudu + komutları çalıştırdı + karşılaştırdı
         ↓
Mod: "✅ P3 VERIFIED (Worker's output == Mod's output)"
         ↓
User: "P4 başlasın" ✅ DOĞRU!
```

**Why this rule exists:**
- P4 might depend on P3 (örn: sidebar needs protected pages)
- Unverified P3 = potential fake data = P4 starts with wrong assumptions
- Verification takes 2-3 minutes, rushing causes hours of rework

**Enforcement:**
- User MUST wait for Mod verification before starting next phase
- Mod MUST complete cross-check before allowing P4
- No exceptions - even if "confident" P3 is done

---

## 🔍 CONSOLE LOG VERIFICATION (CRITICAL!)

**Problem:** Worker/Mod can say "task complete" but leave console full of errors!

**Solution:** ALWAYS check logs before reporting done.

### Frontend Console Check

**Commands Worker MUST run:**
```bash
# Check if dev server running clean
docker logs ikai-frontend --tail 50 | grep -i "error\|warning\|failed"

# If browser accessible, Worker must report console state:
# ✅ "Console: 0 errors, 0 warnings"
# ❌ "Console: 3 errors (GET /api/v1/team 500)"
```

**Mod verification:**
- Ask user to check browser console
- OR: Use Playwright to capture console logs
- Document ALL errors in verification report

### Backend Log Check

**Commands Worker MUST run:**
```bash
# Check backend for errors
docker logs ikai-backend --tail 100 | grep -i "error\|exception\|failed"

# Check backend health
curl -s http://localhost:8102/health | jq

# Check specific endpoint if testing route
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8102/api/v1/team
```

**Mod verification:**
```bash
# Re-run same commands
docker logs ikai-backend --tail 100 | grep -i "error"
# Compare with Worker's output
```

### Service Health Check

**All phases must verify:**
```bash
# Check all services running
docker ps --filter "name=ikai" --format "{{.Names}}: {{.Status}}"

# Check for crashes
docker ps -a --filter "name=ikai" --filter "status=exited"

# Check resource usage
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### Log Verification Template (Add to Phase JSONs)

```json
{
  "id": "X.14",
  "title": "Console & Log Verification",
  "instructions": [
    "1. Check frontend console - docker logs ikai-frontend --tail 50",
    "2. Check backend logs - docker logs ikai-backend --tail 100 | grep -i error",
    "3. Check service health - docker ps --filter 'name=ikai'",
    "4. Test actual functionality in browser",
    "5. Paste ALL outputs to verification MD",
    "6. If ANY errors found - FIX FIRST before reporting done",
    "❌ FORBIDDEN: Reporting 'done' with console errors",
    "✅ REQUIRED: Clean logs, working functionality"
  ],
  "verificationCommands": {
    "frontend_logs": "docker logs ikai-frontend --tail 50 | grep -i 'error\\|warning'",
    "backend_logs": "docker logs ikai-backend --tail 100 | grep -i 'error\\|exception'",
    "services_health": "docker ps --filter 'name=ikai' --format '{{.Names}}: {{.Status}}'",
    "backend_health": "curl -s http://localhost:8102/health | jq"
  }
}
```

### Example: Phase 3 with Logs

**Worker's report MUST include:**
```markdown
## 9. Console & Log Verification

### Frontend Logs
```bash
$ docker logs ikai-frontend --tail 50 | grep -i "error\|warning"
```

**Output:**
```
(no output = clean logs)
```

### Backend Logs
```bash
$ docker logs ikai-backend --tail 100 | grep -i "error\|exception"
```

**Output:**
```
(no output = clean logs)
```

### Services Health
```bash
$ docker ps --filter "name=ikai" --format "{{.Names}}: {{.Status}}"
```

**Output:**
```
ikai-frontend: Up 2 hours
ikai-backend: Up 2 hours (healthy)
ikai-postgres: Up 2 hours (healthy)
```

### Browser Console (User Check)
- Opened http://localhost:8103/job-postings
- Console: **0 errors, 0 warnings** ✅
- Page loaded successfully ✅
```

**Mod's cross-check:**
- Re-run same docker logs commands
- Compare outputs
- Ask user to verify browser console
- If Worker said "0 errors" but Mod finds errors → Worker LIED

---

## 🚨 WHAT COUNTS AS "CLEAN"?

**✅ ACCEPTABLE:**
```
# Dev mode warnings (OK to ignore)
⚠ You are using a non-standard "NODE_ENV" value
⚠ npm notice New major version available

# Info logs (OK)
[info]: ✅ Backend running
[info]: Redis connected
```

**❌ NOT ACCEPTABLE (MUST FIX BEFORE DONE):**
```
# Errors
Error: Cannot find module
TypeError: undefined is not a function
GET /api/v1/team 500 (Internal Server Error)

# Exceptions
UnhandledPromiseRejectionWarning
PrismaClientKnownRequestError

# Failed builds
✗ Failed to compile
✗ Build failed because of webpack errors

# Database errors
ERROR: relation "User" does not exist
ERROR: column "name" does not exist
```

### Enforcement Rule

**Worker reports done + Mod finds errors = PHASE FAILED**

Example:
```
Worker: "Phase 3 bitti ✅"
Mod: *checks logs* "GET /api/v1/team 500 error found"
Mod: "❌ Phase 3 INCOMPLETE - Backend error must be fixed"
User: Worker must fix error and re-verify
```

**Why this matters:**
- Unnoticed errors = Technical debt
- 500 errors = Broken functionality
- Console errors = User will report bugs
- Clean logs = Production ready

---

## 💡 Best Practices

**For Mod:**
1. ALWAYS re-run verification commands (no exceptions!)
2. Use parallel Bash calls for speed (up to 30 simultaneous)
3. Document mismatches clearly
4. Don't trust "looks good" - verify with data
5. **BLOCK next phase until current phase verified** ⚠️
6. **CHECK console logs for errors** - Frontend/Backend must be clean
7. **VERIFY services health** - docker logs, health endpoints
8. **DOCUMENT all errors found** - Console, terminal, build logs

**For Worker:**
1. NEVER type outputs manually
2. ALWAYS use Bash tool for commands
3. Copy-paste EXACT outputs (character-by-character)
4. If command fails, paste the REAL error
5. Know Mod will verify - honesty is mandatory
6. **CHECK browser console before reporting done** - No errors allowed
7. **CHECK backend logs** - docker logs ikai-backend
8. **TEST actual functionality** - Click links, verify behavior

**For User:**
1. Check Mod's verification reports
2. If suspicious, run commands yourself
3. Trust the cross-check system
4. Report systematic lying (model feedback)
5. **WAIT for Mod verification before starting next phase** ⚠️

---

## 🔌 ENDPOINT TESTING PROTOCOL (CRITICAL!)

**Problem:** Worker can say "endpoint works" without actually testing it!

**Solution:** Worker MUST test endpoints with curl and paste real HTTP responses.

---

### Why Endpoint Testing Matters

**Scenario: Worker lies about endpoint**
```markdown
Worker: "✅ GET /api/v1/job-postings endpoint working - returns 200"
```

**Problem:** Worker never tested! Endpoint returns 500 error in production.

**AsanMod Solution:** Worker MUST run real curl commands and paste EXACT HTTP responses.

---

### Worker Workflow

#### Step 1: Create Test User with Required Role

```bash
# Example: Create HR_SPECIALIST test user for testing job-postings endpoint
curl -X POST http://localhost:8102/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-hr@test.com",
    "password": "test123",
    "name": "Test HR User",
    "role": "HR_SPECIALIST"
  }'
```

**Worker MUST paste EXACT output:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "cm123abc"
}
```

#### Step 2: Get JWT Token

```bash
# Login and extract token
TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-hr@test.com","password":"test123"}' | jq -r '.token')

echo "Token: $TOKEN"
```

**Worker MUST paste token:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTEyM2FiYyIsInJvbGUiOiJIUl9TUEVDSUFMSVNUIiwiaWF0IjoxNzMwNzE4MDAwfQ.abc123def456
```

#### Step 3: Test Endpoint - Success Cases

```bash
# Test authorized endpoint (should return 200/201)
curl -v -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" 2>&1 | grep -E "< HTTP|< Content-Type|^{"
```

**Worker MUST paste full response:**
```
< HTTP/1.1 200 OK
< Content-Type: application/json
{"success":true,"data":[{"id":"jp1","title":"Software Engineer","status":"ACTIVE"}],"count":1}
```

#### Step 4: Test Endpoint - Failure Cases

**Test 1: Missing token (should return 401)**
```bash
curl -v -X GET http://localhost:8102/api/v1/job-postings \
  -H "Content-Type: application/json" 2>&1 | grep -E "< HTTP|^{"
```

**Expected output:**
```
< HTTP/1.1 401 Unauthorized
{"success":false,"message":"No token provided"}
```

**Test 2: Wrong role (should return 403)**
```bash
# Login as USER role
USER_TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-user@test.com","password":"test123"}' | jq -r '.token')

# Try to access HR_SPECIALIST endpoint
curl -v -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $USER_TOKEN" 2>&1 | grep -E "< HTTP|^{"
```

**Expected output:**
```
< HTTP/1.1 403 Forbidden
{"success":false,"message":"Insufficient permissions"}
```

**Test 3: Non-existent resource (should return 404)**
```bash
curl -v -X GET http://localhost:8102/api/v1/job-postings/nonexistent-id \
  -H "Authorization: Bearer $TOKEN" 2>&1 | grep -E "< HTTP|^{"
```

**Expected output:**
```
< HTTP/1.1 404 Not Found
{"success":false,"message":"Job posting not found"}
```

#### Step 5: Paste ALL Outputs to Verification MD

**Report template:**
```markdown
## X. Endpoint Testing

### Test User Creation

```bash
$ curl -X POST http://localhost:8102/api/v1/auth/register ...
```

**Worker Output:**
```json
{"success":true,"userId":"cm123abc"}
```

**Mod Re-Run:**
```
[MOD_FILLS_THIS]
```

**Match?** [MOD: YES/NO]

---

### JWT Token Acquisition

```bash
$ TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login ...)
$ echo "Token: $TOKEN"
```

**Worker Output:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Mod Re-Run:**
```
[MOD_FILLS_THIS]
```

**Match?** [MOD: YES/NO]

---

### Success Case: GET /api/v1/job-postings (200)

```bash
$ curl -v -X GET http://localhost:8102/api/v1/job-postings -H "Authorization: Bearer $TOKEN"
```

**Worker Output:**
```
< HTTP/1.1 200 OK
{"success":true,"data":[...],"count":5}
```

**Mod Re-Run:**
```
[MOD_FILLS_THIS]
```

**Match?** [MOD: YES/NO]

---

### Failure Case: No Token (401)

```bash
$ curl -v -X GET http://localhost:8102/api/v1/job-postings
```

**Worker Output:**
```
< HTTP/1.1 401 Unauthorized
{"success":false,"message":"No token provided"}
```

**Mod Re-Run:**
```
[MOD_FILLS_THIS]
```

**Match?** [MOD: YES/NO]

---

### Failure Case: Wrong Role (403)

```bash
$ curl -v -X GET http://localhost:8102/api/v1/job-postings -H "Authorization: Bearer $USER_TOKEN"
```

**Worker Output:**
```
< HTTP/1.1 403 Forbidden
{"success":false,"message":"Insufficient permissions"}
```

**Mod Re-Run:**
```
[MOD_FILLS_THIS]
```

**Match?** [MOD: YES/NO]
```

---

### Mod Verification Workflow

**Mod MUST re-run SAME curl commands and compare:**

1. **Status codes match?**
   - Worker: `< HTTP/1.1 200 OK`
   - Mod: `< HTTP/1.1 200 OK`
   - ✅ Match → Verified

2. **Response bodies match?**
   - Worker: `{"success":true,"count":5}`
   - Mod: `{"success":true,"count":5}`
   - ✅ Match → Verified

3. **Error messages match?**
   - Worker: `401 Unauthorized - No token`
   - Mod: `401 Unauthorized - No token`
   - ✅ Match → Verified

**If ANY mismatch:**
- ❌ Worker LIED (used fake data)
- Report to user: "Endpoint testing verification FAILED - Section X mismatch"
- Phase must be re-done

**If ALL match:**
- ✅ Worker used REAL curl commands
- Endpoint functionality VERIFIED
- Safe to proceed to next phase

---

### Endpoint Testing Checklist

**Worker MUST test:**
- ✅ Create test user with correct role
- ✅ Login and get JWT token
- ✅ Test success case (200/201)
- ✅ Test no token (401)
- ✅ Test wrong role (403)
- ✅ Test not found (404)
- ✅ Paste ALL curl outputs with HTTP headers
- ✅ Include both request and response
- ✅ Show status codes explicitly

**Mod MUST verify:**
- ✅ Re-run user creation curl
- ✅ Re-run login curl
- ✅ Re-run endpoint test curls
- ✅ Compare status codes
- ✅ Compare response bodies
- ✅ Compare error messages
- ✅ Mark mismatches clearly

**FORBIDDEN:**
- ❌ Worker types "200 OK" without running curl
- ❌ Worker says "tested in browser" (no proof!)
- ❌ Worker uses Postman without exporting output
- ❌ Worker simulates/mocks responses
- ❌ Mod trusts Worker without re-running

**REQUIRED:**
- ✅ Real curl commands only
- ✅ Paste EXACT HTTP responses
- ✅ Include status codes
- ✅ Test both success and failure cases
- ✅ Mod cross-check with same commands

---

### Integration with Phase JSONs

**All phase JSONs MUST include endpoint testing task:**

```json
{
  "id": "X.14",
  "title": "Endpoint Testing with curl",
  "instructions": [
    "1. Create test user with required role (HR_SPECIALIST, ADMIN, etc.)",
    "2. Login with test user to get JWT token",
    "3. Test endpoint success case (200/201) with valid token",
    "4. Test failure cases: no token (401), wrong role (403), not found (404)",
    "5. Use curl -v to see HTTP headers and status codes",
    "6. Paste EXACT curl outputs to verification MD report",
    "7. Include both request and response in report",
    "❌ FORBIDDEN: Saying 'tested successfully' without curl outputs",
    "✅ REQUIRED: Real HTTP responses with status codes"
  ],
  "verificationCommands": {
    "create_test_user": "curl -X POST http://localhost:8102/api/v1/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test-hr@test.com\",\"password\":\"test123\",\"role\":\"HR_SPECIALIST\"}'",
    "login_test_user": "curl -s -X POST http://localhost:8102/api/v1/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"test-hr@test.com\",\"password\":\"test123\"}' | jq -r '.token'",
    "test_endpoint_success": "curl -v -X GET http://localhost:8102/api/v1/job-postings -H 'Authorization: Bearer $TOKEN' 2>&1 | grep -E '< HTTP|^{'",
    "test_endpoint_no_token": "curl -v -X GET http://localhost:8102/api/v1/job-postings 2>&1 | grep -E '< HTTP|^{'",
    "test_endpoint_wrong_role": "curl -v -X GET http://localhost:8102/api/v1/job-postings -H 'Authorization: Bearer $USER_TOKEN' 2>&1 | grep -E '< HTTP|^{'"
  },
  "ENDPOINT_TESTING_REQUIRED": {
    "method": "Real curl commands",
    "description": "Worker MUST test endpoints with curl and paste EXACT HTTP responses",
    "workflow": "1. Create test user → 2. Login get JWT → 3. Test success (200) → 4. Test failures (401/403/404) → 5. Paste ALL outputs",
    "enforcement": "Mod re-runs same curl commands and compares outputs - mismatch = Worker LIED"
  }
}
```

---

### Example: Full Endpoint Test Report

**Phase 3 - Backend Route Protection Verification:**

```markdown
## 8. Endpoint Testing

### 8.1 Create Test User (HR_SPECIALIST)

```bash
$ curl -X POST http://localhost:8102/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test-hr@test.com","password":"test123","name":"Test HR","role":"HR_SPECIALIST"}'
```

**Worker Output:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "cm3abc123",
    "email": "test-hr@test.com",
    "role": "HR_SPECIALIST"
  }
}
```

**Mod Re-Run:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "cm3abc456",
    "email": "test-hr@test.com",
    "role": "HR_SPECIALIST"
  }
}
```

**Match?** ✅ YES (user created successfully, different ID expected)

---

### 8.2 Login and Get JWT Token

```bash
$ TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-hr@test.com","password":"test123"}' | jq -r '.token')

$ echo "Token: $TOKEN"
```

**Worker Output:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTNhYmMxMjMiLCJyb2xlIjoiSFJfU1BFQ0lBTElTVCIsImlhdCI6MTczMDcxODAwMH0.abc123def456ghi789
```

**Mod Re-Run:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTNhYmM0NTYiLCJyb2xlIjoiSFJfU1BFQ0lBTElTVCIsImlhdCI6MTczMDcxODEwMH0.xyz789uvw456rst123
```

**Match?** ✅ YES (token format correct, different token expected due to timestamp)

---

### 8.3 Test Success Case: GET /api/v1/job-postings (200)

```bash
$ curl -v -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" 2>&1 | grep -E "< HTTP|< Content-Type|^{"
```

**Worker Output:**
```
< HTTP/1.1 200 OK
< Content-Type: application/json; charset=utf-8
{"success":true,"data":[{"id":"jp1","title":"Senior Developer","status":"ACTIVE"},{"id":"jp2","title":"HR Manager","status":"ACTIVE"}],"count":2}
```

**Mod Re-Run:**
```
< HTTP/1.1 200 OK
< Content-Type: application/json; charset=utf-8
{"success":true,"data":[{"id":"jp1","title":"Senior Developer","status":"ACTIVE"},{"id":"jp2","title":"HR Manager","status":"ACTIVE"}],"count":2}
```

**Match?** ✅ YES (200 OK, data returned successfully)

---

### 8.4 Test Failure Case: No Token (401)

```bash
$ curl -v -X GET http://localhost:8102/api/v1/job-postings \
  -H "Content-Type: application/json" 2>&1 | grep -E "< HTTP|^{"
```

**Worker Output:**
```
< HTTP/1.1 401 Unauthorized
{"success":false,"message":"No token provided"}
```

**Mod Re-Run:**
```
< HTTP/1.1 401 Unauthorized
{"success":false,"message":"No token provided"}
```

**Match?** ✅ YES (401 as expected, proper error message)

---

### 8.5 Test Failure Case: Wrong Role (403)

```bash
# First create USER role test user
$ curl -X POST http://localhost:8102/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test-user@test.com","password":"test123","role":"USER"}'

# Login as USER
$ USER_TOKEN=$(curl -s -X POST http://localhost:8102/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-user@test.com","password":"test123"}' | jq -r '.token')

# Try to access HR_SPECIALIST endpoint
$ curl -v -X GET http://localhost:8102/api/v1/job-postings \
  -H "Authorization: Bearer $USER_TOKEN" 2>&1 | grep -E "< HTTP|^{"
```

**Worker Output:**
```
< HTTP/1.1 403 Forbidden
{"success":false,"message":"Insufficient permissions. Required roles: HR_SPECIALIST, MANAGER, ADMIN, SUPER_ADMIN"}
```

**Mod Re-Run:**
```
< HTTP/1.1 403 Forbidden
{"success":false,"message":"Insufficient permissions. Required roles: HR_SPECIALIST, MANAGER, ADMIN, SUPER_ADMIN"}
```

**Match?** ✅ YES (403 as expected, role protection working)

---

### 8.6 Test Failure Case: Not Found (404)

```bash
$ curl -v -X GET http://localhost:8102/api/v1/job-postings/nonexistent-id-12345 \
  -H "Authorization: Bearer $TOKEN" 2>&1 | grep -E "< HTTP|^{"
```

**Worker Output:**
```
< HTTP/1.1 404 Not Found
{"success":false,"message":"Job posting not found"}
```

**Mod Re-Run:**
```
< HTTP/1.1 404 Not Found
{"success":false,"message":"Job posting not found"}
```

**Match?** ✅ YES (404 as expected, proper error handling)

---

## Summary: Endpoint Testing Verification

**Total Tests:** 6
**Passed:** 6
**Failed:** 0

**Status Codes Verified:**
- ✅ 200 OK - Authorized access
- ✅ 401 Unauthorized - No token
- ✅ 403 Forbidden - Wrong role
- ✅ 404 Not Found - Resource not found

**Conclusion:** All endpoints tested with REAL curl commands, all outputs match between Worker and Mod. Endpoint functionality VERIFIED ✅
```

---

### Why This Protocol Matters

**Without endpoint testing:**
- Worker says "works" → Actually broken
- 500 errors in production
- Users report bugs
- Emergency hotfix required

**With endpoint testing protocol:**
- Worker tests with real curl → Pastes exact HTTP responses
- Mod re-runs same curl → Verifies outputs match
- Bugs caught before phase completion
- Production-ready code

**Ham veri prensibi (Raw Data Principle):**
- `< HTTP/1.1 200 OK` from terminal cannot be faked
- Mod sees real status codes
- Response bodies must match exactly
- Endpoint functionality proven with data

---

## 📚 Related Documents

- [`ASANMOD-METHODOLOGY.md`](ASANMOD-METHODOLOGY.md) - Full methodology (20KB)
- [`ASANMOD-QUICK-REFERENCE.md`](ASANMOD-QUICK-REFERENCE.md) - Quick reference (5KB)
- [`CLAUDE.md`](../../CLAUDE.md) - Main development guide
- Phase JSONs in `docs/features/role-access-phase*.json`

---

**Version:** 2.0
**Created:** 2025-11-04
**Last Updated:** 2025-11-04

**🎯 AsanMod Verification Protocol = Trust but Verify = Mod Re-Runs Everything**

_"Worker reports, Mod verifies, user trusts the data."_
