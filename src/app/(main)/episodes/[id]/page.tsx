import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { TranscriptViewer, AudioPlayer } from '@/components/features/episodes'

interface PageProps {
  params: Promise<{ id: string }>
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

export default async function EpisodePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: episode, error } = await supabase
    .from('episodes')
    .select(`
      id,
      title,
      description,
      audio_url,
      transcript,
      published_at,
      duration_seconds,
      series:series(id, name, slug)
    `)
    .eq('id', id)
    .single()

  if (error || !episode) {
    notFound()
  }

  const series = Array.isArray(episode.series) ? episode.series[0] : episode.series

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        {series && (
          <Link
            href="/archive"
            className="inline-block text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--accent-hover)] mb-3 font-[family-name:var(--font-inter)] transition-colors duration-150"
          >
            ← {series.name}
          </Link>
        )}

        <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-semibold text-[var(--ink-black)] mb-4 tracking-[-0.02em] leading-[var(--leading-tight)]">
          {episode.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] mb-6 font-[family-name:var(--font-inter)]">
          <time dateTime={episode.published_at}>
            {format(new Date(episode.published_at), 'MMMM d, yyyy')}
          </time>
          {episode.duration_seconds && (
            <>
              <span className="text-[var(--border-dark)]">·</span>
              <span>{formatDuration(episode.duration_seconds)}</span>
            </>
          )}
        </div>

        {episode.audio_url && (
          <div className="mb-6">
            <AudioPlayer 
              src={episode.audio_url} 
              title={episode.title}
              skipBackSeconds={15}
              skipForwardSeconds={30}
            />
          </div>
        )}

        {episode.description && (
          <div className="prose-editorial">
            <p className="whitespace-pre-wrap leading-[var(--leading-relaxed)] font-[family-name:var(--font-inter)] text-[var(--text-secondary)]">
              {episode.description}
            </p>
          </div>
        )}
      </Card>

      <TranscriptViewer transcript={episode.transcript} />

      <Card>
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--ink-black)] mb-3 tracking-[-0.01em]">
          Discussion
        </h2>
        <p className="text-sm text-[var(--text-tertiary)] mb-5 font-[family-name:var(--font-inter)]">
          Want to discuss this episode? Start a conversation in the community.
        </p>
        <Link
          href={`/discussions/new?episode=${episode.id}`}
          className="inline-block px-5 py-2.5 bg-[var(--ink-black)] text-[var(--bg-primary)] text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--text-secondary)] transition-colors duration-200 tracking-[-0.01em]"
        >
          Start Discussion
        </Link>
      </Card>
    </div>
  )
}
