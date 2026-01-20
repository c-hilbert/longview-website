import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './UserMenu'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 bg-rose-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </span>
            <span className="text-lg font-semibold tracking-tight">Longview</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/discussions"
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Discussions
            </Link>
            <Link
              href="/archive"
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Archive
            </Link>
            <Link
              href="/guidelines"
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Guidelines
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
