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
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Discussions</h1>
          <Link
            href="/discussions/new"
            className="px-4 py-2 bg-stone-900 text-white text-sm rounded-md hover:bg-stone-800"
          >
            New Discussion
          </Link>
        </div>

        {formattedPosts.length === 0 ? (
          <Card>
            <p className="text-stone-600 text-center py-8">
              No discussions yet. Be the first to start a conversation.
            </p>
          </Card>
        ) : (
          <Card padding="none">
            <div className="divide-y divide-stone-200">
              {formattedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </Card>
        )}
      </div>

      <aside className="space-y-6">
        <Card>
          <h2 className="font-semibold mb-4">About Longview</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            A community hub for discussing long-form journalism, investigative reporting,
            and podcast episodes from the Longview network.
          </p>
        </Card>

        <LatestEpisodesSidebar episodes={episodes || []} />

        <Card>
          <h2 className="font-semibold mb-3">Community Guidelines</h2>
          <p className="text-sm text-stone-600 mb-4">
            Be respectful, stay on topic, and cite your sources.
          </p>
          <Link
            href="/guidelines"
            className="text-sm font-medium hover:underline"
          >
            Read full guidelines →
          </Link>
        </Card>
      </aside>
    </div>
  )
}
