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

_Issue work logs will be appended below as they complete._
