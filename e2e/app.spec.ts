import { test, expect } from '@playwright/test';

test.describe('Spotify Artists App - Core E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test.describe('Navigation & Layout', () => {
    test('should load homepage', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Spotify Artists/);
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('should have navigation links visible', async ({ page }) => {
      await page.goto('/');
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should navigate to favorites page', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: /favoritos|favorites/i }).first().click();
      await expect(page).toHaveURL(/favorites/);
    });

    test('should navigate to dashboard page', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: /dashboard/i }).click();
      await expect(page).toHaveURL(/dashboard/);
    });

    test('should have footer', async ({ page }) => {
      await page.goto('/');
      
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      const footerText = await footer.textContent();
      expect(footerText).toContain('2025');
    });
  });

  test.describe('Theme Toggle', () => {
    test('should toggle dark mode', async ({ page }) => {
      await page.goto('/');
      const themeButton = page.getByRole('button', { name: /switch to dark mode|alternar para modo escuro/i });
      await expect(themeButton).toBeVisible();
      await themeButton.click();
      await page.waitForTimeout(300);
      const htmlElement = page.locator('html');
      const classAttr = await htmlElement.getAttribute('class');
      expect(classAttr).toContain('dark');
    });
  });

  test.describe('Dashboard', () => {
    test('should display dashboard heading', async ({ page }) => {
      await page.goto('/dashboard');
      
      const heading = page.getByRole('heading', { name: /dashboard|analytics/i });
      await expect(heading).toBeVisible();
    });

    test('should show metric cards', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForTimeout(500);
      const cards = page.locator('[class*="p-6"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Track Registration', () => {
    test('should navigate to track registration page', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: /cadastrar|register/i }).click();
      await expect(page).toHaveURL(/register-track/);
    });

    test('should display registration form', async ({ page }) => {
      await page.goto('/');
      
      // Navigate to registration page by clicking link
      await page.getByRole('link', { name: /cadastrar|register/i }).click();
      await page.waitForTimeout(800);
      await expect(page).toHaveURL(/register-track/);
      const formHeading = page.getByRole('heading', { name: /cadastrar|register/i });
      await expect(formHeading).toBeVisible();
    });
  });

  test.describe('Responsive', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      const header = page.locator('header');
      await expect(header).toBeVisible();

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
    });

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have heading hierarchy', async ({ page }) => {
      await page.goto('/');
      
      const h1 = page.locator('h1');
      expect(await h1.count()).toBeGreaterThan(0);
    });

    test('should have clickable buttons', async ({ page }) => {
      await page.goto('/');
      
      const buttons = page.getByRole('button');
      expect(await buttons.count()).toBeGreaterThan(0);
    });
  });
});
