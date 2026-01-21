import { render, screen } from '@testing-library/react'
import { EpisodeCard } from '../EpisodeCard'

const mockEpisode = {
  id: 'ep-1',
  title: 'Episode 1: The Beginning',
  description: 'This is the first episode of our podcast series.',
  published_at: '2024-01-15T10:00:00.000Z',
  audio_url: 'https://example.com/episode1.mp3',
  duration_seconds: 3600,
}

const mockEpisodeMinimal = {
  id: 'ep-2',
  title: 'Episode 2: No Details',
  description: null,
  published_at: '2024-01-22T10:00:00.000Z',
  audio_url: null,
  duration_seconds: null,
}

describe('EpisodeCard', () => {
  it('renders episode title', () => {
    render(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('Episode 1: The Beginning')).toBeInTheDocument()
  })

  it('renders episode description', () => {
    render(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('This is the first episode of our podcast series.')).toBeInTheDocument()
  })

  it('renders formatted publish date', () => {
    render(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
  })

  it('renders formatted duration', () => {
    render(<EpisodeCard episode={mockEpisode} />)
    expect(screen.getByText('1:00:00')).toBeInTheDocument()
  })

  it('links to episode detail page', () => {
    render(<EpisodeCard episode={mockEpisode} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/episodes/ep-1')
  })

  it('handles missing description gracefully', () => {
    render(<EpisodeCard episode={mockEpisodeMinimal} />)
    expect(screen.getByText('Episode 2: No Details')).toBeInTheDocument()
    expect(screen.queryByText('null')).not.toBeInTheDocument()
  })

  it('handles missing duration gracefully', () => {
    render(<EpisodeCard episode={mockEpisodeMinimal} />)
    expect(screen.queryByText('null')).not.toBeInTheDocument()
  })

  it('truncates long descriptions', () => {
    const longDescription = 'A'.repeat(300)
    render(<EpisodeCard episode={{ ...mockEpisode, description: longDescription }} />)
    const descElement = screen.getByText(/^A+/)
    expect(descElement).toHaveClass('line-clamp-2')
  })

  it('renders series name when provided', () => {
    render(<EpisodeCard episode={mockEpisode} seriesName="Longview Investigations" />)
    expect(screen.getByText('Longview Investigations')).toBeInTheDocument()
  })

  it('renders compact variant without description', () => {
    render(<EpisodeCard episode={mockEpisode} variant="compact" />)
    expect(screen.getByText('Episode 1: The Beginning')).toBeInTheDocument()
    expect(screen.queryByText('This is the first episode of our podcast series.')).not.toBeInTheDocument()
  })
})
