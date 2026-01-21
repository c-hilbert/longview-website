import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { TranscriptViewer } from '@/components/features/episodes'

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
            href={`/archive`}
            className="inline-block text-sm text-rose-600 hover:underline mb-2"
          >
            ← {series.name}
          </Link>
        )}

        <h1 className="text-2xl font-semibold mb-4">{episode.title}</h1>

        <div className="flex items-center gap-3 text-sm text-stone-500 mb-6">
          <span>{format(new Date(episode.published_at), 'MMMM d, yyyy')}</span>
          {episode.duration_seconds && (
            <>
              <span>·</span>
              <span>{formatDuration(episode.duration_seconds)}</span>
            </>
          )}
        </div>

        {episode.audio_url && (
          <div className="mb-6">
            <audio
              controls
              className="w-full"
              preload="metadata"
            >
              <source src={episode.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {episode.description && (
          <div className="prose prose-stone max-w-none">
            <p className="whitespace-pre-wrap">{episode.description}</p>
          </div>
        )}
      </Card>

      <TranscriptViewer transcript={episode.transcript} />

      <Card>
        <h2 className="text-lg font-semibold mb-4">Discussion</h2>
        <p className="text-sm text-stone-500 mb-4">
          Want to discuss this episode? Start a conversation in the community.
        </p>
        <Link
          href={`/discussions/new?episode=${episode.id}`}
          className="inline-block px-4 py-2 bg-stone-900 text-white text-sm rounded-md hover:bg-stone-800"
        >
          Start Discussion
        </Link>
      </Card>
    </div>
  )
}
