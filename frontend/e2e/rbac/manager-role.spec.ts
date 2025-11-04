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
