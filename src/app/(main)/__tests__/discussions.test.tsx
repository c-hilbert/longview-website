import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DiscussionsPage from '../discussions/page'

// Mock supabase client
const mockSupabase = {
  from: jest.fn(),
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

const mockPosts = [
  {
    id: '1',
    title: 'First Post',
    slug: 'first-post',
    upvote_count: 10,
    comment_count: 5,
    created_at: new Date().toISOString(),
    author: { username: 'user1' },
    series: null,
  },
  {
    id: '2',
    title: 'Second Post',
    slug: 'second-post',
    upvote_count: 20,
    comment_count: 3,
    created_at: new Date().toISOString(),
    author: { username: 'user2' },
    series: { name: 'Test Series', slug: 'test-series' },
  },
]

describe('DiscussionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders page title', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    })

    render(<DiscussionsPage />)
    expect(screen.getByText('Discussions')).toBeInTheDocument()
  })

  it('renders New Discussion link', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    })

    render(<DiscussionsPage />)
    const newLink = screen.getByRole('link', { name: 'New Discussion' })
    expect(newLink).toHaveAttribute('href', '/discussions/new')
  })

  it('renders tabs for Recent, Top, Unanswered', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    })

    render(<DiscussionsPage />)

    expect(screen.getByText('Recent')).toBeInTheDocument()
    expect(screen.getByText('Top')).toBeInTheDocument()
    expect(screen.getByText('Unanswered')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnValue(new Promise(() => {})),
    })

    render(<DiscussionsPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows empty state when no posts', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    })

    render(<DiscussionsPage />)

    await waitFor(() => {
      expect(screen.getByText('No discussions yet. Be the first to start a conversation.')).toBeInTheDocument()
    })
  })

  it('renders posts when data is loaded', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
    })

    render(<DiscussionsPage />)

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
      expect(screen.getByText('Second Post')).toBeInTheDocument()
    })
  })

  it('switches tabs and fetches data', async () => {
    const mockLimit = jest.fn().mockResolvedValue({ data: mockPosts, error: null })
    const mockOrder = jest.fn().mockReturnThis()

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: mockOrder,
      eq: jest.fn().mockReturnThis(),
      limit: mockLimit,
    })

    render(<DiscussionsPage />)

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
    })

    // Click Top tab
    await userEvent.click(screen.getByText('Top'))

    // Verify order was called with upvote_count
    await waitFor(() => {
      expect(mockOrder).toHaveBeenCalledWith('upvote_count', { ascending: false })
    })
  })
})
