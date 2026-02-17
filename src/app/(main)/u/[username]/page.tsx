import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, username, karma_posts, karma_comments, role, created_at')
    .eq('username', username)
    .single()

  if (error || !profile) {
    notFound()
  }

  const totalKarma = (profile.karma_posts || 0) + (profile.karma_comments || 0)

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, upvote_count, comment_count, created_at')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: comments } = await supabase
    .from('comments')
    .select(`
      id,
      body,
      upvote_count,
      created_at,
      post:posts(title, slug)
    `)
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center text-2xl font-semibold text-[var(--text-secondary)] font-[family-name:var(--font-playfair)]">
              {profile.username[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold flex items-center gap-2 text-[var(--ink-black)]">
                {profile.username}
                {profile.role === 'staff' && (
                  <span className="px-2 py-0.5 bg-[var(--accent-subtle)] text-[var(--accent-primary)] text-xs font-semibold rounded-[var(--radius-sm)] font-[family-name:var(--font-inter)]">
                    Staff
                  </span>
                )}
              </h1>
              <p className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-inter)]">
                Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-semibold font-[family-name:var(--font-playfair)] text-[var(--ink-black)]">
              {totalKarma}
            </div>
            <div className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
              karma
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]">
            <div className="text-xl font-semibold font-[family-name:var(--font-playfair)] text-[var(--ink-black)]">
              {profile.karma_posts || 0}
            </div>
            <div className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
              post karma
            </div>
          </div>
          <div className="p-4 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]">
            <div className="text-xl font-semibold font-[family-name:var(--font-playfair)] text-[var(--ink-black)]">
              {profile.karma_comments || 0}
            </div>
            <div className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
              comment karma
            </div>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)] mb-4 pb-2 border-b border-[var(--border-light)]">
          Recent Posts
        </h2>
        <Card padding="none" className="overflow-hidden">
          {posts && posts.length > 0 ? (
            <div className="divide-y divide-[var(--border-light)]">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/discussions/${post.slug}`}
                  className="block p-4 hover:bg-[var(--bg-secondary)]/50 transition-colors duration-150"
                >
                  <h3 className="font-[family-name:var(--font-source-serif)] font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-150">
                    {post.title}
                  </h3>
                  <div className="text-sm text-[var(--text-muted)] mt-1.5 font-[family-name:var(--font-inter)]">
                    {post.upvote_count} votes · {post.comment_count} comments ·{' '}
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-6 text-[var(--text-muted)] text-center font-[family-name:var(--font-inter)]">
              No posts yet.
            </p>
          )}
        </Card>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)] mb-4 pb-2 border-b border-[var(--border-light)]">
          Recent Comments
        </h2>
        <Card padding="none" className="overflow-hidden">
          {comments && comments.length > 0 ? (
            <div className="divide-y divide-[var(--border-light)]">
              {comments.map((comment) => {
                const post = Array.isArray(comment.post) ? comment.post[0] : comment.post
                return (
                  <div key={comment.id} className="p-4 hover:bg-[var(--bg-secondary)]/50 transition-colors duration-150">
                    {post && (
                      <Link
                        href={`/discussions/${post.slug}`}
                        className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] block mb-2 font-[family-name:var(--font-inter)] transition-colors duration-150"
                      >
                        on: {post.title}
                      </Link>
                    )}
                    <p className="text-[var(--text-secondary)] line-clamp-3 font-[family-name:var(--font-inter)] leading-relaxed">
                      {comment.body}
                    </p>
                    <div className="text-sm text-[var(--text-muted)] mt-2 font-[family-name:var(--font-inter)]">
                      {comment.upvote_count} votes ·{' '}
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="p-6 text-[var(--text-muted)] text-center font-[family-name:var(--font-inter)]">
              No comments yet.
            </p>
          )}
        </Card>
      </section>
    </div>
  )
}
