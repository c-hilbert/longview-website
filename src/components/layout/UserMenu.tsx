'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm hover:bg-neutral-100 rounded-md px-3 py-2"
      >
        <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-600 font-medium">
          {username[0].toUpperCase()}
        </div>
        <span className="hidden sm:inline">{username}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-md shadow-lg z-20">
            <div className="py-1">
              <Link
                href={`/u/${username}`}
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
