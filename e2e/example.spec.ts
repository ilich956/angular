import { test, expect } from '@playwright/test';

/**
 * E2E Tests
 * Tests user scenarios end-to-end
 */
test.describe('ProjectFlow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('should display dashboard', async ({ page }) => {
    await expect(page.locator('.dashboard h1')).toContainText('Dashboard');
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.click('text=Projects');
    await expect(page).toHaveURL(/.*projects/);
    await expect(page.locator('h1')).toContainText('Projects');
  });

  test('should navigate to tasks page', async ({ page }) => {
    await page.click('text=Tasks');
    await expect(page).toHaveURL(/.*tasks/);
    await expect(page.locator('h1')).toContainText('Tasks');
  });

  test('should navigate to team page', async ({ page }) => {
    await page.click('text=Team');
    await expect(page).toHaveURL(/.*team/);
    await expect(page.locator('h1')).toContainText('Team');
  });

  test('should navigate to analytics page', async ({ page }) => {
    await page.click('text=Analytics');
    await expect(page).toHaveURL(/.*analytics/);
    await expect(page.locator('h1')).toContainText('Analytics');
  });

  test('should load projects on projects page', async ({ page }) => {
    await page.click('text=Projects');
    // Wait for projects to load
    await page.waitForSelector('.project-card', { timeout: 5000 });
    const projects = await page.locator('.project-card').count();
    expect(projects).toBeGreaterThan(0);
  });

  test('should display app name in navigation', async ({ page }) => {
    await expect(page.locator('.logo')).toContainText('ProjectFlow');
  });
});
