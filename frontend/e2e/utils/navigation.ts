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
