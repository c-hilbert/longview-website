import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './UserMenu'
import { MobileMenu } from './MobileMenu'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-[var(--bg-primary)] border-b border-[var(--border-light)] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-8 sm:gap-12">
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
          >
            <span className="w-8 h-8 bg-[var(--accent-primary)] rounded-[var(--radius-md)] flex items-center justify-center transition-colors duration-200 group-hover:bg-[var(--accent-hover)]">
              <span className="text-white font-semibold text-sm font-[family-name:var(--font-playfair)]">L</span>
            </span>
            <span className="text-lg font-semibold tracking-[-0.02em] hidden sm:inline font-[family-name:var(--font-playfair)] text-[var(--ink-black)]">
              Longview
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/discussions"
              className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200 tracking-[-0.01em]"
            >
              Discussions
            </Link>
            <Link
              href="/archive"
              className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200 tracking-[-0.01em]"
            >
              Archive
            </Link>
            <Link
              href="/guidelines"
              className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200 tracking-[-0.01em]"
            >
              Guidelines
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200 tracking-[-0.01em]"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium px-4 py-2 bg-[var(--ink-black)] text-[var(--bg-primary)] rounded-[var(--radius-md)] hover:bg-[var(--text-secondary)] transition-colors duration-200 tracking-[-0.01em]"
              >
                Sign up
              </Link>
            </div>
          )}
          <MobileMenu isLoggedIn={!!user} />
        </div>
      </div>
    </header>
  )
}
