import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VoteButton } from '../VoteButton'

// Mock the supabase client
const mockUser = { id: 'test-user-id' }
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

describe('VoteButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
  })

  it('renders the initial vote count', () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<VoteButton postId="post-1" initialCount={10} />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders upvote button', () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<VoteButton postId="post-1" initialCount={5} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows voted state when user has voted', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: { id: 'vote-1' } }),
    })

    render(<VoteButton postId="post-1" initialCount={5} />)

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('text-rose-600')
    })
  })

  it('increments count optimistically when voting', async () => {
    const mockInsert = jest.fn().mockResolvedValue({ error: null })
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
      insert: mockInsert,
    })

    render(<VoteButton postId="post-1" initialCount={5} />)

    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText('6')).toBeInTheDocument()
    })
  })

  it('decrements count when removing vote', async () => {
    const mockDelete = jest.fn().mockReturnThis()
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: { id: 'vote-1' } }),
      delete: mockDelete,
    })
    mockDelete.mockReturnValue({
      eq: jest.fn().mockReturnThis(),
    })

    render(<VoteButton postId="post-1" initialCount={5} />)

    // Wait for initial vote check
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('text-rose-600')
    })

    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument()
    })
  })

  it('does nothing when user is not logged in', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<VoteButton postId="post-1" initialCount={5} />)

    await userEvent.click(screen.getByRole('button'))

    // Count should remain unchanged
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('works with commentId instead of postId', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<VoteButton commentId="comment-1" initialCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
