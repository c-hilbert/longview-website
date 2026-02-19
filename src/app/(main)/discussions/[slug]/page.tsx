import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { VoteButton } from '@/components/features/discussions/VoteButton'
import { CommentThread } from '@/components/features/discussions/CommentThread'

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
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <div className="flex gap-5">
          <VoteButton postId={post.id} initialCount={post.upvote_count} />

          <div className="flex-1 min-w-0">
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-semibold text-[var(--ink-black)] mb-3 tracking-[-0.02em] leading-[var(--leading-tight)]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)] mb-6 font-[family-name:var(--font-inter)]">
              {series && (
                <>
                  <Link
                    href={`/archive`}
                    className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-medium transition-colors duration-150"
                  >
                    {series.name}
                  </Link>
                  <span className="text-[var(--border-dark)]">·</span>
                </>
              )}
              <Link 
                href={`/u/${author?.username}`} 
                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-150"
              >
                {author?.username}
              </Link>
              <span className="text-[var(--border-dark)]">·</span>
              <time dateTime={post.created_at}>
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </time>
            </div>

            <div className="prose-editorial text-[var(--text-secondary)]">
              <p className="whitespace-pre-wrap leading-[var(--leading-relaxed)] font-[family-name:var(--font-inter)]">
                {post.body}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)] mb-4 tracking-[-0.01em]">
          Comments
        </h2>
        <Card>
          <CommentThread postId={post.id} />
        </Card>
      </section>
    </div>
  )
}
