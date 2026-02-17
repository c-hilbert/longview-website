import { render, screen } from '@testing-library/react'
import { ShowCard } from '../ShowCard'

describe('ShowCard', () => {
  const mockProps = {
    title: 'Test Show',
    tagline: 'A test podcast',
    description: 'This is a description of the test show.',
    slug: 'test-show',
    spotifyUrl: 'https://spotify.com/test',
    appleUrl: 'https://apple.com/test',
    youtubeUrl: 'https://youtube.com/test',
  }

  it('renders show title', () => {
    render(<ShowCard {...mockProps} />)
    expect(screen.getByText('Test Show')).toBeInTheDocument()
  })

  it('renders tagline', () => {
    render(<ShowCard {...mockProps} />)
    expect(screen.getByText('A test podcast')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<ShowCard {...mockProps} />)
    expect(screen.getByText(/This is a description/i)).toBeInTheDocument()
  })

  it('renders platform links when provided', () => {
    render(<ShowCard {...mockProps} />)
    expect(screen.getByText('Spotify')).toBeInTheDocument()
    expect(screen.getByText('Apple Podcasts')).toBeInTheDocument()
    expect(screen.getByText('YouTube')).toBeInTheDocument()
  })

  it('renders view episodes link when slug is provided', () => {
    render(<ShowCard {...mockProps} />)
    expect(screen.getByText(/View all episodes/i)).toBeInTheDocument()
  })

  it('does not render platform links when not provided', () => {
    render(<ShowCard title="Test" tagline="Test" description="Test" />)
    expect(screen.queryByText('Spotify')).not.toBeInTheDocument()
    expect(screen.queryByText('Apple Podcasts')).not.toBeInTheDocument()
  })
})
