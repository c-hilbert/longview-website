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
        className="p-1 text-stone-400 hover:text-stone-600 rounded"
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
        <div className="absolute right-0 mt-1 w-36 bg-white border border-stone-200 rounded-md shadow-lg z-10">
          <button
            onClick={handleLockToggle}
            disabled={isLoading}
            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 disabled:opacity-50"
          >
            {isLocked ? 'Unlock Post' : 'Lock Post'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete Post
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-stone-200 rounded-md shadow-lg z-10 p-3">
          <p className="text-sm text-stone-700 mb-3">
            Are you sure? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCancelDelete}
              className="flex-1 px-2 py-1 text-sm border border-stone-300 rounded hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
