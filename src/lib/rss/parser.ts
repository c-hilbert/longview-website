import { XMLParser } from 'fast-xml-parser'

export interface Episode {
  title: string
  description: string | null
  audioUrl: string | null
  publishedAt: Date | null
  guid: string | null
  durationSeconds: number | null
}

interface RssItem {
  title?: string
  description?: string
  pubDate?: string
  enclosure?: { '@_url'?: string } | string
  guid?: string | { '#text'?: string }
  'itunes:duration'?: string | number
}

interface RssChannel {
  item?: RssItem | RssItem[]
}

interface RssFeed {
  rss?: {
    channel?: RssChannel
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function parseDuration(duration: string | number | undefined): number | null {
  if (duration === undefined || duration === null) return null

  if (typeof duration === 'number') {
    return duration
  }

  const str = String(duration).trim()

  // Format: seconds only (e.g., "3600")
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10)
  }

  // Format: MM:SS or HH:MM:SS
  const parts = str.split(':').map(Number)
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }

  return null
}

function getEnclosureUrl(enclosure: RssItem['enclosure']): string | null {
  if (!enclosure) return null
  if (typeof enclosure === 'string') return enclosure
  return enclosure['@_url'] || null
}

function getGuid(guid: RssItem['guid']): string | null {
  if (!guid) return null
  if (typeof guid === 'string') return guid
  return guid['#text'] || null
}

export async function parseRssFeed(xmlContent: string): Promise<Episode[]> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  })

  const parsed: RssFeed = parser.parse(xmlContent)

  if (!parsed.rss?.channel) {
    throw new Error('Invalid RSS feed: missing channel')
  }

  const channel = parsed.rss.channel
  const items = channel.item

  if (!items) {
    return []
  }

  const itemArray = Array.isArray(items) ? items : [items]

  return itemArray.map((item): Episode => {
    const description = item.description
      ? stripHtml(item.description)
      : null

    const publishedAt = item.pubDate
      ? new Date(item.pubDate)
      : null

    return {
      title: item.title || 'Untitled',
      description,
      audioUrl: getEnclosureUrl(item.enclosure),
      publishedAt,
      guid: getGuid(item.guid),
      durationSeconds: parseDuration(item['itunes:duration']),
    }
  })
}
