import { test, expect } from '@playwright/test'

test.describe('Auth Flow Debug', () => {
  test('document full auth state', async ({ page }) => {
    // Step 1: Check initial state on homepage
    console.log('=== Step 1: Homepage initial state ===')
    await page.goto('/')

    const signInLink = page.getByRole('link', { name: 'Sign in' })
    const signUpLink = page.getByRole('link', { name: 'Sign up' })

    const hasSignIn = await signInLink.isVisible().catch(() => false)
    const hasSignUp = await signUpLink.isVisible().catch(() => false)

    console.log(`Sign in link visible: ${hasSignIn}`)
    console.log(`Sign up link visible: ${hasSignUp}`)

    // Take screenshot
    await page.screenshot({ path: 'test-results/auth-debug-1-homepage.png' })

    // Step 2: Check auth debug endpoint
    console.log('\n=== Step 2: Auth debug endpoint ===')
    const authResponse = await page.request.get('/api/debug/auth')
    const authData = await authResponse.json()
    console.log('Auth state:', JSON.stringify(authData, null, 2))

    // Step 3: Go to login page
    console.log('\n=== Step 3: Login page ===')
    await page.goto('/login')
    await page.screenshot({ path: 'test-results/auth-debug-2-login.png' })

    const googleButton = page.getByText('Continue with Google')
    const googleButtonVisible = await googleButton.isVisible()
    console.log(`Google button visible: ${googleButtonVisible}`)

    // Step 4: Click Google button and capture redirect URL
    console.log('\n=== Step 4: Google OAuth redirect ===')

    // Listen for the redirect
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('supabase') || resp.url().includes('google')),
      googleButton.click()
    ]).catch(() => [null])

    // Wait a moment for redirect
    await page.waitForTimeout(2000)

    const currentUrl = page.url()
    console.log(`Redirected to: ${currentUrl}`)
    await page.screenshot({ path: 'test-results/auth-debug-3-after-google-click.png' })

    // Step 5: Check if we're on Google or Supabase auth page
    if (currentUrl.includes('accounts.google.com')) {
      console.log('Successfully redirected to Google OAuth')
      console.log('URL contains client_id:', currentUrl.includes('client_id'))
      console.log('URL contains redirect_uri:', currentUrl.includes('redirect_uri'))

      // Extract redirect_uri to see where Google will send us back
      const urlParams = new URL(currentUrl)
      const redirectUri = urlParams.searchParams.get('redirect_uri')
      console.log(`Redirect URI: ${redirectUri}`)
    } else if (currentUrl.includes('supabase.co')) {
      console.log('Redirected to Supabase auth')
    } else {
      console.log('Unexpected redirect location')
    }
  })

  test('check discussions/new page auth state', async ({ page }) => {
    console.log('=== Checking /discussions/new without auth ===')

    await page.goto('/discussions/new')
    await page.waitForTimeout(1000)

    await page.screenshot({ path: 'test-results/auth-debug-4-new-discussion.png' })

    // Check if error message is visible
    const errorMessage = page.getByText('You must be logged in')
    const hasError = await errorMessage.isVisible().catch(() => false)
    console.log(`"Must be logged in" error visible: ${hasError}`)

    // Check auth state from this page
    const authResponse = await page.request.get('/api/debug/auth')
    const authData = await authResponse.json()
    console.log('Auth state on /discussions/new:', JSON.stringify(authData, null, 2))
  })

  test('simulate callback and check result', async ({ page }) => {
    console.log('=== Testing callback behavior ===')

    // Try hitting the callback without a code (should redirect to login with error)
    await page.goto('/auth/callback')
    await page.waitForTimeout(1000)

    const currentUrl = page.url()
    console.log(`Callback without code redirects to: ${currentUrl}`)
    await page.screenshot({ path: 'test-results/auth-debug-5-callback-no-code.png' })
  })
})
