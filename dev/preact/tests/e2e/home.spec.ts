import { test, expect } from '@playwright/test'

test.describe('Main page', () => {
  test('should load and render the home page', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/')

    // Check that the page title contains expected content
    await expect(page).toHaveTitle(/Vite \+ Preact/)

    // Check that the main app div exists
    await expect(page.locator('#app')).toBeVisible()

    // Check that the main content area exists
    await expect(page.locator('main')).toBeVisible()

    // Check that the home page specific content is rendered
    await expect(page.locator('.home')).toBeVisible()

    // Verify the welcome message is present
    await expect(page.locator('h1')).toContainText('Welcome to Nosto')

    // Verify the description text is present
    await expect(page.locator('p')).toContainText('Discover our powerful search and discovery features')
  })
})