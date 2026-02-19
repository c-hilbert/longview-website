'use client'

import { useState } from 'react'

interface ModerationMenuProps {
  postId: string
  isLocked: boolean
  onAction?: () => void
}

export function ModerationMenu({ postId, isLocked, onAction }: ModerationMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLockToggle = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked: !isLocked }),
      })

      if (response.ok) {
        onAction?.()
      }
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onAction?.()
      }
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
      setIsOpen(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-[var(--radius-md)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        aria-label="Moderation options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>

      {isOpen && !showDeleteConfirm && (
        <div className="absolute right-0 mt-1 w-40 bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] z-10 py-1 animate-fade-in">
          <button
            onClick={handleLockToggle}
            disabled={isLoading}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 transition-colors duration-150 font-[family-name:var(--font-inter)]"
          >
            {isLocked ? 'Unlock Post' : 'Lock Post'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors duration-150 font-[family-name:var(--font-inter)]"
          >
            Delete Post
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="absolute right-0 mt-1 w-56 bg-[var(--bg-elevated)] border border-[var(--border-light)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] z-10 p-4 animate-fade-in">
          <p className="text-sm text-[var(--text-secondary)] mb-4 font-[family-name:var(--font-inter)]">
            Are you sure? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCancelDelete}
              className="flex-1 px-3 py-2 text-sm font-medium border border-[var(--border-medium)] rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors duration-150 font-[family-name:var(--font-inter)]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm font-medium bg-rose-600 text-white rounded-[var(--radius-md)] hover:bg-rose-700 disabled:opacity-50 transition-colors duration-150 font-[family-name:var(--font-inter)]"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
