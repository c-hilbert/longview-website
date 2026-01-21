import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewDiscussionPage from '../discussions/new/page'

// Mock next/navigation
const mockPush = jest.fn()
const mockBack = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}))

// Mock supabase client
const mockUser = { id: 'test-user-id' }
const mockInsert = jest.fn()
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

describe('NewDiscussionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [] }),
      insert: mockInsert,
    })
  })

  it('renders page title', () => {
    render(<NewDiscussionPage />)
    expect(screen.getByText('Start a Discussion')).toBeInTheDocument()
  })

  it('renders title input', () => {
    render(<NewDiscussionPage />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('What would you like to discuss?')).toBeInTheDocument()
  })

  it('renders body textarea', () => {
    render(<NewDiscussionPage />)
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Share your thoughts, questions, or insights...')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<NewDiscussionPage />)
    expect(screen.getByRole('button', { name: 'Create Discussion' })).toBeInTheDocument()
  })

  it('renders cancel button', () => {
    render(<NewDiscussionPage />)
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('calls router.back when cancel is clicked', async () => {
    render(<NewDiscussionPage />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(mockBack).toHaveBeenCalled()
  })

  it('allows typing in form fields', async () => {
    render(<NewDiscussionPage />)

    const titleInput = screen.getByPlaceholderText('What would you like to discuss?')
    const bodyTextarea = screen.getByPlaceholderText('Share your thoughts, questions, or insights...')

    await userEvent.type(titleInput, 'Test Discussion')
    await userEvent.type(bodyTextarea, 'This is a test discussion body.')

    expect(titleInput).toHaveValue('Test Discussion')
    expect(bodyTextarea).toHaveValue('This is a test discussion body.')
  })

  it('shows error when user is not logged in', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

    render(<NewDiscussionPage />)

    await userEvent.type(screen.getByPlaceholderText('What would you like to discuss?'), 'Test')
    await userEvent.type(screen.getByPlaceholderText('Share your thoughts, questions, or insights...'), 'Test body')
    await userEvent.click(screen.getByRole('button', { name: 'Create Discussion' }))

    await waitFor(() => {
      expect(screen.getByText('You must be logged in to create a discussion')).toBeInTheDocument()
    })
  })

  it('submits form and redirects on success', async () => {
    mockInsert.mockResolvedValue({ error: null })

    render(<NewDiscussionPage />)

    await userEvent.type(screen.getByPlaceholderText('What would you like to discuss?'), 'Test Discussion')
    await userEvent.type(screen.getByPlaceholderText('Share your thoughts, questions, or insights...'), 'Test body content')
    await userEvent.click(screen.getByRole('button', { name: 'Create Discussion' }))

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Discussion',
          body: 'Test body content',
          author_id: 'test-user-id',
        })
      )
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/discussions/'))
    })
  })

  it('shows error message on submission failure', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'Database error' } })

    render(<NewDiscussionPage />)

    await userEvent.type(screen.getByPlaceholderText('What would you like to discuss?'), 'Test Discussion')
    await userEvent.type(screen.getByPlaceholderText('Share your thoughts, questions, or insights...'), 'Test body content')
    await userEvent.click(screen.getByRole('button', { name: 'Create Discussion' }))

    await waitFor(() => {
      expect(screen.getByText('Database error')).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    mockInsert.mockImplementation(() => new Promise(() => {}))

    render(<NewDiscussionPage />)

    await userEvent.type(screen.getByPlaceholderText('What would you like to discuss?'), 'Test')
    await userEvent.type(screen.getByPlaceholderText('Share your thoughts, questions, or insights...'), 'Test')
    await userEvent.click(screen.getByRole('button', { name: 'Create Discussion' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled()
    })
  })

  it('renders series dropdown when series exist', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [
          { id: 'series-1', name: 'Test Series', slug: 'test-series' },
          { id: 'series-2', name: 'Another Series', slug: 'another-series' },
        ],
      }),
      insert: mockInsert,
    })

    render(<NewDiscussionPage />)

    await waitFor(() => {
      expect(screen.getByText('Related Series (optional)')).toBeInTheDocument()
      expect(screen.getByText('Test Series')).toBeInTheDocument()
      expect(screen.getByText('Another Series')).toBeInTheDocument()
    })
  })
})
