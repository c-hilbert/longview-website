'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { VoteButton } from './VoteButton'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

interface Comment {
  id: string
  body: string
  upvote_count: number
  created_at: string
  depth: number
  author: { username: string }
  replies: Comment[]
}

interface CommentItemProps {
  comment: Comment
  postId: string
  onReply: () => void
}

function CommentItem({ comment, postId, onReply }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return

    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to reply')
      setIsSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from('comments').insert({
      body: replyText,
      post_id: postId,
      parent_id: comment.id,
      author_id: user.id,
      depth: comment.depth + 1,
      path: [],
    })

    if (insertError) {
      setError('Failed to post reply')
      setIsSubmitting(false)
      return
    }

    setReplyText('')
    setIsReplying(false)
    setIsSubmitting(false)
    onReply()
  }

  return (
    <div className={comment.depth > 0 ? 'ml-8 border-l-2 border-stone-200 pl-4' : ''}>
      <div className="flex gap-3 py-4">
        <VoteButton commentId={comment.id} initialCount={comment.upvote_count} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
            <Link href={`/u/${comment.author?.username}`} className="font-medium text-stone-900 hover:underline">
              {comment.author?.username}
            </Link>
            <span>·</span>
            <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
          </div>

          <p className="text-stone-800 whitespace-pre-wrap">{comment.body}</p>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="mt-2 text-sm text-stone-500 hover:text-stone-700"
          >
            Reply
          </button>

          {isReplying && (
            <div className="mt-3 space-y-2">
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSubmitReply} disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Reply'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} onReply={onReply} />
      ))}
    </div>
  )
}

export function CommentThread({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('comments')
      .select(`
        id, body, upvote_count, created_at, depth, parent_id,
        author:profiles!comments_author_id_fkey(username)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (data) {
      // Build nested comment tree from flat list
      const commentMap = new Map<string, Comment>()
      const rootComments: Comment[] = []

      data.forEach((c) => {
        commentMap.set(c.id, {
          ...c,
          author: Array.isArray(c.author) ? c.author[0] : c.author,
          replies: [],
        })
      })

      data.forEach((c) => {
        const comment = commentMap.get(c.id)!
        if (c.parent_id && commentMap.has(c.parent_id)) {
          commentMap.get(c.parent_id)!.replies.push(comment)
        } else {
          rootComments.push(comment)
        }
      })

      setComments(rootComments)
    }
    setIsLoading(false)
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to comment')
      setIsSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from('comments').insert({
      body: newComment,
      post_id: postId,
      author_id: user.id,
      depth: 0,
      path: [],
    })

    if (insertError) {
      setError('Failed to post comment')
      setIsSubmitting(false)
      return
    }

    setNewComment('')
    setIsSubmitting(false)
    fetchComments()
  }

  if (isLoading) {
    return <div className="text-center py-4 text-stone-500">Loading comments...</div>
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={handleSubmitComment} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>

      {comments.length === 0 ? (
        <p className="text-stone-500 text-center py-4">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="divide-y divide-stone-200">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} onReply={fetchComments} />
          ))}
        </div>
      )}
    </div>
  )
}
