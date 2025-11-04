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
