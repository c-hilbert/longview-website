import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { HeroSection, ShowCard, MissionSection, TeamSection } from '@/components/features/home'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch latest episodes for the sidebar (optional)
  const { data: episodes } = await supabase
    .from('episodes')
    .select('id, title, published_at, series:series(name, slug)')
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Shows */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-12 tracking-tight text-center">
            Our Shows
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ShowCard
              title="The Last Invention"
              tagline="An 8-part investigative series"
              description="A deep dive into artificial intelligence, exploring its potential as humanity's last invention and the profound questions it raises about our future."
              slug="the-last-invention"
              spotifyUrl="https://open.spotify.com/show/placeholder"
              appleUrl="https://podcasts.apple.com/placeholder"
              youtubeUrl="https://youtube.com/placeholder"
            />
            
            <ShowCard
              title="The Reflector"
              tagline="Weekly conversations"
              description="Thoughtful discussions about the stories and ideas that matter. Each week, we reflect on the forces shaping our world and what they mean for the future."
              slug="reflector"
              spotifyUrl="https://open.spotify.com/show/placeholder"
              appleUrl="https://podcasts.apple.com/placeholder"
              youtubeUrl="https://youtube.com/placeholder"
            />
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <MissionSection />

      {/* Team */}
      <TeamSection />

      {/* Community / Discussions CTA */}
      <section className="py-16 md:py-24 px-6 bg-[var(--color-card-bg)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-6 tracking-tight">
            Join the Conversation
          </h2>
          <p className="text-lg text-[var(--color-muted)] mb-8 max-w-2xl mx-auto">
            Connect with fellow listeners, discuss episodes, and share your thoughts in our community.
          </p>
          <Link href="/discussions">
            <Button size="lg">Visit Discussions</Button>
          </Link>
        </div>
      </section>

      {/* Email Signup (placeholder) */}
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">
            Stay Updated
          </h3>
          <p className="text-[var(--color-muted)] mb-6">
            Get notified when new episodes are released.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-2 border-[var(--color-border)] rounded focus:outline-none focus:border-[var(--color-primary)]"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  )
}
