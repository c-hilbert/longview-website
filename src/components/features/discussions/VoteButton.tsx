'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const checkVote = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let query = supabase.from('votes').select('id').eq('user_id', user.id)
    if (postId) query = query.eq('post_id', postId)
    if (commentId) query = query.eq('comment_id', commentId)

    const { data } = await query.maybeSingle()
    setHasVoted(!!data)
  }, [postId, commentId])

  useEffect(() => {
    checkVote()
  }, [checkVote])

  const handleVote = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || isLoading) return

    setIsLoading(true)
    const previousCount = count
    const previousVoted = hasVoted

    if (hasVoted) {
      // Optimistic update: remove vote
      setCount(count - 1)
      setHasVoted(false)

      let query = supabase.from('votes').delete().eq('user_id', user.id)
      if (postId) query = query.eq('post_id', postId)
      if (commentId) query = query.eq('comment_id', commentId)

      const { error } = await query
      if (error) {
        setCount(previousCount)
        setHasVoted(previousVoted)
      }
    } else {
      // Optimistic update: add vote
      setCount(count + 1)
      setHasVoted(true)

      const { error } = await supabase.from('votes').insert({
        user_id: user.id,
        post_id: postId || null,
        comment_id: commentId || null,
      })

      if (error) {
        setCount(previousCount)
        setHasVoted(previousVoted)
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="flex flex-col items-center gap-1 min-w-[40px]">
      <button
        onClick={handleVote}
        disabled={isLoading}
        className={clsx(
          'p-1 rounded transition-colors',
          hasVoted ? 'text-rose-600' : 'text-stone-400 hover:text-stone-600'
        )}
      >
        <svg className="w-5 h-5" fill={hasVoted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <span className={clsx('text-lg font-medium', hasVoted && 'text-rose-600')}>
        {count}
      </span>
    </div>
  )
}
