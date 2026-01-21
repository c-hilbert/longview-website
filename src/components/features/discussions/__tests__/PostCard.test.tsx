import { render, screen } from '@testing-library/react'
import { PostCard } from '../PostCard'

const mockPost = {
  id: '1',
  title: 'Test Discussion Title',
  slug: 'test-discussion-title',
  upvote_count: 42,
  comment_count: 5,
  created_at: new Date().toISOString(),
  author: { username: 'testuser' },
  series: null,
}

const mockPostWithSeries = {
  ...mockPost,
  series: { name: 'Test Series', slug: 'test-series' },
}

describe('PostCard', () => {
  it('renders the post title', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Test Discussion Title')).toBeInTheDocument()
  })

  it('renders vote count', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('votes')).toBeInTheDocument()
  })

  it('renders comment count', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('replies')).toBeInTheDocument()
  })

  it('renders author username', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('links to the post detail page', () => {
    render(<PostCard post={mockPost} />)
    const link = screen.getByRole('link', { name: 'Test Discussion Title' })
    expect(link).toHaveAttribute('href', '/discussions/test-discussion-title')
  })

  it('links to author profile', () => {
    render(<PostCard post={mockPost} />)
    const authorLink = screen.getByRole('link', { name: 'testuser' })
    expect(authorLink).toHaveAttribute('href', '/u/testuser')
  })

  it('renders series name when series is provided', () => {
    render(<PostCard post={mockPostWithSeries} />)
    expect(screen.getByText('Test Series')).toBeInTheDocument()
  })

  it('links to series page when series is provided', () => {
    render(<PostCard post={mockPostWithSeries} />)
    const seriesLink = screen.getByRole('link', { name: 'Test Series' })
    expect(seriesLink).toHaveAttribute('href', '/series/test-series')
  })

  it('does not render series when series is null', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.queryByText('Test Series')).not.toBeInTheDocument()
  })

  it('renders relative time', () => {
    render(<PostCard post={mockPost} />)
    // Should contain "ago" since we're using formatDistanceToNow with addSuffix
    expect(screen.getByText(/ago/)).toBeInTheDocument()
  })
})
