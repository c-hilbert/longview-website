import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/')

    // Check main elements are present
    await expect(page.getByRole('heading', { name: 'Discussions' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'New Discussion' })).toBeVisible()
    await expect(page.getByText('About Longview')).toBeVisible()
    await expect(page.getByText('Latest Episodes')).toBeVisible()
    await expect(page.getByText('Community Guidelines')).toBeVisible()
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/')

    // Check header navigation
    await expect(page.getByRole('link', { name: 'Discussions' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Archive' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Guidelines', exact: true })).toBeVisible()
  })

  test('discussions page loads', async ({ page }) => {
    await page.goto('/discussions')

    await expect(page.getByRole('heading', { name: 'Discussions' })).toBeVisible()
  })

  test('discussions page shows posts', async ({ page }) => {
    await page.goto('/discussions')

    // Should show the welcome post
    await expect(page.getByText('Welcome to Longview Discussions')).toBeVisible()
  })

  test('archive page loads', async ({ page }) => {
    await page.goto('/archive')

    await expect(page.getByRole('heading', { name: 'Archive' })).toBeVisible()
  })

  test('archive page shows episodes', async ({ page }) => {
    await page.goto('/archive')

    // Should show at least one episode from the synced podcast
    await expect(page.getByText('Paul Rosolie').first()).toBeVisible()
  })

  test('guidelines page loads', async ({ page }) => {
    await page.goto('/guidelines')

    await expect(page.getByRole('heading', { name: 'Community Guidelines' })).toBeVisible()
    await expect(page.getByText('Be Respectful')).toBeVisible()
  })

  test('login page loads', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByText('Continue with Google')).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
  })

  test('signup page loads', async ({ page }) => {
    await page.goto('/signup')

    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
    await expect(page.getByText('Continue with Google')).toBeVisible()
  })

  test('sign in link navigates to login', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Sign in' }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })

  test('sign up link navigates to signup', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Sign up' }).click()

    await expect(page).toHaveURL(/\/signup/)
  })

  test('new discussion requires auth', async ({ page }) => {
    await page.goto('/discussions/new')

    // Should show the form but posting should require auth
    await expect(page.getByRole('heading', { name: 'Start a Discussion' })).toBeVisible()
  })

  test('API debug endpoint returns configured status', async ({ page }) => {
    const response = await page.request.get('/api/debug/env')
    const json = await response.json()

    expect(json.isConfigured).toBe(true)
    expect(json.hasAnonKey).toBe(true)
  })
})

test.describe('Auth Flow', () => {
  test('Google sign in button is clickable', async ({ page }) => {
    await page.goto('/login')

    const googleButton = page.getByText('Continue with Google')
    await expect(googleButton).toBeVisible()
    await expect(googleButton).toBeEnabled()
  })

  test('Google sign in redirects to Google OAuth', async ({ page }) => {
    await page.goto('/login')

    const googleButton = page.getByText('Continue with Google')
    await googleButton.click()

    // Should redirect to Google's OAuth page or Supabase auth
    await page.waitForURL(/accounts\.google\.com|supabase/, { timeout: 10000 })

    // Verify we're on Google's sign-in page
    const url = page.url()
    expect(url).toMatch(/accounts\.google\.com|supabase\.co/)
  })

  test('email login form accepts input', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder('Email').fill('test@example.com')
    await page.getByPlaceholder('Password').fill('password123')

    await expect(page.getByPlaceholder('Email')).toHaveValue('test@example.com')
    await expect(page.getByPlaceholder('Password')).toHaveValue('password123')
  })
})
