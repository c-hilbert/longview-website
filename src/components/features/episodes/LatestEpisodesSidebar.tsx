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
      <h2 className="font-semibold mb-4">Latest Episodes</h2>

      {episodes.length === 0 ? (
        <p className="text-sm text-stone-500">No episodes yet.</p>
      ) : (
        <>
          <div className="space-y-3">
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={`/episodes/${episode.id}`}
                className="block group"
              >
                <div className="text-sm font-medium text-stone-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                  {episode.title}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {format(new Date(episode.published_at), 'MMM d')}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-200">
            <Link
              href="/archive"
              className="text-sm text-stone-600 hover:text-stone-900"
            >
              Browse all episodes →
            </Link>
          </div>
        </>
      )}
    </Card>
  )
}
