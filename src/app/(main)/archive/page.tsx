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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Archive</h1>
        <p className="text-neutral-600">Browse all episodes from our podcast series.</p>
      </div>

      {series.length === 0 ? (
        <Card>
          <p className="text-neutral-500 text-center py-8">
            No episodes yet. Check back soon.
          </p>
        </Card>
      ) : (
        series.map((s) => (
          <div key={s.id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{s.name}</h2>
                {s.description && (
                  <p className="text-sm text-neutral-600">{s.description}</p>
                )}
              </div>
              <span className="text-sm text-neutral-500">
                {s.episodes.length} episodes
              </span>
            </div>

            <Card padding="none">
              {s.episodes.length === 0 ? (
                <p className="p-4 text-neutral-500 text-center">No episodes in this series yet.</p>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {s.episodes
                    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
                    .map((episode) => (
                      <Link
                        key={episode.id}
                        href={`/episodes/${episode.id}`}
                        className="block p-4 hover:bg-neutral-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium">{episode.title}</div>
                            {episode.description && (
                              <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                                {episode.description}
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-neutral-500 whitespace-nowrap">
                            {format(new Date(episode.published_at), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </Card>
          </div>
        ))
      )}
    </div>
  )
}
