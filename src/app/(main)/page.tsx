import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { PostCard } from '@/components/features/discussions/PostCard'
import { LatestEpisodesSidebar } from '@/components/features/episodes'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      upvote_count,
      comment_count,
      created_at,
      author:profiles!posts_author_id_fkey(username),
      series:series(name, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: episodes } = await supabase
    .from('episodes')
    .select('id, title, published_at')
    .order('published_at', { ascending: false })
    .limit(5)

  const formattedPosts = (posts || []).map((post) => ({
    ...post,
    author: Array.isArray(post.author) ? post.author[0] : post.author,
    series: Array.isArray(post.series) ? post.series[0] : post.series,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <header className="flex items-center justify-between pb-4 border-b border-[var(--border-light)]">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--ink-black)] tracking-[-0.02em]">
            Discussions
          </h1>
          <Link
            href="/discussions/new"
            className="px-5 py-2.5 bg-[var(--ink-black)] text-[var(--bg-primary)] text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--text-secondary)] transition-colors duration-200 tracking-[-0.01em]"
          >
            New Discussion
          </Link>
        </header>

        {formattedPosts.length === 0 ? (
          <Card variant="subtle">
            <p className="text-[var(--text-tertiary)] text-center py-10 font-[family-name:var(--font-inter)]">
              No discussions yet. Be the first to start a conversation.
            </p>
          </Card>
        ) : (
          <Card padding="none" className="overflow-hidden">
            <div className="divide-y divide-[var(--border-light)]">
              {formattedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <Card>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)] mb-4">
            About Longview
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] leading-[var(--leading-relaxed)] font-[family-name:var(--font-inter)]">
            A community hub for discussing long-form journalism, investigative reporting,
            and podcast episodes from the Longview network.
          </p>
        </Card>

        <LatestEpisodesSidebar episodes={episodes || []} />

        <Card>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)] mb-3">
            Community Guidelines
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] mb-4 font-[family-name:var(--font-inter)] leading-relaxed">
            Be respectful, stay on topic, and cite your sources.
          </p>
          <Link
            href="/guidelines"
            className="text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors duration-150 font-[family-name:var(--font-inter)]"
          >
            Read full guidelines →
          </Link>
        </Card>
      </aside>
    </div>
  )
}
