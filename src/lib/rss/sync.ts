import { createClient } from '@/lib/supabase/server'
import { parseRssFeed } from './parser'

interface Series {
  id: string
  name: string
  rss_feed_url: string | null
}

interface SyncResult {
  seriesId: string
  seriesName: string
  newEpisodes: number
  error?: string
}

export async function syncEpisodesFromRss(seriesId: string): Promise<SyncResult> {
  const supabase = await createClient()

  const { data: series, error: seriesError } = await supabase
    .from('series')
    .select('id, name, rss_feed_url')
    .eq('id', seriesId)
    .single()

  if (seriesError || !series) {
    return {
      seriesId,
      seriesName: 'Unknown',
      newEpisodes: 0,
      error: 'Series not found',
    }
  }

  if (!series.rss_feed_url) {
    return {
      seriesId,
      seriesName: series.name,
      newEpisodes: 0,
      error: 'No RSS feed URL configured',
    }
  }

  try {
    const response = await fetch(series.rss_feed_url)
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const xmlContent = await response.text()
    const allEpisodes = await parseRssFeed(xmlContent)

    // Limit to 20 most recent episodes to avoid timeout
    const episodes = allEpisodes.slice(0, 20)

    console.log(`[RSS Sync] Parsed ${allEpisodes.length} episodes, processing ${episodes.length}`)

    let newEpisodeCount = 0
    let skippedNoGuid = 0

    for (const episode of episodes) {
      if (!episode.guid) {
        skippedNoGuid++
        continue
      }

      const { data: existing } = await supabase
        .from('episodes')
        .select('id')
        .eq('guid', episode.guid)
        .eq('series_id', seriesId)
        .maybeSingle()

      if (!existing) {
        const { error: insertError } = await supabase.from('episodes').insert({
          series_id: seriesId,
          title: episode.title,
          description: episode.description,
          audio_url: episode.audioUrl,
          published_at: episode.publishedAt?.toISOString(),
          duration_seconds: episode.durationSeconds,
          guid: episode.guid,
        })

        if (insertError) {
          console.error(`[RSS Sync] Insert error for "${episode.title}":`, insertError.message)
        } else {
          newEpisodeCount++
        }
      }
    }

    console.log(`[RSS Sync] Complete: ${newEpisodeCount} new, ${skippedNoGuid} skipped (no guid)`)

    return {
      seriesId,
      seriesName: series.name,
      newEpisodes: newEpisodeCount,
      skippedNoGuid,
    }
  } catch (error) {
    console.error(`[RSS Sync] Error:`, error)
    return {
      seriesId,
      seriesName: series.name,
      newEpisodes: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function syncAllSeries(): Promise<SyncResult[]> {
  const supabase = await createClient()

  const { data: allSeries, error } = await supabase
    .from('series')
    .select('id')
    .not('rss_feed_url', 'is', null)

  if (error || !allSeries) {
    return []
  }

  const results: SyncResult[] = []

  for (const series of allSeries) {
    const result = await syncEpisodesFromRss(series.id)
    results.push(result)
  }

  return results
}
