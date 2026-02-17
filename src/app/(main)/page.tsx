import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/features/shows/HeroSection'
import { ShowCard } from '@/components/features/shows/ShowCard'
import { MissionSection } from '@/components/features/shows/MissionSection'
import { TeamSection } from '@/components/features/shows/TeamSection'
import { EmailSignup } from '@/components/features/shows/EmailSignup'
import { CommunitySection } from '@/components/features/shows/CommunitySection'
import { LatestEpisodesSidebar } from '@/components/features/episodes'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch series (shows) with episode counts
  const { data: series } = await supabase
    .from('series')
    .select(`
      id,
      name,
      slug,
      description,
      episodes:episodes(count)
    `)
    .order('name', { ascending: true })

  // Fetch recent posts for community section
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
    .limit(6)

  // Fetch latest episodes for sidebar
  const { data: episodes } = await supabase
    .from('episodes')
    .select('id, title, published_at')
    .order('published_at', { ascending: false })
    .limit(5)

  // Format series data
  const shows = (series || []).map((s) => ({
    ...s,
    episodeCount: Array.isArray(s.episodes) ? s.episodes[0]?.count || 0 : 0
  }))

  // Format posts data
  const formattedPosts = (posts || []).map((post) => ({
    ...post,
    author: Array.isArray(post.author) ? post.author[0] : post.author,
    series: Array.isArray(post.series) ? post.series[0] : post.series,
  }))

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Shows Section */}
      {shows.length > 0 && (
        <section className="py-16 sm:py-20 border-t border-[var(--border-light)]">
          <div className="mb-10">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-semibold text-[var(--ink-black)] mb-3">
              Featured Shows
            </h2>
            <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-inter)]">
              In-depth conversations on science, technology, and the future
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shows.map((show) => (
              <ShowCard 
                key={show.id} 
                show={{
                  id: show.id,
                  name: show.name,
                  slug: show.slug,
                  description: show.description,
                  episodeCount: show.episodeCount
                }} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Mission Section */}
      <MissionSection />

      {/* Two Column Layout: Latest Episodes & Email Signup */}
      <section className="py-16 sm:py-20 border-t border-[var(--border-light)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Latest Episodes */}
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-semibold text-[var(--ink-black)] mb-6">
              Latest Episodes
            </h2>
            <LatestEpisodesSidebar episodes={episodes || []} />
          </div>

          {/* Email Signup */}
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-semibold text-[var(--ink-black)] mb-6">
              Never Miss an Episode
            </h2>
            <EmailSignup />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Community Discussions */}
      <CommunitySection posts={formattedPosts} />
    </div>
  )
}
