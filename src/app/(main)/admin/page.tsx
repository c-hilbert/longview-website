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
    <div className="space-y-10">
      <header>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--ink-black)] mb-3 tracking-[-0.02em]">
          Admin Dashboard
        </h1>
        <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-inter)]">
          Manage your community and content.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-4xl font-semibold font-[family-name:var(--font-playfair)] text-[var(--ink-black)]">
            {totalPosts || 0}
          </div>
          <div className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)] mt-1">
            Total Posts
          </div>
        </Card>
        <Card>
          <div className="text-4xl font-semibold font-[family-name:var(--font-playfair)] text-[var(--ink-black)]">
            {totalUsers || 0}
          </div>
          <div className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)] mt-1">
            Total Users
          </div>
        </Card>
        <Card>
          <div className="text-4xl font-semibold font-[family-name:var(--font-playfair)] text-[var(--ink-black)]">
            {totalEpisodes || 0}
          </div>
          <div className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)] mt-1">
            Total Episodes
          </div>
        </Card>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border-light)]">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)]">
            Series
          </h2>
          <Link
            href="/admin/series/new"
            className="px-4 py-2 bg-[var(--ink-black)] text-[var(--bg-primary)] text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--text-secondary)] transition-colors duration-200"
          >
            Add Series
          </Link>
        </div>
        <Card padding="none" className="overflow-hidden">
          {series && series.length > 0 ? (
            <div className="divide-y divide-[var(--border-light)]">
              {series.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-secondary)]/30 transition-colors duration-150">
                  <div>
                    <div className="font-semibold text-[var(--text-primary)] font-[family-name:var(--font-source-serif)]">
                      {s.name}
                    </div>
                    <div className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
                      /{s.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {s.rss_feed_url ? (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-[var(--radius-sm)] font-[family-name:var(--font-inter)]">
                        RSS Active
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-[var(--radius-sm)] font-[family-name:var(--font-inter)]">
                        No RSS
                      </span>
                    )}
                    <Link
                      href={`/admin/series/${s.id}`}
                      className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors duration-150 font-[family-name:var(--font-inter)]"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-6 text-[var(--text-muted)] text-center font-[family-name:var(--font-inter)]">
              No series yet.
            </p>
          )}
        </Card>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)] mb-4 pb-2 border-b border-[var(--border-light)]">
          Recent Posts
        </h2>
        <Card padding="none" className="overflow-hidden">
          {recentPosts && recentPosts.length > 0 ? (
            <div className="divide-y divide-[var(--border-light)]">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-secondary)]/30 transition-colors duration-150">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/discussions/${post.slug}`}
                      className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-150 font-[family-name:var(--font-source-serif)]"
                    >
                      {post.title}
                    </Link>
                    {post.locked && (
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-[var(--radius-sm)] font-[family-name:var(--font-inter)]">
                        Locked
                      </span>
                    )}
                  </div>
                  <time 
                    dateTime={post.created_at}
                    className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)]"
                  >
                    {new Date(post.created_at).toLocaleDateString()}
                  </time>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-6 text-[var(--text-muted)] text-center font-[family-name:var(--font-inter)]">
              No posts yet.
            </p>
          )}
        </Card>
      </section>
    </div>
  )
}
