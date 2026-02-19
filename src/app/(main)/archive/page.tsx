import Link from 'next/link'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'

interface Episode {
  id: string
  title: string
  description: string | null
  published_at: string
  audio_url: string | null
}

interface Series {
  id: string
  name: string
  slug: string
  description: string | null
  episodes: Episode[]
}

export default async function ArchivePage() {
  const supabase = await createClient()

  const { data: seriesData } = await supabase
    .from('series')
    .select(`
      id,
      name,
      slug,
      description,
      episodes (
        id,
        title,
        description,
        published_at,
        audio_url
      )
    `)
    .order('name')

  const series = (seriesData || []) as Series[]

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--ink-black)] mb-3 tracking-[-0.02em]">
          Archive
        </h1>
        <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-inter)]">
          Browse all episodes from our podcast series.
        </p>
      </header>

      {series.length === 0 ? (
        <Card variant="subtle">
          <p className="text-[var(--text-muted)] text-center py-10 font-[family-name:var(--font-inter)]">
            No episodes yet. Check back soon.
          </p>
        </Card>
      ) : (
        series.map((s) => (
          <section key={s.id}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border-light)]">
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)]">
                  {s.name}
                </h2>
                {s.description && (
                  <p className="text-sm text-[var(--text-tertiary)] mt-1 font-[family-name:var(--font-inter)]">
                    {s.description}
                  </p>
                )}
              </div>
              <span className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
                {s.episodes.length} episodes
              </span>
            </div>

            <Card padding="none" className="overflow-hidden">
              {s.episodes.length === 0 ? (
                <p className="p-5 text-[var(--text-muted)] text-center font-[family-name:var(--font-inter)]">
                  No episodes in this series yet.
                </p>
              ) : (
                <div className="divide-y divide-[var(--border-light)]">
                  {s.episodes
                    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
                    .map((episode) => (
                      <Link
                        key={episode.id}
                        href={`/episodes/${episode.id}`}
                        className="block p-5 hover:bg-[var(--bg-secondary)]/50 transition-colors duration-150 group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-[family-name:var(--font-source-serif)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-150 leading-snug">
                              {episode.title}
                            </h3>
                            {episode.description && (
                              <p className="text-sm text-[var(--text-tertiary)] mt-1.5 line-clamp-2 font-[family-name:var(--font-inter)] leading-relaxed">
                                {episode.description}
                              </p>
                            )}
                          </div>
                          <time 
                            dateTime={episode.published_at}
                            className="text-sm text-[var(--text-muted)] whitespace-nowrap font-[family-name:var(--font-inter)]"
                          >
                            {format(new Date(episode.published_at), 'MMM d, yyyy')}
                          </time>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </Card>
          </section>
        ))
      )}
    </div>
  )
}
