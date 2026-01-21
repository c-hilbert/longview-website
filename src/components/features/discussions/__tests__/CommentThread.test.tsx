import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentThread } from '../CommentThread'

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

const mockComments = [
  {
    id: 'comment-1',
    body: 'First comment',
    upvote_count: 5,
    created_at: new Date().toISOString(),
    depth: 0,
    parent_id: null,
    author: { username: 'user1' },
  },
  {
    id: 'comment-2',
    body: 'Second comment',
    upvote_count: 3,
    created_at: new Date().toISOString(),
    depth: 0,
    parent_id: null,
    author: { username: 'user2' },
  },
]

describe('CommentThread', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
  })

  it('shows loading state initially', () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue(new Promise(() => {})), // Never resolves
    })

    render(<CommentThread postId="post-1" />)
    expect(screen.getByText('Loading comments...')).toBeInTheDocument()
  })

  it('shows empty state when no comments', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [] }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<CommentThread postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByText('No comments yet. Be the first to share your thoughts.')).toBeInTheDocument()
    })
  })

  it('renders comments when data is loaded', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockComments }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<CommentThread postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument()
      expect(screen.getByText('Second comment')).toBeInTheDocument()
    })
  })

  it('renders comment authors', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockComments }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<CommentThread postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument()
      expect(screen.getByText('user2')).toBeInTheDocument()
    })
  })

  it('renders comment form', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [] }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<CommentThread postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Post Comment' })).toBeInTheDocument()
    })
  })

  it('allows typing in comment textarea', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [] }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<CommentThread postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Add a comment...')
    await userEvent.type(textarea, 'My new comment')

    expect(textarea).toHaveValue('My new comment')
  })

  it('shows reply button on comments', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockComments }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    render(<CommentThread postId="post-1" />)

    await waitFor(() => {
      const replyButtons = screen.getAllByText('Reply')
      expect(replyButtons).toHaveLength(2)
    })
  })
})
