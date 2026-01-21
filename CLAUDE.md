# Claude Code Instructions

## CRITICAL: Git Workflow Rules

**NEVER commit directly to main. ZERO exceptions.**

### Required Workflow:
1. Create a feature branch: `git checkout -b feature/description` or `fix/description`
2. Make changes and commit to the feature branch
3. Run ALL tests before considering a merge:
   - `npm test` (unit tests - must pass)
   - `npm run test:e2e` (e2e tests - must pass)
   - `npm run build` (build must succeed)
4. Only merge to main after ALL tests pass
5. Push the feature branch, create PR if needed, then merge

### Branch Naming:
- `feature/` - new features
- `fix/` - bug fixes
- `test/` - test additions
- `refactor/` - code refactoring

## Testing Requirements

Before any merge to main:
- [ ] All unit tests pass (`npm test`)
- [ ] All e2e tests pass (`npm run test:e2e`)
- [ ] Build succeeds (`npm run build`)

## Environment

- Supabase project: `nxnzmzojrjshlfeqionh`
- Production URL: https://longview-website.vercel.app
- Supabase CLI is linked and authenticated

## Key Commands

```bash
# Development
npm run dev          # Start dev server

# Testing
npm test             # Unit tests
npm run test:e2e     # E2E tests against production
npm run build        # Production build

# Supabase (requires SUPABASE_ACCESS_TOKEN in env)
supabase db push --linked    # Push migrations
supabase migration list      # List migrations
```
