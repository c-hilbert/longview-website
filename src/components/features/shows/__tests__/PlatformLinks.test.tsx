import { render, screen } from '@testing-library/react'
import { PlatformLinks } from '../PlatformLinks'

describe('PlatformLinks', () => {
  it('renders Spotify link', () => {
    render(<PlatformLinks />)
    const spotifyLink = screen.getByRole('link', { name: /Spotify/i })
    expect(spotifyLink).toBeInTheDocument()
    expect(spotifyLink).toHaveAttribute('href', expect.stringContaining('spotify.com'))
    expect(spotifyLink).toHaveAttribute('target', '_blank')
    expect(spotifyLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders Apple Podcasts link', () => {
    render(<PlatformLinks />)
    const appleLink = screen.getByRole('link', { name: /Apple Podcasts/i })
    expect(appleLink).toBeInTheDocument()
    expect(appleLink).toHaveAttribute('href', expect.stringContaining('apple.com'))
    expect(appleLink).toHaveAttribute('target', '_blank')
  })

  it('renders YouTube link', () => {
    render(<PlatformLinks />)
    const youtubeLink = screen.getByRole('link', { name: /YouTube/i })
    expect(youtubeLink).toBeInTheDocument()
    expect(youtubeLink).toHaveAttribute('href', expect.stringContaining('youtube.com'))
    expect(youtubeLink).toHaveAttribute('target', '_blank')
  })

  it('renders RSS link', () => {
    render(<PlatformLinks />)
    const rssLink = screen.getByRole('link', { name: /RSS/i })
    expect(rssLink).toBeInTheDocument()
    expect(rssLink).toHaveAttribute('href', '/feed.xml')
  })

  it('renders all four platform links', () => {
    render(<PlatformLinks />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
  })
})
