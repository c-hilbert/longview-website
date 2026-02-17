import { render, screen } from '@testing-library/react'
import { ShowCard } from '../ShowCard'

describe('ShowCard', () => {
  const mockShow = {
    id: '1',
    name: 'The Last Invention',
    slug: 'the-last-invention',
    description: 'Exploring the frontiers of technology and science',
    episodeCount: 12
  }

  it('renders show name', () => {
    render(<ShowCard show={mockShow} />)
    expect(screen.getByRole('heading', { name: 'The Last Invention' })).toBeInTheDocument()
  })

  it('renders show description', () => {
    render(<ShowCard show={mockShow} />)
    expect(screen.getByText('Exploring the frontiers of technology and science')).toBeInTheDocument()
  })

  it('renders episode count', () => {
    render(<ShowCard show={mockShow} />)
    expect(screen.getByText('12 Episodes')).toBeInTheDocument()
  })

  it('renders singular episode count when count is 1', () => {
    const showWithOneEpisode = { ...mockShow, episodeCount: 1 }
    render(<ShowCard show={showWithOneEpisode} />)
    expect(screen.getByText('1 Episode')).toBeInTheDocument()
  })

  it('links to the show archive', () => {
    render(<ShowCard show={mockShow} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/archive?series=the-last-invention')
  })

  it('renders without description when null', () => {
    const showWithoutDescription = { ...mockShow, description: null }
    render(<ShowCard show={showWithoutDescription} />)
    expect(screen.getByRole('heading', { name: 'The Last Invention' })).toBeInTheDocument()
  })
})
