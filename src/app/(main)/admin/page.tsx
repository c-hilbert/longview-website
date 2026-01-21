import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { canModerate } from '@/lib/auth/admin'
import { Card } from '@/components/ui/Card'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!canModerate(profile)) {
    redirect('/')
  }

  const { data: series } = await supabase
    .from('series')
    .select('id, name, slug, rss_feed_url, created_at')
    .order('name')

  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, title, slug, created_at, locked')
    .order('created_at', { ascending: false })
    .limit(10)

  const { count: totalPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalEpisodes } = await supabase
    .from('episodes')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
        <p className="text-stone-600">Manage your community and content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-3xl font-semibold">{totalPosts || 0}</div>
          <div className="text-sm text-stone-500">Total Posts</div>
        </Card>
        <Card>
          <div className="text-3xl font-semibold">{totalUsers || 0}</div>
          <div className="text-sm text-stone-500">Total Users</div>
        </Card>
        <Card>
          <div className="text-3xl font-semibold">{totalEpisodes || 0}</div>
          <div className="text-sm text-stone-500">Total Episodes</div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Series</h2>
          <Link
            href="/admin/series/new"
            className="px-3 py-1.5 bg-stone-900 text-white text-sm rounded-md hover:bg-stone-800"
          >
            Add Series
          </Link>
        </div>
        <Card padding="none">
          {series && series.length > 0 ? (
            <div className="divide-y divide-stone-200">
              {series.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-stone-500">/{s.slug}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    {s.rss_feed_url ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        RSS Active
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">
                        No RSS
                      </span>
                    )}
                    <Link
                      href={`/admin/series/${s.id}`}
                      className="text-sm text-stone-600 hover:text-stone-900"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-4 text-stone-500 text-center">No series yet.</p>
          )}
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
        <Card padding="none">
          {recentPosts && recentPosts.length > 0 ? (
            <div className="divide-y divide-stone-200">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/discussions/${post.slug}`}
                      className="font-medium hover:underline"
                    >
                      {post.title}
                    </Link>
                    {post.locked && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        Locked
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-stone-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-4 text-stone-500 text-center">No posts yet.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
