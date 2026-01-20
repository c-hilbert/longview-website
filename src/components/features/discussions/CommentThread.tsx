'use client'

import { useState, useEffect } from 'react'
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
  author: {
    username: string
  }
  replies: Comment[]
}

interface CommentThreadProps {
  postId: string
}

function CommentItem({ comment, postId, onReply }: { comment: Comment; postId: string; onReply: () => void }) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return

    setIsSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setIsSubmitting(false)
      return
    }

    await supabase.from('comments').insert({
      body: replyText,
      post_id: postId,
      parent_id: comment.id,
      author_id: user.id,
      depth: comment.depth + 1,
      path: [], // Will be updated by trigger
    })

    setReplyText('')
    setIsReplying(false)
    setIsSubmitting(false)
    onReply()
  }

  return (
    <div className={`${comment.depth > 0 ? 'ml-8 border-l-2 border-neutral-200 pl-4' : ''}`}>
      <div className="flex gap-3 py-4">
        <VoteButton commentId={comment.id} initialCount={comment.upvote_count} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
            <Link href={`/u/${comment.author?.username}`} className="font-medium text-neutral-900 hover:underline">
              {comment.author?.username}
            </Link>
            <span>·</span>
            <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
          </div>

          <p className="text-neutral-800 whitespace-pre-wrap">{comment.body}</p>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="mt-2 text-sm text-neutral-500 hover:text-neutral-700"
          >
            Reply
          </button>

          {isReplying && (
            <div className="mt-3 space-y-2">
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

export function CommentThread({ postId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select(`
        id,
        body,
        upvote_count,
        created_at,
        depth,
        parent_id,
        author:profiles!comments_author_id_fkey(username)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (data) {
      // Build nested structure
      const commentMap = new Map<string, Comment>()
      const rootComments: Comment[] = []

      data.forEach((c) => {
        const comment: Comment = {
          ...c,
          author: Array.isArray(c.author) ? c.author[0] : c.author,
          replies: [],
        }
        commentMap.set(c.id, comment)
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
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setIsSubmitting(false)
      return
    }

    await supabase.from('comments').insert({
      body: newComment,
      post_id: postId,
      author_id: user.id,
      depth: 0,
      path: [],
    })

    setNewComment('')
    setIsSubmitting(false)
    fetchComments()
  }

  if (isLoading) {
    return <div className="text-center py-4 text-neutral-500">Loading comments...</div>
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
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
        <p className="text-neutral-500 text-center py-4">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="divide-y divide-neutral-200">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} onReply={fetchComments} />
          ))}
        </div>
      )}
    </div>
  )
}
