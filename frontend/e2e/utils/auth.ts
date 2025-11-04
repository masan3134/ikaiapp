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
