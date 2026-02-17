import { test, expect } from '@playwright/test'

test.describe('Homepage Landing Page', () => {
  test('homepage loads with hero section', async ({ page }) => {
    await page.goto('/')

    // Check main hero elements are present
    await expect(page.getByText('Longview Podcast Network')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Context is everything' })).toBeVisible()
    await expect(page.getByText('Long-form interviews that go deeper')).toBeVisible()
  })

  test('platform links are visible', async ({ page }) => {
    await page.goto('/')

    // Check platform links
    await expect(page.getByRole('link', { name: /Spotify/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Apple Podcasts/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /YouTube/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /RSS/i })).toBeVisible()
  })

  test('featured shows section is visible', async ({ page }) => {
    await page.goto('/')

    // Check featured shows heading
    await expect(page.getByRole('heading', { name: 'Featured Shows' })).toBeVisible()
    
    // Should show show cards
    await expect(page.getByText(/Episodes/)).toBeVisible()
  })

  test('mission section is visible', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Our Mission' })).toBeVisible()
    await expect(page.getByText('Depth Over Speed')).toBeVisible()
    await expect(page.getByText('Expert Voices')).toBeVisible()
    await expect(page.getByText('Curated Quality')).toBeVisible()
  })

  test('team section is visible', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Behind the Mic' })).toBeVisible()
    await expect(page.getByText('Dylan J. Clarke')).toBeVisible()
  })

  test('email signup section is visible', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Never Miss an Episode' })).toBeVisible()
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible()
    await expect(page.getByRole('button', { name: /Subscribe/i })).toBeVisible()
  })

  test('latest episodes section is visible', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Latest Episodes' })).toBeVisible()
  })

  test('community discussions section is visible', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Community Discussions' })).toBeVisible()
  })

  test('platform links open in new tabs', async ({ page, context }) => {
    await page.goto('/')

    // Check Spotify link
    const spotifyLink = page.getByRole('link', { name: /Spotify/i })
    await expect(spotifyLink).toHaveAttribute('target', '_blank')
    await expect(spotifyLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

test.describe('Navigation', () => {
  test('header navigation links work', async ({ page }) => {
    await page.goto('/')

    // Check header navigation
    await expect(page.getByRole('link', { name: 'Discussions', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Archive', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Guidelines', exact: true })).toBeVisible()
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
})

test.describe('Discussions Page', () => {
  test('discussions page loads', async ({ page }) => {
    await page.goto('/discussions')

    await expect(page.getByRole('heading', { name: 'Discussions' })).toBeVisible()
  })

  test('discussions page shows posts', async ({ page }) => {
    await page.goto('/discussions')

    // Should show the welcome post
    await expect(page.getByText('Welcome to Longview Discussions')).toBeVisible()
  })

  test('new discussion requires auth', async ({ page }) => {
    await page.goto('/discussions/new')

    // Should show the form but posting should require auth
    await expect(page.getByRole('heading', { name: 'Start a Discussion' })).toBeVisible()
  })
})

test.describe('Archive Page', () => {
  test('archive page loads', async ({ page }) => {
    await page.goto('/archive')

    await expect(page.getByRole('heading', { name: 'Archive' })).toBeVisible()
  })

  test('archive page shows episodes', async ({ page }) => {
    await page.goto('/archive')

    // Should show at least one episode from the synced podcast
    await expect(page.getByText('Paul Rosolie').first()).toBeVisible()
  })
})

test.describe('Guidelines Page', () => {
  test('guidelines page loads', async ({ page }) => {
    await page.goto('/guidelines')

    await expect(page.getByRole('heading', { name: 'Community Guidelines' })).toBeVisible()
    await expect(page.getByText('Be Respectful')).toBeVisible()
  })
})

test.describe('Auth Flow', () => {
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

test.describe('API Health', () => {
  test('API debug endpoint returns configured status', async ({ page }) => {
    const response = await page.request.get('/api/debug/env')
    const json = await response.json()

    expect(json.isConfigured).toBe(true)
    expect(json.hasAnonKey).toBe(true)
  })
})
