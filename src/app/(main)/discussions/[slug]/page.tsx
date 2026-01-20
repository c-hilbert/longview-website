import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { VoteButton } from '@/components/features/discussions/VoteButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      body,
      slug,
      upvote_count,
      comment_count,
      created_at,
      author:profiles!posts_author_id_fkey(username),
      series:series(name, slug)
    `)
    .eq('slug', slug)
    .single()

  if (error || !post) {
    notFound()
  }

  const author = Array.isArray(post.author) ? post.author[0] : post.author
  const series = Array.isArray(post.series) ? post.series[0] : post.series

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <div className="flex gap-4">
          <VoteButton postId={post.id} initialCount={post.upvote_count} />

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold mb-2">{post.title}</h1>

            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
              {series && (
                <>
                  <Link
                    href={`/series/${series.slug}`}
                    className="text-red-600 hover:underline"
                  >
                    {series.name}
                  </Link>
                  <span>·</span>
                </>
              )}
              <Link href={`/u/${author?.username}`} className="hover:underline">
                {author?.username}
              </Link>
              <span>·</span>
              <span>
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>

            <div className="prose prose-neutral max-w-none">
              <p className="whitespace-pre-wrap">{post.body}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">
          {post.comment_count} {post.comment_count === 1 ? 'Comment' : 'Comments'}
        </h2>

        <Card>
          <p className="text-neutral-500 text-center py-4">
            No comments yet. Be the first to share your thoughts.
          </p>
        </Card>
      </div>
    </div>
  )
}
