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
