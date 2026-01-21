import Link from 'next/link'
import { format } from 'date-fns'

interface Episode {
  id: string
  title: string
  description: string | null
  published_at: string
  audio_url: string | null
  duration_seconds: number | null
}

interface EpisodeCardProps {
  episode: Episode
  seriesName?: string
  variant?: 'default' | 'compact'
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function EpisodeCard({ episode, seriesName, variant = 'default' }: EpisodeCardProps) {
  const isCompact = variant === 'compact'

  return (
    <Link
      href={`/episodes/${episode.id}`}
      className="block p-4 hover:bg-stone-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {seriesName && (
            <div className="text-xs text-rose-600 font-medium mb-1">
              {seriesName}
            </div>
          )}
          <div className="font-medium text-stone-900">{episode.title}</div>
          {!isCompact && episode.description && (
            <p className="text-sm text-stone-600 mt-1 line-clamp-2">
              {episode.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
            <span>{format(new Date(episode.published_at), 'MMM d, yyyy')}</span>
            {episode.duration_seconds && (
              <>
                <span>·</span>
                <span>{formatDuration(episode.duration_seconds)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
