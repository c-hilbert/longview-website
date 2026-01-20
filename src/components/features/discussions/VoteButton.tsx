'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { createClient } from '@/lib/supabase/client'

interface VoteButtonProps {
  postId?: string
  commentId?: string
  initialCount: number
}

export function VoteButton({ postId, commentId, initialCount }: VoteButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkVote() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const query = supabase.from('votes').select('id')
      if (postId) query.eq('post_id', postId)
      if (commentId) query.eq('comment_id', commentId)
      query.eq('user_id', user.id)

      const { data } = await query.single()
      setHasVoted(!!data)
    }
    checkVote()
  }, [postId, commentId, supabase])

  const handleVote = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setIsLoading(true)

    if (hasVoted) {
      // Remove vote - optimistic update
      setCount(count - 1)
      setHasVoted(false)

      const query = supabase.from('votes').delete()
      if (postId) query.eq('post_id', postId)
      if (commentId) query.eq('comment_id', commentId)
      query.eq('user_id', user.id)

      const { error } = await query

      if (error) {
        // Revert on error
        setCount(count)
        setHasVoted(true)
      }
    } else {
      // Add vote - optimistic update
      setCount(count + 1)
      setHasVoted(true)

      const { error } = await supabase.from('votes').insert({
        user_id: user.id,
        post_id: postId || null,
        comment_id: commentId || null,
      })

      if (error) {
        // Revert on error
        setCount(count)
        setHasVoted(false)
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleVote}
        disabled={isLoading}
        className={clsx(
          'p-1 rounded transition-colors',
          hasVoted ? 'text-red-600' : 'text-neutral-400 hover:text-neutral-600'
        )}
      >
        <svg className="w-5 h-5" fill={hasVoted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <span className={clsx('text-lg font-medium', hasVoted && 'text-red-600')}>
        {count}
      </span>
    </div>
  )
}
