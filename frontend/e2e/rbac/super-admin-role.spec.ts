import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../utils/auth';
import { expectPageAccessible, expectSidebarItemCount, expectSidebarHasItem } from '../utils/navigation';

test.describe('SUPER_ADMIN Role RBAC Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.SUPER_ADMIN);
  });

  test.describe('Page Access - SUPER_ADMIN can access ALL pages', () => {
    test('can access Super Admin Dashboard', async ({ page }) => {
      await expectPageAccessible(page, '/super-admin');
    });

    test('can access Super Admin Organizations', async ({ page }) => {
      await expectPageAccessible(page, '/super-admin/organizations');
    });

    test('can access Super Admin Queue Management', async ({ page }) => {
      await expectPageAccessible(page, '/super-admin/queue-management');
    });

    test('can access Super Admin Security Logs', async ({ page }) => {
      await expectPageAccessible(page, '/super-admin/security-logs');
    });

    test('can access Super Admin System Health', async ({ page }) => {
      await expectPageAccessible(page, '/super-admin/system-health');
    });

    // SUPER_ADMIN also has access to ALL organization pages
    test('can access Dashboard', async ({ page }) => {
      await expectPageAccessible(page, '/dashboard');
    });

    test('can access Job Postings', async ({ page }) => {
      await expectPageAccessible(page, '/job-postings');
    });

    test('can access Candidates', async ({ page }) => {
      await expectPageAccessible(page, '/candidates');
    });

    test('can access Wizard', async ({ page }) => {
      await expectPageAccessible(page, '/wizard');
    });

    test('can access Team', async ({ page }) => {
      await expectPageAccessible(page, '/team');
    });

    test('can access Analytics', async ({ page }) => {
      await expectPageAccessible(page, '/analytics');
    });
  });

  test.describe('UI Elements - Sidebar Verification', () => {
    test('sidebar shows ALL menu items (13 main items expected)', async ({ page }) => {
      await page.goto('/dashboard');

      // Wait for sidebar to load
      await page.waitForSelector('nav', { timeout: 5000 });

      // Count all main menu items (nav > a[href])
      const menuItems = page.locator('nav a[href^="/"]');
      const count = await menuItems.count();

      console.log(`✅ Found ${count} sidebar items`);

      // List all items for debugging
      for (let i = 0; i < count; i++) {
        const text = await menuItems.nth(i).textContent();
        console.log(`  ${i + 1}. ${text?.trim()}`);
      }

      // SUPER_ADMIN should see MORE items than other roles (13 main expected)
      expect(count).toBeGreaterThanOrEqual(13);
    });

    test('sidebar has "Sistem Yönetimi" menu (SUPER_ADMIN exclusive)', async ({ page }) => {
      await page.goto('/dashboard');

      // Check for SUPER_ADMIN exclusive menu
      await expectSidebarHasItem(page, 'Sistem Yönetimi');
    });

    test('can expand Sistem Yönetimi submenu', async ({ page }) => {
      await page.goto('/dashboard');

      // Click Sistem Yönetimi to expand
      const sistemYonetimi = page.locator('nav button:has-text("Sistem Yönetimi"), nav a:has-text("Sistem Yönetimi")');
      await sistemYonetimi.click();

      // Check submenu items
      await expect(page.locator('text=Organizasyonlar')).toBeVisible();
      await expect(page.locator('text=Kuyruk Yönetimi')).toBeVisible();
      await expect(page.locator('text=Güvenlik Logları')).toBeVisible();
      await expect(page.locator('text=Sistem Sağlığı')).toBeVisible();
    });

    test('can expand Teklifler submenu (all 4 items visible)', async ({ page }) => {
      await page.goto('/dashboard');

      // Click Teklifler to expand
      const teklifler = page.locator('nav button:has-text("Teklifler")');
      await teklifler.click();

      // SUPER_ADMIN sees all 4 offer submenu items
      await expect(page.locator('text=Tüm Teklifler')).toBeVisible();
      await expect(page.locator('text=Yeni Teklif')).toBeVisible();
      await expect(page.locator('text=Şablonlar')).toBeVisible();
      await expect(page.locator('text=Analitik')).toBeVisible();
    });

    test('can expand Ayarlar submenu', async ({ page }) => {
      await page.goto('/dashboard');

      // Click Ayarlar to expand
      const ayarlar = page.locator('nav button:has-text("Ayarlar")');
      await ayarlar.click();

      // Check some settings items
      await expect(page.locator('text=Profil')).toBeVisible();
    });
  });

  test.describe('SUPER_ADMIN System Pages', () => {
    test('Organizations page shows all organizations', async ({ page }) => {
      await page.goto('/super-admin/organizations');

      // Should see organization list
      const orgTable = page.locator('table, [role="table"]');
      await expect(orgTable).toBeVisible({ timeout: 10000 });
    });

    test('Queue Management page loads', async ({ page }) => {
      await page.goto('/super-admin/queue-management');

      // Should see queue stats or table
      const queueContent = page.locator('text=Queue, text=Kuyruk');
      await expect(queueContent).toBeVisible({ timeout: 10000 });
    });
  });
});
