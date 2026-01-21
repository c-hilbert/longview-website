import { render, screen } from '@testing-library/react'
import { LatestEpisodesSidebar } from '../LatestEpisodesSidebar'

const mockEpisodes = [
  {
    id: 'ep-1',
    title: 'Episode 1: First',
    published_at: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'ep-2',
    title: 'Episode 2: Second',
    published_at: '2024-01-22T10:00:00.000Z',
  },
]

describe('LatestEpisodesSidebar', () => {
  it('renders section title', () => {
    render(<LatestEpisodesSidebar episodes={mockEpisodes} />)
    expect(screen.getByText('Latest Episodes')).toBeInTheDocument()
  })

  it('renders episode titles', () => {
    render(<LatestEpisodesSidebar episodes={mockEpisodes} />)
    expect(screen.getByText('Episode 1: First')).toBeInTheDocument()
    expect(screen.getByText('Episode 2: Second')).toBeInTheDocument()
  })

  it('links to episode pages', () => {
    render(<LatestEpisodesSidebar episodes={mockEpisodes} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/episodes/ep-1')
    expect(links[1]).toHaveAttribute('href', '/episodes/ep-2')
  })

  it('renders formatted dates', () => {
    render(<LatestEpisodesSidebar episodes={mockEpisodes} />)
    expect(screen.getByText('Jan 15')).toBeInTheDocument()
    expect(screen.getByText('Jan 22')).toBeInTheDocument()
  })

  it('shows empty state when no episodes', () => {
    render(<LatestEpisodesSidebar episodes={[]} />)
    expect(screen.getByText('No episodes yet.')).toBeInTheDocument()
  })

  it('renders archive link', () => {
    render(<LatestEpisodesSidebar episodes={mockEpisodes} />)
    const archiveLink = screen.getByRole('link', { name: /browse all/i })
    expect(archiveLink).toHaveAttribute('href', '/archive')
  })
})
