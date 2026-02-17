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
        className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-[var(--radius-md)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
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
        <div className="absolute top-16 left-0 right-0 bg-[var(--bg-elevated)] border-b border-[var(--border-light)] shadow-[var(--shadow-lg)] animate-fade-in">
          <nav className="flex flex-col p-4 space-y-1 max-w-5xl mx-auto">
            <Link
              href="/discussions"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-[var(--radius-md)] font-medium transition-colors duration-150"
            >
              Discussions
            </Link>
            <Link
              href="/archive"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-[var(--radius-md)] font-medium transition-colors duration-150"
            >
              Archive
            </Link>
            <Link
              href="/guidelines"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-[var(--radius-md)] font-medium transition-colors duration-150"
            >
              Guidelines
            </Link>
            {!isLoggedIn && (
              <>
                <div className="border-t border-[var(--border-light)] my-2" />
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-[var(--radius-md)] font-medium transition-colors duration-150"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 bg-[var(--ink-black)] text-[var(--bg-primary)] text-center rounded-[var(--radius-md)] font-medium hover:bg-[var(--text-secondary)] transition-colors duration-200"
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
