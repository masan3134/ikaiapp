# AsanMod Mod Automation Guide

**Version:** 1.0
**Created:** 2025-11-04
**Purpose:** Automate manual tasks that Mod can do instead of User

---

## 🎯 Mod's Extended Role

**Original Mod tasks:**
- Plan phases (create JSONs)
- Verify Worker's work (cross-check)
- Coordinate parallel execution

**NEW Mod tasks (automation):**
- Run browser tests (using Playwright/Puppeteer)
- Take screenshots (automated)
- Run TypeScript builds (already doing this)
- Test API endpoints (using curl/axios)
- Generate test reports (automated)

---

## 🔌 Required VS Code Extensions for Mod

### 1. **REST Client** (Already Available!)
**Extension ID:** `humao.rest-client`
**Use case:** Test API endpoints without leaving VS Code

**Mod can:**
```http
### Test USER role trying to access HR route
GET http://localhost:8102/api/v1/job-postings
Authorization: Bearer {{user_token}}

### Expected: 403 Forbidden
```

**AsanMod usage:**
- Mod creates `.http` files for API tests
- Runs them via REST Client extension
- Pastes REAL responses to verification MD

### 2. **Playwright Test for VSCode**
**Extension ID:** `ms-playwright.playwright`
**Use case:** Automated browser testing

**Mod can:**
```typescript
// tests/rbac-phase3.spec.ts
test('USER role denied to /job-postings', async ({ page }) => {
  await page.goto('http://localhost:8103/login');
  await page.fill('[name="email"]', 'user@test.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  await page.goto('http://localhost:8103/job-postings');

  // Check for access denied
  const denied = await page.textContent('body');
  expect(denied).toContain('Erişim Engellendi');
});
```

**AsanMod usage:**
- Mod writes Playwright tests from Phase JSON
- Runs tests via VS Code extension
- Pastes REAL test results to MD

### 3. **Thunder Client**
**Extension ID:** `rangav.vscode-thunder-client`
**Use case:** API testing with GUI (alternative to REST Client)

**Mod can:**
- Create collections for each phase
- Test all API endpoints
- Export results to MD format

### 4. **Error Lens**
**Extension ID:** `usernamehw.errorlens`
**Use case:** See TypeScript errors inline (helps Mod verify builds)

**AsanMod usage:**
- Mod sees errors immediately after Worker edits
- Can verify "no TS errors" claim visually

### 5. **Code Spell Checker**
**Extension ID:** `streetsidesoftware.code-spell-checker`
**Use case:** Catch typos in verification reports

**AsanMod usage:**
- Mod checks MD reports for typos
- Ensures professional documentation

---

## 🤖 Mod Automation Workflows

### Workflow 1: Automated Browser Testing (Playwright)

**Before (Manual):**
```
User: Opens browser
User: Logs in as USER
User: Tries /job-postings
User: Sees "Erişim Engellendi"
User: Writes to MD: "Access denied page shown"
```

**After (Automated by Mod):**
```javascript
// Mod creates and runs this test
test('Phase 3 - Browser Testing', async ({ page }) => {
  const roles = ['USER', 'HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'];
  const results = [];

  for (const role of roles) {
    await page.goto('http://localhost:8103/login');
    await page.fill('[name="email"]', `${role.toLowerCase()}@test.com`);
    await page.fill('[name="password"]', 'test123');
    await page.click('button[type="submit"]');

    // Test /job-postings access
    await page.goto('http://localhost:8103/job-postings');
    const screenshot = await page.screenshot({ path: `test-${role}-job-postings.png` });
    const pageText = await page.textContent('body');

    results.push({
      role,
      url: '/job-postings',
      result: pageText.includes('Erişim Engellendi') ? 'DENIED' : 'ALLOWED',
      screenshot: `test-${role}-job-postings.png`
    });
  }

  // Mod writes results to MD
  fs.writeFileSync('docs/reports/phase3-browser-test-automated.md',
    generateMD(results));
});
```

**Output:** `docs/reports/phase3-browser-test-automated.md` with REAL screenshots

---

### Workflow 2: Automated API Testing (REST Client)

**Mod creates:** `tests/phase3-api-tests.http`

```http
@baseUrl = http://localhost:8102/api/v1
@userToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
@hrToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

### Test 1: USER tries to access job-postings (should be 403)
GET {{baseUrl}}/job-postings
Authorization: Bearer {{userToken}}

### Test 2: HR_SPECIALIST accesses job-postings (should be 200)
GET {{baseUrl}}/job-postings
Authorization: Bearer {{hrToken}}

### Test 3: USER tries to access settings (should be 403)
GET {{baseUrl}}/settings/organization
Authorization: Bearer {{userToken}}
```

**Mod runs these via REST Client, pastes responses to MD:**

```markdown
# Phase 3 - API Testing Results

## Test 1: USER → /job-postings

**Request:**
```http
GET http://localhost:8102/api/v1/job-postings
Authorization: Bearer eyJhbG...
```

**Response:**
```json
{
  "error": "Erişim reddedildi",
  "status": 403
}
```

**Result:** ✅ PASS (expected 403)
```

---

### Workflow 3: TypeScript Build Automation

**Already done!** Mod runs:
```bash
cd frontend && npm run build 2>&1 | head -50
```

But can enhance:
```bash
# Check for specific error types
cd frontend && npm run build 2>&1 | grep -i "error TS"

# Count errors
cd frontend && npm run build 2>&1 | grep -c "error TS"
```

---

## 📋 Updated Phase 3 JSON (with Mod automation)

```json
{
  "tasks": [
    {
      "id": "3.14",
      "title": "Automated Browser Testing (Mod does this)",
      "priority": "HIGH",
      "description": "Mod runs Playwright tests instead of human",
      "automatedBy": "Mod",
      "tool": "Playwright",
      "instructions": [
        "1. Mod creates playwright test from testScenarios",
        "2. Mod runs: npx playwright test tests/phase3-rbac.spec.ts",
        "3. Mod captures screenshots",
        "4. Mod writes results to MD with REAL data",
        "5. User only reviews MD report (no manual testing!)"
      ],
      "testFile": "tests/phase3-rbac.spec.ts",
      "outputFile": "docs/reports/phase3-browser-test-automated.md"
    },
    {
      "id": "3.15",
      "title": "Automated API Testing (Mod does this)",
      "priority": "HIGH",
      "description": "Mod tests API endpoints using REST Client",
      "automatedBy": "Mod",
      "tool": "REST Client or curl",
      "instructions": [
        "1. Mod creates .http file with all test cases",
        "2. Mod runs each request",
        "3. Mod pastes REAL responses to MD",
        "4. User verifies responses match expected"
      ],
      "testFile": "tests/phase3-api-tests.http",
      "outputFile": "docs/reports/phase3-api-test-results.md"
    }
  ]
}
```

---

## 🛠️ VS Code Extension Installation Commands

**For User to install:**
```bash
# Playwright
code --install-extension ms-playwright.playwright

# REST Client
code --install-extension humao.rest-client

# Thunder Client (alternative)
code --install-extension rangav.vscode-thunder-client

# Error Lens
code --install-extension usernamehw.errorlens

# Code Spell Checker
code --install-extension streetsidesoftware.code-spell-checker
```

**After installation, Mod can:**
1. Create Playwright test files
2. Run tests via `npx playwright test`
3. Create .http files
4. Execute API requests
5. Capture screenshots
6. Write automated reports

---

## 📝 Mod Automation Checklist

**When User says "P3 bitti doğrula", Mod can:**

- [x] Read Worker's verification MD
- [x] Re-run grep/wc commands (already doing)
- [x] Compare outputs (already doing)
- [ ] **NEW:** Run Playwright browser tests
- [ ] **NEW:** Run API tests via REST Client
- [ ] **NEW:** Capture screenshots
- [ ] **NEW:** Generate automated test report
- [x] Run TypeScript build (already doing)

**Result:** User doesn't need to do manual testing - Mod does it all!

---

## 🔥 Example: Full Automated Phase 3 Verification

**Mod's workflow:**

1. **Read Worker's MD** ✅ (already doing)
2. **Re-run verification commands** ✅ (already doing)
   ```bash
   grep -r 'withRoleProtection' frontend/app/(authenticated) --include='page.tsx' | wc -l
   ```
3. **NEW: Run Playwright tests**
   ```bash
   npx playwright test tests/phase3-rbac.spec.ts
   ```
   Output:
   ```
   Running 15 tests...
   ✓ USER denied to /job-postings (1.2s)
   ✓ HR_SPECIALIST allowed to /job-postings (0.8s)
   ✓ MANAGER allowed to /offers/analytics (1.1s)
   ...
   15 passed (12s)
   ```

4. **NEW: Run API tests**
   ```bash
   # Using REST Client extension or curl
   curl -H "Authorization: Bearer $USER_TOKEN" http://localhost:8102/api/v1/job-postings
   # Response: {"error": "Erişim reddedildi", "status": 403}
   ```

5. **Generate final report**
   ```markdown
   # Phase 3 - Complete Verification Report (Automated by Mod)

   ## Code Verification ✅
   - Protected pages: 16 (Worker: 16, Mod: 16) - MATCH

   ## Browser Testing ✅ (Automated)
   - 15 tests run
   - 15 passed
   - 0 failed
   - Screenshots: docs/reports/screenshots/

   ## API Testing ✅ (Automated)
   - USER → /job-postings: 403 (expected)
   - HR_SPECIALIST → /job-postings: 200 (expected)
   - All 20 API tests passed

   ## TypeScript Build ✅
   - Build successful
   - 0 errors

   **Status:** PHASE 3 FULLY VERIFIED ✅
   ```

---

## 🎯 Benefits

**Before (Manual):**
- User spends 30 minutes testing in browser
- User manually records results
- Prone to human error
- Boring, repetitive work

**After (Automated by Mod):**
- Mod runs tests in 12 seconds
- Mod generates professional report
- 100% accurate (no human error)
- User just reviews final report

**Time saved:** 30 minutes → 2 minutes (15x faster!)

---

## 📚 Related Docs

- [ASANMOD-VERIFICATION-PROTOCOL.md](ASANMOD-VERIFICATION-PROTOCOL.md) - Mod cross-check protocol
- [ASANMOD-METHODOLOGY.md](ASANMOD-METHODOLOGY.md) - Full methodology
- [CLAUDE.md](../../CLAUDE.md) - Mod's role definition

---

## 🔮 Future Enhancements

**Possible additions:**
1. **Visual regression testing** (Playwright screenshots comparison)
2. **Performance testing** (Lighthouse CI)
3. **Accessibility testing** (axe-core)
4. **Load testing** (k6)
5. **Security testing** (OWASP ZAP)

**All automated by Mod!**

---

**Created:** 2025-11-04
**Last Updated:** 2025-11-04

**🤖 Mod = Automated Testing Machine = No More Manual Testing for User!**
