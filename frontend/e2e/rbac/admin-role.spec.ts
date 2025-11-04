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
