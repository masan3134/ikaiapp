# 📋 Worker 2 Task: E2E RBAC Tests (Playwright)

**Task ID:** W2-E2E-RBAC-TESTS
**Assigned to:** Worker Claude 2
**Created by:** Mod Claude
**Date:** 2025-11-04
**Estimated Duration:** 3-4 hours
**Priority:** CRITICAL
**Complexity:** HIGH

---

## 🎯 Task Overview

**Mission:** Create comprehensive E2E RBAC tests using Playwright to prevent regression and ensure all 18 bug fixes stay fixed.

**Why This Matters:**
- ✅ **18 bugs fixed** in previous RBAC audit → Need to ensure they STAY fixed!
- ✅ **Prevent regression** on every deployment
- ✅ **Automate manual testing** (no more manual role switching!)
- ✅ **CI/CD integration** (tests run automatically on PRs)
- ✅ **Production confidence** (know RBAC works before deploying)

**Expected Outcome:**
- ✅ Playwright installed and configured
- ✅ 4 test suites (USER, HR_SPECIALIST, MANAGER, ADMIN)
- ✅ 80+ E2E tests (20 per role)
- ✅ Page access tests (30+ pages per role)
- ✅ UI element visibility tests (buttons, menus)
- ✅ GitHub Actions workflow (CI/CD)

---

## 📊 Test Coverage Plan

### Role 1: USER (20 tests)
**Allowed Pages (8):**
- ✅ /dashboard
- ✅ /notifications
- ✅ /settings/profile
- ✅ /settings/security
- ✅ /settings/notifications
- ✅ /settings/overview

**Blocked Pages (14):**
- ❌ /wizard
- ❌ /job-postings
- ❌ /candidates
- ❌ /analyses
- ❌ /offers
- ❌ /interviews
- ❌ /team
- ❌ /analytics
- ❌ /super-admin
- ❌ /settings/organization
- ❌ /settings/billing
- ❌ /offers/templates (4 pages)

**UI Elements:**
- ✅ Sidebar: 3 items (Dashboard, Notifications, Settings)
- ❌ No FAB buttons
- ❌ No admin/HR action buttons

---

### Role 2: HR_SPECIALIST (20 tests)
**Allowed Pages (14):**
- ✅ All USER pages (6)
- ✅ /wizard
- ✅ /job-postings
- ✅ /candidates
- ✅ /analyses
- ✅ /offers (all offer pages)
- ✅ /interviews

**Blocked Pages (8):**
- ❌ /team
- ❌ /analytics
- ❌ /super-admin
- ❌ /settings/organization
- ❌ /settings/billing
- ❌ /offers/templates (4 pages)

**UI Elements:**
- ✅ Sidebar: 8 items (includes HR pages)
- ✅ FAB: New Analysis, New Offer
- ❌ No delete buttons (candidates, job postings, analyses)

---

### Role 3: MANAGER (20 tests)
**Allowed Pages (18):**
- ✅ All HR_SPECIALIST pages (14)
- ✅ /team (view only)
- ✅ /analytics
- ✅ /offers/templates (4 pages)

**Blocked Pages (4):**
- ❌ /super-admin
- ❌ /settings/organization
- ❌ /settings/billing

**UI Elements:**
- ✅ Sidebar: 10 items (includes Team, Analytics)
- ✅ FAB: New Analysis, New Offer, New Interview
- ✅ Delete buttons: Offers, Interviews
- ❌ No delete: Candidates, Job Postings, Analyses

---

### Role 4: ADMIN (20 tests)
**Allowed Pages (22):**
- ✅ All MANAGER pages (18)
- ✅ /settings/organization
- ✅ /settings/billing

**Blocked Pages (1):**
- ❌ /super-admin

**UI Elements:**
- ✅ Sidebar: 10 items (same as MANAGER)
- ✅ FAB: All buttons
- ✅ Delete buttons: All resources
- ✅ Team management: Invite, edit, remove

---

## 🛠️ Implementation Tasks

### Task 1: Install Playwright
**Directory:** `/home/asan/Desktop/ikai/frontend`

**Action 1.1:** Install Playwright
```bash
cd /home/asan/Desktop/ikai/frontend
npm install -D @playwright/test
npx playwright install chromium
```

**Action 1.2:** Create Playwright config
**File:** `frontend/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:8103',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8103',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

**Action 1.3:** Update package.json scripts
**File:** `frontend/package.json`

Add to "scripts" section:
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:headed": "playwright test --headed",
"test:e2e:report": "playwright show-report"
```

**Commit after Task 1:**
```bash
git add frontend/package.json frontend/package-lock.json frontend/playwright.config.ts
git commit -m "feat(testing): Install Playwright and add E2E test config"
```

---

### Task 2: Create Test Utilities
**Directory:** `frontend/e2e/utils/`

**File 2.1:** `frontend/e2e/utils/auth.ts`

```typescript
import { Page } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  role: string;
}

export const TEST_USERS: Record<string, TestUser> = {
  USER: {
    email: 'test-user@test-org-1.com',
    password: 'TestPass123!',
    role: 'USER'
  },
  HR_SPECIALIST: {
    email: 'test-hr_specialist@test-org-1.com',
    password: 'TestPass123!',
    role: 'HR_SPECIALIST'
  },
  MANAGER: {
    email: 'test-manager@test-org-1.com',
    password: 'TestPass123!',
    role: 'MANAGER'
  },
  ADMIN: {
    email: 'test-admin@test-org-1.com',
    password: 'TestPass123!',
    role: 'ADMIN'
  },
  SUPER_ADMIN: {
    email: 'info@gaiai.ai',
    password: '23235656',
    role: 'SUPER_ADMIN'
  }
};

export async function login(page: Page, user: TestUser) {
  await page.goto('/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 });
}

export async function logout(page: Page) {
  // Click logout button in sidebar
  await page.click('button:has-text("Çıkış Yap")');
  await page.waitForURL('/login', { timeout: 5000 });
}
```

**File 2.2:** `frontend/e2e/utils/navigation.ts`

```typescript
import { Page, expect } from '@playwright/test';

export async function expectPageAccessible(page: Page, path: string) {
  await page.goto(path);

  // Should NOT redirect to 403 or login
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page).not.toHaveURL(/\/403/);

  // Page should load successfully (no error message)
  const errorMessage = page.locator('text=/yetkiniz yok|forbidden|unauthorized/i');
  await expect(errorMessage).not.toBeVisible();
}

export async function expectPageBlocked(page: Page, path: string) {
  await page.goto(path);

  // Should redirect to 403 or show error
  const is403 = await page.url().includes('/403');
  const hasError = await page.locator('text=/yetkiniz yok|forbidden|unauthorized/i').isVisible();

  expect(is403 || hasError).toBeTruthy();
}

export async function expectSidebarItemCount(page: Page, expectedCount: number) {
  // Count sidebar menu items (excluding user section and logout)
  const menuItems = page.locator('nav a[href^="/"]');
  await expect(menuItems).toHaveCount(expectedCount);
}

export async function expectSidebarHasItem(page: Page, text: string) {
  const item = page.locator(`nav a:has-text("${text}")`);
  await expect(item).toBeVisible();
}

export async function expectSidebarNotHasItem(page: Page, text: string) {
  const item = page.locator(`nav a:has-text("${text}")`);
  await expect(item).not.toBeVisible();
}
```

**Commit after Task 2:**
```bash
git add frontend/e2e/utils/
git commit -m "feat(testing): Add E2E test utilities (auth, navigation)"
```

---

### Task 3: Create USER Role Tests
**File:** `frontend/e2e/rbac/user-role.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../utils/auth';
import { expectPageAccessible, expectPageBlocked, expectSidebarItemCount } from '../utils/navigation';

test.describe('USER Role RBAC Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.USER);
  });

  test.describe('Page Access - Allowed', () => {
    test('can access Dashboard', async ({ page }) => {
      await expectPageAccessible(page, '/dashboard');
    });

    test('can access Notifications', async ({ page }) => {
      await expectPageAccessible(page, '/notifications');
    });

    test('can access Profile Settings', async ({ page }) => {
      await expectPageAccessible(page, '/settings/profile');
    });

    test('can access Security Settings', async ({ page }) => {
      await expectPageAccessible(page, '/settings/security');
    });

    test('can access Notification Settings', async ({ page }) => {
      await expectPageAccessible(page, '/settings/notifications');
    });

    test('can access Settings Overview', async ({ page }) => {
      await expectPageAccessible(page, '/settings/overview');
    });
  });

  test.describe('Page Access - Blocked', () => {
    test('cannot access Wizard', async ({ page }) => {
      await expectPageBlocked(page, '/wizard');
    });

    test('cannot access Job Postings', async ({ page }) => {
      await expectPageBlocked(page, '/job-postings');
    });

    test('cannot access Candidates', async ({ page }) => {
      await expectPageBlocked(page, '/candidates');
    });

    test('cannot access Analyses', async ({ page }) => {
      await expectPageBlocked(page, '/analyses');
    });

    test('cannot access Offers', async ({ page }) => {
      await expectPageBlocked(page, '/offers');
    });

    test('cannot access Interviews', async ({ page }) => {
      await expectPageBlocked(page, '/interviews');
    });

    test('cannot access Team', async ({ page }) => {
      await expectPageBlocked(page, '/team');
    });

    test('cannot access Analytics', async ({ page }) => {
      await expectPageBlocked(page, '/analytics');
    });

    test('cannot access Super Admin', async ({ page }) => {
      await expectPageBlocked(page, '/super-admin');
    });

    test('cannot access Organization Settings', async ({ page }) => {
      await expectPageBlocked(page, '/settings/organization');
    });

    test('cannot access Billing Settings', async ({ page }) => {
      await expectPageBlocked(page, '/settings/billing');
    });
  });

  test.describe('UI Elements', () => {
    test('sidebar shows only USER menu items', async ({ page }) => {
      await page.goto('/dashboard');

      // Should see: Dashboard, Notifications, Settings
      await expectSidebarItemCount(page, 3);
    });

    test('no FAB button visible', async ({ page }) => {
      await page.goto('/dashboard');

      const fab = page.locator('button[aria-label*="floating"]');
      await expect(fab).not.toBeVisible();
    });
  });
});
```

**Commit after Task 3:**
```bash
git add frontend/e2e/rbac/user-role.spec.ts
git commit -m "test(rbac): Add E2E tests for USER role (20 tests)"
```

---

### Task 4: Create HR_SPECIALIST Role Tests
**File:** `frontend/e2e/rbac/hr-specialist-role.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../utils/auth';
import { expectPageAccessible, expectPageBlocked, expectSidebarItemCount } from '../utils/navigation';

test.describe('HR_SPECIALIST Role RBAC Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.HR_SPECIALIST);
  });

  test.describe('Page Access - Allowed', () => {
    test('can access Dashboard', async ({ page }) => {
      await expectPageAccessible(page, '/dashboard');
    });

    test('can access Wizard', async ({ page }) => {
      await expectPageAccessible(page, '/wizard');
    });

    test('can access Job Postings', async ({ page }) => {
      await expectPageAccessible(page, '/job-postings');
    });

    test('can access Candidates', async ({ page }) => {
      await expectPageAccessible(page, '/candidates');
    });

    test('can access Analyses', async ({ page }) => {
      await expectPageAccessible(page, '/analyses');
    });

    test('can access Offers', async ({ page }) => {
      await expectPageAccessible(page, '/offers');
    });

    test('can access New Offer', async ({ page }) => {
      await expectPageAccessible(page, '/offers/new');
    });

    test('can access Offer Wizard', async ({ page }) => {
      await expectPageAccessible(page, '/offers/wizard');
    });

    test('can access Interviews', async ({ page }) => {
      await expectPageAccessible(page, '/interviews');
    });
  });

  test.describe('Page Access - Blocked', () => {
    test('cannot access Team', async ({ page }) => {
      await expectPageBlocked(page, '/team');
    });

    test('cannot access Analytics', async ({ page }) => {
      await expectPageBlocked(page, '/analytics');
    });

    test('cannot access Offer Templates', async ({ page }) => {
      await expectPageBlocked(page, '/offers/templates');
    });

    test('cannot access Template Categories', async ({ page }) => {
      await expectPageBlocked(page, '/offers/templates/categories');
    });

    test('cannot access Super Admin', async ({ page }) => {
      await expectPageBlocked(page, '/super-admin');
    });

    test('cannot access Organization Settings', async ({ page }) => {
      await expectPageBlocked(page, '/settings/organization');
    });

    test('cannot access Billing Settings', async ({ page }) => {
      await expectPageBlocked(page, '/settings/billing');
    });
  });

  test.describe('UI Elements', () => {
    test('sidebar shows HR menu items', async ({ page }) => {
      await page.goto('/dashboard');

      // Should see: Dashboard, Wizard, Job Postings, Candidates, Analyses, Offers, Interviews, Settings
      await expectSidebarItemCount(page, 8);
    });

    test('FAB button visible with HR actions', async ({ page }) => {
      await page.goto('/dashboard');

      const fab = page.locator('button[aria-label*="floating"]');
      await expect(fab).toBeVisible();
    });

    test('cannot see delete buttons on Job Postings', async ({ page }) => {
      await page.goto('/job-postings');

      const deleteButton = page.locator('button:has-text("Sil")').first();
      await expect(deleteButton).not.toBeVisible();
    });
  });
});
```

**Commit after Task 4:**
```bash
git add frontend/e2e/rbac/hr-specialist-role.spec.ts
git commit -m "test(rbac): Add E2E tests for HR_SPECIALIST role (20 tests)"
```

---

### Task 5: Create MANAGER Role Tests
**File:** `frontend/e2e/rbac/manager-role.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../utils/auth';
import { expectPageAccessible, expectPageBlocked, expectSidebarItemCount } from '../utils/navigation';

test.describe('MANAGER Role RBAC Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.MANAGER);
  });

  test.describe('Page Access - Allowed', () => {
    test('can access Dashboard', async ({ page }) => {
      await expectPageAccessible(page, '/dashboard');
    });

    test('can access Team (view only)', async ({ page }) => {
      await expectPageAccessible(page, '/team');
    });

    test('can access Analytics', async ({ page }) => {
      await expectPageAccessible(page, '/analytics');
    });

    test('can access Offer Templates', async ({ page }) => {
      await expectPageAccessible(page, '/offers/templates');
    });

    test('can access Template Categories', async ({ page }) => {
      await expectPageAccessible(page, '/offers/templates/categories');
    });

    // All HR_SPECIALIST pages also allowed
    test('can access Wizard', async ({ page }) => {
      await expectPageAccessible(page, '/wizard');
    });

    test('can access Job Postings', async ({ page }) => {
      await expectPageAccessible(page, '/job-postings');
    });

    test('can access Candidates', async ({ page }) => {
      await expectPageAccessible(page, '/candidates');
    });

    test('can access Offers', async ({ page }) => {
      await expectPageAccessible(page, '/offers');
    });

    test('can access Interviews', async ({ page }) => {
      await expectPageAccessible(page, '/interviews');
    });
  });

  test.describe('Page Access - Blocked', () => {
    test('cannot access Super Admin', async ({ page }) => {
      await expectPageBlocked(page, '/super-admin');
    });

    test('cannot access Organization Settings', async ({ page }) => {
      await expectPageBlocked(page, '/settings/organization');
    });

    test('cannot access Billing Settings', async ({ page }) => {
      await expectPageBlocked(page, '/settings/billing');
    });
  });

  test.describe('UI Elements', () => {
    test('sidebar shows MANAGER menu items', async ({ page }) => {
      await page.goto('/dashboard');

      // Should see 10 items: Dashboard, Job Postings, Candidates, Wizard, Analyses, Offers, Interviews, Team, Analytics, Settings
      await expectSidebarItemCount(page, 10);
    });

    test('can see Team in sidebar', async ({ page }) => {
      await page.goto('/dashboard');

      const teamLink = page.locator('nav a:has-text("Takım")');
      await expect(teamLink).toBeVisible();
    });

    test('can see Analytics in sidebar', async ({ page }) => {
      await page.goto('/dashboard');

      const analyticsLink = page.locator('nav a:has-text("Analitik")');
      await expect(analyticsLink).toBeVisible();
    });

    test('can see delete button on Offers', async ({ page }) => {
      // Navigate to offers and check if delete button exists
      await page.goto('/offers');

      // If there are offers, delete button should be visible
      const offerRow = page.locator('table tbody tr').first();
      if (await offerRow.isVisible()) {
        const deleteButton = offerRow.locator('button:has-text("Sil")');
        await expect(deleteButton).toBeVisible();
      }
    });

    test('cannot invite team members', async ({ page }) => {
      await page.goto('/team');

      const inviteButton = page.locator('button:has-text("Davet Et")');
      await expect(inviteButton).not.toBeVisible();
    });
  });
});
```

**Commit after Task 5:**
```bash
git add frontend/e2e/rbac/manager-role.spec.ts
git commit -m "test(rbac): Add E2E tests for MANAGER role (20 tests)"
```

---

### Task 6: Create ADMIN Role Tests
**File:** `frontend/e2e/rbac/admin-role.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../utils/auth';
import { expectPageAccessible, expectPageBlocked, expectSidebarItemCount } from '../utils/navigation';

test.describe('ADMIN Role RBAC Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.ADMIN);
  });

  test.describe('Page Access - Allowed', () => {
    test('can access Dashboard', async ({ page }) => {
      await expectPageAccessible(page, '/dashboard');
    });

    test('can access Organization Settings', async ({ page }) => {
      await expectPageAccessible(page, '/settings/organization');
    });

    test('can access Billing Settings', async ({ page }) => {
      await expectPageAccessible(page, '/settings/billing');
    });

    test('can access Team', async ({ page }) => {
      await expectPageAccessible(page, '/team');
    });

    test('can access Analytics', async ({ page }) => {
      await expectPageAccessible(page, '/analytics');
    });

    // All MANAGER pages also allowed
    test('can access Wizard', async ({ page }) => {
      await expectPageAccessible(page, '/wizard');
    });

    test('can access Job Postings', async ({ page }) => {
      await expectPageAccessible(page, '/job-postings');
    });

    test('can access Candidates', async ({ page }) => {
      await expectPageAccessible(page, '/candidates');
    });

    test('can access Offers', async ({ page }) => {
      await expectPageAccessible(page, '/offers');
    });

    test('can access Interviews', async ({ page }) => {
      await expectPageAccessible(page, '/interviews');
    });
  });

  test.describe('Page Access - Blocked', () => {
    test('cannot access Super Admin', async ({ page }) => {
      await expectPageBlocked(page, '/super-admin');
    });
  });

  test.describe('UI Elements', () => {
    test('sidebar shows ADMIN menu items', async ({ page }) => {
      await page.goto('/dashboard');

      // Should see 10 items (same as MANAGER)
      await expectSidebarItemCount(page, 10);
    });

    test('can invite team members', async ({ page }) => {
      await page.goto('/team');

      const inviteButton = page.locator('button:has-text("Davet Et")');
      await expect(inviteButton).toBeVisible();
    });

    test('can see delete button on Job Postings', async ({ page }) => {
      await page.goto('/job-postings');

      const jobRow = page.locator('table tbody tr').first();
      if (await jobRow.isVisible()) {
        const deleteButton = jobRow.locator('button:has-text("Sil")');
        await expect(deleteButton).toBeVisible();
      }
    });

    test('can see delete button on Candidates', async ({ page }) => {
      await page.goto('/candidates');

      const candidateRow = page.locator('table tbody tr').first();
      if (await candidateRow.isVisible()) {
        const deleteButton = candidateRow.locator('button:has-text("Sil")');
        await expect(deleteButton).toBeVisible();
      }
    });

    test('can access organization settings tabs', async ({ page }) => {
      await page.goto('/settings/organization');

      const generalTab = page.locator('button:has-text("Genel")');
      await expect(generalTab).toBeVisible();
    });
  });
});
```

**Commit after Task 6:**
```bash
git add frontend/e2e/rbac/admin-role.spec.ts
git commit -m "test(rbac): Add E2E tests for ADMIN role (20 tests)"
```

---

### Task 7: Create GitHub Actions Workflow
**File:** `.github/workflows/e2e-tests.yml`

```yaml
name: E2E RBAC Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    timeout-minutes: 20
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: ikaiuser
          POSTGRES_PASSWORD: ikaipass2025
          POSTGRES_DB: ikaidb_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: |
            backend/package-lock.json
            frontend/package-lock.json

      - name: Install backend dependencies
        working-directory: backend
        run: npm ci

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Setup test database
        working-directory: backend
        env:
          DATABASE_URL: postgresql://ikaiuser:ikaipass2025@localhost:5432/ikaidb_test
        run: |
          npx prisma migrate deploy
          node create-test-data.js

      - name: Start backend server
        working-directory: backend
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://ikaiuser:ikaipass2025@localhost:5432/ikaidb_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret-key-for-ci
        run: |
          npm run dev &
          sleep 10

      - name: Install Playwright browsers
        working-directory: frontend
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        working-directory: frontend
        env:
          BASE_URL: http://localhost:8103
        run: npm run test:e2e

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 7

      - name: Upload test screenshots
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-screenshots
          path: frontend/test-results/
          retention-days: 7
```

**Commit after Task 7:**
```bash
git add .github/workflows/e2e-tests.yml
git commit -m "ci(testing): Add GitHub Actions workflow for E2E RBAC tests"
```

---

## 🧪 Testing & Verification

### Test 1: Playwright Installation Check
**Action:** Verify Playwright installed correctly

**Verification command:**
```bash
cd /home/asan/Desktop/ikai/frontend
npx playwright --version
```

**Expected output:**
```
Version 1.4x.x
```

**Success criteria:**
- ✅ Playwright version displayed
- ✅ No errors

---

### Test 2: Run USER Role Tests
**Action:** Run USER role test suite

**Verification command:**
```bash
cd /home/asan/Desktop/ikai/frontend
npm run test:e2e -- rbac/user-role.spec.ts
```

**Expected output:**
```
Running 20 tests using 1 worker

✓ USER Role RBAC Tests > Page Access - Allowed > can access Dashboard (Xms)
✓ USER Role RBAC Tests > Page Access - Allowed > can access Notifications (Xms)
...
✓ USER Role RBAC Tests > Page Access - Blocked > cannot access Wizard (Xms)
✓ USER Role RBAC Tests > Page Access - Blocked > cannot access Team (Xms)
...
✓ USER Role RBAC Tests > UI Elements > sidebar shows only USER menu items (Xms)

20 passed (Xs)
```

**Success criteria:**
- ✅ All 20 tests pass
- ✅ No test failures
- ✅ Screenshot on failures only

---

### Test 3: Run HR_SPECIALIST Role Tests
**Verification command:**
```bash
npm run test:e2e -- rbac/hr-specialist-role.spec.ts
```

**Expected:** 20 tests pass

---

### Test 4: Run MANAGER Role Tests
**Verification command:**
```bash
npm run test:e2e -- rbac/manager-role.spec.ts
```

**Expected:** 20 tests pass

---

### Test 5: Run ADMIN Role Tests
**Verification command:**
```bash
npm run test:e2e -- rbac/admin-role.spec.ts
```

**Expected:** 20 tests pass

---

### Test 6: Run All RBAC Tests
**Action:** Run entire RBAC test suite

**Verification command:**
```bash
npm run test:e2e -- rbac/
```

**Expected output:**
```
Running 80 tests using 4 workers

✓ USER Role RBAC Tests (20 tests)
✓ HR_SPECIALIST Role RBAC Tests (20 tests)
✓ MANAGER Role RBAC Tests (20 tests)
✓ ADMIN Role RBAC Tests (20 tests)

80 passed (Xs)
```

**Success criteria:**
- ✅ 80/80 tests pass
- ✅ All 4 roles tested
- ✅ No failures

---

### Test 7: GitHub Actions Workflow Check
**Action:** Verify workflow file is valid

**Verification command:**
```bash
cat .github/workflows/e2e-tests.yml | grep "name: E2E RBAC Tests"
```

**Expected output:**
```
name: E2E RBAC Tests
```

**Success criteria:**
- ✅ Workflow file created
- ✅ Valid YAML syntax
- ✅ Includes all steps

---

### Test 8: Local Test Report
**Action:** Generate and view HTML test report

**Verification command:**
```bash
npm run test:e2e:report
```

**Expected:** Browser opens with Playwright test report showing all 80 tests

**Success criteria:**
- ✅ Report generated
- ✅ All tests visible
- ✅ Pass/fail status clear

---

## 📝 Verification Report Template

```markdown
# ✅ Worker 2 Verification Report: E2E RBAC Tests

**Task ID:** W2-E2E-RBAC-TESTS
**Completed by:** Worker Claude 2
**Date:** 2025-11-04
**Duration:** [ACTUAL TIME]

---

## 📋 Tasks Completed

### Task 1: Install Playwright ✅
**Files:** package.json, playwright.config.ts
**Commit:** [HASH]

**Verification:**
```bash
npx playwright --version
```

**Output:**
```
[PASTE ACTUAL OUTPUT]
```

**Status:** ✅ VERIFIED

---

### Task 2: Create Test Utilities ✅
**Files:** e2e/utils/auth.ts, e2e/utils/navigation.ts
**Commit:** [HASH]

**Verification:**
```bash
ls -la frontend/e2e/utils/
```

**Output:**
```
[PASTE ACTUAL OUTPUT]
```

**Status:** ✅ VERIFIED

---

### Task 3-6: Create Role Tests ✅
**Files:**
- e2e/rbac/user-role.spec.ts
- e2e/rbac/hr-specialist-role.spec.ts
- e2e/rbac/manager-role.spec.ts
- e2e/rbac/admin-role.spec.ts

**Commits:** [4 HASHES]

**Verification:**
```bash
npm run test:e2e -- rbac/
```

**Output:**
```
[PASTE ACTUAL TEST RESULTS]
```

**Status:** ✅ VERIFIED

---

### Task 7: GitHub Actions Workflow ✅
**File:** .github/workflows/e2e-tests.yml
**Commit:** [HASH]

**Verification:**
```bash
cat .github/workflows/e2e-tests.yml | grep "name:"
```

**Output:**
```
[PASTE ACTUAL OUTPUT]
```

**Status:** ✅ VERIFIED

---

## 🧪 Test Results

### All Tests Summary
**Total Tests:** 80
**Passed:** [NUMBER]
**Failed:** [NUMBER]
**Duration:** [TIME]

**Breakdown by Role:**
- USER: [PASS]/20
- HR_SPECIALIST: [PASS]/20
- MANAGER: [PASS]/20
- ADMIN: [PASS]/20

---

## 📊 Summary

**Total Tasks:** 7
**Tasks Completed:** [NUMBER]
**Tests Created:** 80
**Tests Passing:** [NUMBER]
**Git Commits:** [NUMBER]

**Overall Status:** ✅ SUCCESS / ⚠️ PARTIAL / ❌ FAILED

---

## 🎯 Impact

**Before:**
- Manual role testing (time-consuming)
- No automated RBAC verification
- Risk of regression

**After:**
- 80 automated E2E tests
- CI/CD integration (runs on every PR)
- Regression prevention
- Production confidence

---

**Worker 2 Sign-off:** [YOUR NAME]
**Date:** 2025-11-04
**Ready for Mod Verification:** ✅ YES / ❌ NO
```

---

## 🚨 Important Reminders

### Git Policy
- ✅ **7 commits required** (1 per task)
- ✅ **Commit immediately after EACH task**
- ✅ **NO batch commits**

### Test Environment
- ✅ Backend must be running (localhost:8102)
- ✅ Frontend must be running (localhost:8103)
- ✅ Test database must have test users
- ✅ Docker services must be up

### Troubleshooting
If tests fail:
1. Check backend is running: `curl http://localhost:8102/health`
2. Check test users exist: Run `create-test-data.js`
3. Check browser console in headed mode: `npm run test:e2e:headed`
4. Check screenshots in `test-results/` folder

---

## 📖 Reference Documents

**Playwright Docs:** https://playwright.dev/docs/intro
**RBAC Audit Reports:**
- `docs/reports/worker1-user-role-rbac-audit-report.md`
- `docs/reports/worker2-hr-specialist-rbac-audit-report.md`
- `docs/reports/worker3-manager-rbac-audit-report.md`
- `docs/reports/worker4-admin-rbac-audit-report.md`

**Test Users:** `docs/test-tasks/test-data-reference.md`

---

## ✅ Task Checklist

Before starting:
- [ ] Read this entire task file
- [ ] Backend services running (Docker)
- [ ] Test data created
- [ ] Frontend can access backend

During execution:
- [ ] Task 1: Install Playwright → Commit
- [ ] Task 2: Create test utils → Commit
- [ ] Task 3: USER tests → Commit
- [ ] Task 4: HR_SPECIALIST tests → Commit
- [ ] Task 5: MANAGER tests → Commit
- [ ] Task 6: ADMIN tests → Commit
- [ ] Task 7: GitHub Actions → Commit
- [ ] Run all 8 verification tests

After execution:
- [ ] All 80 tests passing
- [ ] 7 commits created and pushed
- [ ] Verification report written
- [ ] Short message sent to User

---

**Estimated Time Breakdown:**
- Task 1 (Playwright install): 15 minutes
- Task 2 (Test utils): 20 minutes
- Task 3 (USER tests): 30 minutes
- Task 4 (HR_SPECIALIST tests): 30 minutes
- Task 5 (MANAGER tests): 30 minutes
- Task 6 (ADMIN tests): 30 minutes
- Task 7 (GitHub Actions): 20 minutes
- Testing & verification: 30 minutes
- Report writing: 30 minutes
- **Total:** ~3.5 hours

---

**Ready to start? Good luck, Worker 2! 🚀**

**Created by:** Mod Claude
**Date:** 2025-11-04
**Version:** 1.0
