import { test, expect } from '@playwright/test';

test.describe('The Last Deadline - smoke tests', () => {
  test('app loads without crashing', async ({ page }) => {
    await page.goto('/');
    // The root element should have rendered content
    const root = page.locator('#root');
    await expect(root).not.toBeEmpty();
  });

  test('page has a title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/./); // any non-empty title
  });

  test('no severe console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });
});
