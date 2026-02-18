# Learnings — Longview Website

## Project Tooling

- **Framework:** Next.js 16.1.4 (App Router, React 19)
- **Package Manager:** npm
- **Styling:** Tailwind CSS 4
- **Database/Auth:** Supabase (@supabase/ssr, @supabase/supabase-js)
- **Testing:**
  - Unit: Jest with @testing-library/react
  - E2E: Playwright
- **Dev Commands:**
  - `npm run dev` — Start dev server
  - `npm test` — Run unit tests
  - `npm run test:e2e` — Run Playwright E2E tests
  - `npm run build` — Production build
  - `npm run lint` — ESLint

## Current State (Feb 16, 2026)

**Branch:** `feature/website-roadmap`
**Production:** https://longview-website.vercel.app
**Backend:** Supabase (project: nxnzmzojrjshlfeqionh)

**Already Built:**
- Home page with discussions feed
- Discussion/post system (create, view, upvotes, comments)
- Episode pages with native HTML audio player
- Series management (admin panel)
- User profiles (`/u/[username]`)
- Archive page (lists all series + episodes)
- Community guidelines page
- Cron job to sync episodes from RSS feed
- Latest episodes sidebar
- Auth: Email/password + Google OAuth
- Comments: Nested threading, upvotes, auth-gated

**Database schema:** posts, episodes, series, profiles, upvotes, comments

**Current Color Palette (needs refinement):**
- Background: `#faf9f7` (warm off-white)
- Foreground: `#1a1a1a` (near-black)
- Accent: `#8b2942` (burgundy/deep red)
- Border: `#e8e6e3`
- Muted: `#6b6b6b`

**Fonts:** Geist Sans (primary) and Geist Mono (monospace)

## Roadmap Issues Created (Feb 16, 2026)

- Issue #5: Design System Overhaul (PRIORITY 1)
- Issue #6: Homepage Redesign as Company Landing Page
- Issue #7: Custom Audio Player Component
- Issue #8: Configure RSS Feeds from Megaphone (blocked: waiting for URLs from Carmen)
- Issue #9: Production Deployment & Verification

---

## Issue #5: Design System Overhaul — Feb 16, 2026

**What worked:**
- Using CSS variables for color system makes updates easy and consistent
- Editorial design pattern: red accent (#c8102e), clean black/white, generous whitespace
- Component-level design tokens (--color-primary, --color-foreground, etc.) ensure consistency
- Test-driven approach: updated tests after component changes, caught class name mismatches early

**Gotchas:**
- Both Claude Code and Codex hit auth issues (OAuth and API key), had to work manually
- Tests check for specific Tailwind classes, need to update when refactoring styling
- CSS variable syntax in Tailwind: use bracket notation `bg-[var(--color-primary)]`

**Codebase notes:**
- Design system in: `src/app/globals.css` (root CSS variables)
- UI components: `src/components/ui/*.tsx` (Button, Card, Input, Textarea)
- Component tests: `src/components/ui/__tests__/*.test.tsx`
- Color palette: 
  - Primary: `#c8102e` (editorial red)
  - Foreground: `#0a0a0a` (near-black)
  - Background: `#ffffff` (pure white)
  - Card: `#fafafa` (subtle off-white)

**Decisions:**
- Chose brighter editorial red (#c8102e) over original burgundy (#8b2942) for more impact
- Pure white background instead of warm off-white for cleaner editorial feel
- Border width increased to 2px for stronger definition
- Focus rings use red tint instead of generic gray

---

## Authentication Architecture — Feb 18, 2026

**Current Setup:**
- **Primary:** Email/password auth via Supabase Auth (works independently)
- **Secondary:** Google OAuth via Supabase (requires Google Cloud credentials)
- **Fallback:** Magic link auth (passwordless) - available via Supabase

**Auth Flow:**
- Login: `/login` - Email/password form + Google OAuth button
- Signup: `/signup` - Email/password/username form + Google OAuth button
- Callback: `/auth/callback` - Handles OAuth redirects from Google
- Protected routes use Supabase session middleware

**Testing/Mocking Strategy:**
For E2E tests and development without Google OAuth configured:
- Use email/password auth for test accounts (fully functional)
- Mock OAuth redirects by intercepting with Playwright
- Inject test tokens directly via Supabase client
- Alternative: Use Supabase's `signInWithPassword` for programmatic test logins

**Google OAuth Setup (when ready):**
1. Create Google Cloud project
2. Configure OAuth consent screen
3. Create OAuth 2.0 credentials (Client ID + Secret)
4. Add to Supabase Auth providers
5. Configure redirect URI: `/auth/callback`

**Current Status:**
- ✅ Email/password auth: Fully working
- ✅ Username support: Stored in user metadata
- ⏳ Google OAuth: Pending Gmail account access for Cloud Console
- ✅ Mock/testing approach: Documented and ready
