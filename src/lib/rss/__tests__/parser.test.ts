import { parseRssFeed, type Episode } from '../parser'

const mockRssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Test Podcast</title>
    <description>A test podcast for unit testing</description>
    <item>
      <title>Episode 1: Introduction</title>
      <description>This is the first episode of our podcast.</description>
      <pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>
      <enclosure url="https://example.com/episode1.mp3" type="audio/mpeg" length="12345678"/>
      <guid>episode-1-guid</guid>
      <itunes:duration>3600</itunes:duration>
    </item>
    <item>
      <title>Episode 2: Deep Dive</title>
      <description><![CDATA[<p>This episode goes deeper into the topic.</p>]]></description>
      <pubDate>Mon, 22 Jan 2024 10:00:00 GMT</pubDate>
      <enclosure url="https://example.com/episode2.mp3" type="audio/mpeg" length="23456789"/>
      <guid>episode-2-guid</guid>
      <itunes:duration>45:30</itunes:duration>
    </item>
  </channel>
</rss>`

const emptyRssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Empty Podcast</title>
    <description>No episodes yet</description>
  </channel>
</rss>`

const malformedRssFeed = `not valid xml at all`

describe('parseRssFeed', () => {
  it('parses episodes from valid RSS feed', async () => {
    const episodes = await parseRssFeed(mockRssFeed)

    expect(episodes).toHaveLength(2)
  })

  it('extracts episode title', async () => {
    const episodes = await parseRssFeed(mockRssFeed)

    expect(episodes[0].title).toBe('Episode 1: Introduction')
    expect(episodes[1].title).toBe('Episode 2: Deep Dive')
  })

  it('extracts episode description', async () => {
    const episodes = await parseRssFeed(mockRssFeed)

    expect(episodes[0].description).toBe('This is the first episode of our podcast.')
  })

  it('strips HTML from description', async () => {
    const episodes = await parseRssFeed(mockRssFeed)

    expect(episodes[1].description).toBe('This episode goes deeper into the topic.')
  })

  it('extracts audio URL from enclosure', async () => {
    const episodes = await parseRssFeed(mockRssFeed)

    expect(episodes[0].audioUrl).toBe('https://example.com/episode1.mp3')
    expect(episodes[1].audioUrl).toBe('https://example.com/episode2.mp3')
  })

  it('extracts publish date', async () => {
    const episodes = await parseRssFeed(mockRssFeed)

    expect(episodes[0].publishedAt).toEqual(new Date('2024-01-15T10:00:00.000Z'))
    expect(episodes[1].publishedAt).toEqual(new Date('2024-01-22T10:00:00.000Z'))
  })

  it('extracts guid', async () => {
    const episodes = await parseRssFeed(mockRssFeed)

    expect(episodes[0].guid).toBe('episode-1-guid')
    expect(episodes[1].guid).toBe('episode-2-guid')
  })

  it('extracts duration in seconds', async () => {
    const episodes = await parseRssFeed(mockRssFeed)

    expect(episodes[0].durationSeconds).toBe(3600)
    expect(episodes[1].durationSeconds).toBe(2730) // 45:30 = 45*60 + 30
  })

  it('returns empty array for feed with no episodes', async () => {
    const episodes = await parseRssFeed(emptyRssFeed)

    expect(episodes).toHaveLength(0)
  })

  it('throws error for malformed XML', async () => {
    await expect(parseRssFeed(malformedRssFeed)).rejects.toThrow()
  })

  it('handles missing optional fields gracefully', async () => {
    const minimalFeed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Minimal Podcast</title>
        <item>
          <title>Minimal Episode</title>
        </item>
      </channel>
    </rss>`

    const episodes = await parseRssFeed(minimalFeed)

    expect(episodes).toHaveLength(1)
    expect(episodes[0].title).toBe('Minimal Episode')
    expect(episodes[0].description).toBeNull()
    expect(episodes[0].audioUrl).toBeNull()
    expect(episodes[0].publishedAt).toBeNull()
    expect(episodes[0].guid).toBeNull()
    expect(episodes[0].durationSeconds).toBeNull()
  })
})
