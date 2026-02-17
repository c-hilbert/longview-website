import Link from 'next/link'
import { format } from 'date-fns'
import { Card } from '@/components/ui/Card'

interface Episode {
  id: string
  title: string
  published_at: string
}

interface LatestEpisodesSidebarProps {
  episodes: Episode[]
}

export function LatestEpisodesSidebar({ episodes }: LatestEpisodesSidebarProps) {
  return (
    <Card>
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)] mb-4">
        Latest Episodes
      </h2>

      {episodes.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
          No episodes yet.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={`/episodes/${episode.id}`}
                className="block group"
              >
                <h4 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-150 line-clamp-2 font-[family-name:var(--font-source-serif)] leading-snug">
                  {episode.title}
                </h4>
                <time 
                  dateTime={episode.published_at}
                  className="text-xs text-[var(--text-muted)] mt-1.5 block font-[family-name:var(--font-inter)]"
                >
                  {format(new Date(episode.published_at), 'MMM d')}
                </time>
              </Link>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[var(--border-light)]">
            <Link
              href="/archive"
              className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-150 font-[family-name:var(--font-inter)]"
            >
              Browse all episodes →
            </Link>
          </div>
        </>
      )}
    </Card>
  )
}
