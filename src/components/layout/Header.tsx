import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './UserMenu'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-semibold">
            Longview
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/discussions" className="text-sm text-neutral-600 hover:text-neutral-900">
              Discussions
            </Link>
            <Link href="/archive" className="text-sm text-neutral-600 hover:text-neutral-900">
              Archive
            </Link>
            <Link href="/guidelines" className="text-sm text-neutral-600 hover:text-neutral-900">
              Guidelines
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
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
