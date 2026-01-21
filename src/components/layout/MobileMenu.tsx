'use client'

import { useState } from 'react'
import Link from 'next/link'

interface MobileMenuProps {
  isLoggedIn: boolean
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-stone-600 hover:text-stone-900"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-stone-200 shadow-lg">
          <nav className="flex flex-col p-4 space-y-1">
            <Link
              href="/discussions"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-stone-700 hover:bg-stone-50 rounded-lg"
            >
              Discussions
            </Link>
            <Link
              href="/archive"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-stone-700 hover:bg-stone-50 rounded-lg"
            >
              Archive
            </Link>
            <Link
              href="/guidelines"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-stone-700 hover:bg-stone-50 rounded-lg"
            >
              Guidelines
            </Link>
            {!isLoggedIn && (
              <>
                <div className="border-t border-stone-200 my-2" />
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-stone-700 hover:bg-stone-50 rounded-lg"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 bg-stone-900 text-white text-center rounded-lg hover:bg-stone-800"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
