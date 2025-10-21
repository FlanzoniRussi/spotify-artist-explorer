import { test, expect } from '@playwright/test';

test.describe('Spotify Artists App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Spotify Artists/);
    
    const heading = page.getByRole('heading', { name: /Spotify Artists/i });
    await expect(heading).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.getByRole('button', { name: /switch to dark mode/i });
    await expect(themeToggle).toBeVisible();
    
    await themeToggle.click();
    
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'dark');
  });

  test('should change language', async ({ page }) => {
    await page.goto('/');
    
    const languageSwitcher = page.getByRole('button', { name: /change language/i });
    await expect(languageSwitcher).toBeVisible();
    
    await languageSwitcher.hover();
    
    const englishOption = page.getByText('English');
    await expect(englishOption).toBeVisible();
    
    await englishOption.click();
    
    const heading = page.getByRole('heading', { name: /Spotify Artists/i });
    await expect(heading).toBeVisible();
  });

  test('should navigate to favorites page', async ({ page }) => {
    await page.goto('/');
    
    const favoritesLink = page.getByRole('link', { name: /favorites/i });
    await expect(favoritesLink).toBeVisible();
    
    await favoritesLink.click();
    
    await expect(page).toHaveURL('/favorites');
    
    const heading = page.getByRole('heading', { name: /favorites/i });
    await expect(heading).toBeVisible();
  });

  test('should navigate to register track page', async ({ page }) => {
    await page.goto('/');
    
    const registerLink = page.getByRole('link', { name: /register/i });
    await expect(registerLink).toBeVisible();
    
    await registerLink.click();
    
    await expect(page).toHaveURL('/register-track');
    
    const heading = page.getByRole('heading');
    await expect(heading).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const mobileNav = page.locator('.md\\:hidden');
    await expect(mobileNav).toBeVisible();
    
    const themeToggle = page.getByRole('button', { name: /switch to dark mode/i });
    await expect(themeToggle).toBeVisible();
  });
});
