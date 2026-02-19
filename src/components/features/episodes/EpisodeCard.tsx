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
      className="block p-4 hover:bg-[var(--bg-secondary)] transition-colors duration-150 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {seriesName && (
            <div className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider mb-1.5">
              {seriesName}
            </div>
          )}
          <h4 className={`font-[family-name:var(--font-source-serif)] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-150 ${
            isCompact ? 'text-sm leading-snug' : 'text-base leading-snug'
          }`}>
            {episode.title}
          </h4>
          {!isCompact && episode.description && (
            <p className="text-sm text-[var(--text-tertiary)] mt-1.5 line-clamp-2 leading-relaxed font-[family-name:var(--font-inter)]">
              {episode.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
            <time dateTime={episode.published_at}>
              {format(new Date(episode.published_at), 'MMM d, yyyy')}
            </time>
            {episode.duration_seconds && (
              <>
                <span className="text-[var(--border-dark)]">·</span>
                <span>{formatDuration(episode.duration_seconds)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
