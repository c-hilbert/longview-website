import { test, expect } from '@playwright/test'

test('trace Google OAuth redirect from SIGNUP page', async ({ page }) => {
  // Go to SIGNUP page (not login)
  await page.goto('/signup')

  // Get the Google button
  const googleButton = page.getByText('Continue with Google')
  await expect(googleButton).toBeVisible()

  console.log('=== Before clicking Google button on /signup ===')
  console.log('Current URL:', page.url())

  // Capture the navigation before clicking
  const navigationPromise = page.waitForURL(/accounts\.google\.com|supabase/, { timeout: 15000 })

  await googleButton.click()

  // Wait for navigation to complete
  await navigationPromise

  // Now we're on Google or Supabase - capture the full URL
  const oauthUrl = page.url()
  console.log('\n========== SIGNUP PAGE OAUTH REDIRECT URL ==========')
  console.log(oauthUrl)

  // The redirect should work just like login
  expect(oauthUrl).toMatch(/accounts\.google\.com|supabase\.co/)
})
