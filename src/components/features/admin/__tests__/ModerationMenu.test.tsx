import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModerationMenu } from '../ModerationMenu'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ModerationMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
  })

  it('renders menu button', () => {
    render(<ModerationMenu postId="post-1" isLocked={false} />)
    expect(screen.getByRole('button', { name: /moderation/i })).toBeInTheDocument()
  })

  it('shows menu options when clicked', async () => {
    render(<ModerationMenu postId="post-1" isLocked={false} />)

    await userEvent.click(screen.getByRole('button', { name: /moderation/i }))

    expect(screen.getByText('Lock Post')).toBeInTheDocument()
    expect(screen.getByText('Delete Post')).toBeInTheDocument()
  })

  it('shows Unlock option when post is locked', async () => {
    render(<ModerationMenu postId="post-1" isLocked={true} />)

    await userEvent.click(screen.getByRole('button', { name: /moderation/i }))

    expect(screen.getByText('Unlock Post')).toBeInTheDocument()
  })

  it('calls lock API when Lock is clicked', async () => {
    render(<ModerationMenu postId="post-1" isLocked={false} />)

    await userEvent.click(screen.getByRole('button', { name: /moderation/i }))
    await userEvent.click(screen.getByText('Lock Post'))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/posts/post-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked: true }),
      })
    })
  })

  it('calls unlock API when Unlock is clicked', async () => {
    render(<ModerationMenu postId="post-1" isLocked={true} />)

    await userEvent.click(screen.getByRole('button', { name: /moderation/i }))
    await userEvent.click(screen.getByText('Unlock Post'))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/posts/post-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locked: false }),
      })
    })
  })

  it('shows confirmation before delete', async () => {
    render(<ModerationMenu postId="post-1" isLocked={false} />)

    await userEvent.click(screen.getByRole('button', { name: /moderation/i }))
    await userEvent.click(screen.getByText('Delete Post'))

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('calls delete API when confirmed', async () => {
    render(<ModerationMenu postId="post-1" isLocked={false} />)

    await userEvent.click(screen.getByRole('button', { name: /moderation/i }))
    await userEvent.click(screen.getByText('Delete Post'))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/posts/post-1', {
        method: 'DELETE',
      })
    })
  })

  it('cancels delete when cancelled', async () => {
    render(<ModerationMenu postId="post-1" isLocked={false} />)

    await userEvent.click(screen.getByRole('button', { name: /moderation/i }))
    await userEvent.click(screen.getByText('Delete Post'))
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(mockFetch).not.toHaveBeenCalled()
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()
  })

  it('calls onAction callback after successful action', async () => {
    const onAction = jest.fn()
    render(<ModerationMenu postId="post-1" isLocked={false} onAction={onAction} />)

    await userEvent.click(screen.getByRole('button', { name: /moderation/i }))
    await userEvent.click(screen.getByText('Lock Post'))

    await waitFor(() => {
      expect(onAction).toHaveBeenCalled()
    })
  })
})
