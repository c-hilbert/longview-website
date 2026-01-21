import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SeriesForm } from '../SeriesForm'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('SeriesForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'new-series-id' }),
    })
  })

  it('renders form fields', () => {
    render(<SeriesForm />)

    expect(screen.getByPlaceholderText('Series name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('series-slug')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Brief description')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('https://example.com/feed.xml')).toBeInTheDocument()
  })

  it('renders create button for new series', () => {
    render(<SeriesForm />)
    expect(screen.getByRole('button', { name: 'Create Series' })).toBeInTheDocument()
  })

  it('renders update button for existing series', () => {
    render(<SeriesForm series={{ id: '1', name: 'Test', slug: 'test', description: null, rss_feed_url: null }} />)
    expect(screen.getByRole('button', { name: 'Update Series' })).toBeInTheDocument()
  })

  it('populates fields with existing series data', () => {
    render(
      <SeriesForm
        series={{
          id: '1',
          name: 'Test Series',
          slug: 'test-series',
          description: 'A test series',
          rss_feed_url: 'https://example.com/feed.xml',
        }}
      />
    )

    expect(screen.getByPlaceholderText('Series name')).toHaveValue('Test Series')
    expect(screen.getByPlaceholderText('series-slug')).toHaveValue('test-series')
    expect(screen.getByPlaceholderText('Brief description')).toHaveValue('A test series')
    expect(screen.getByPlaceholderText('https://example.com/feed.xml')).toHaveValue('https://example.com/feed.xml')
  })

  it('auto-generates slug from name', async () => {
    render(<SeriesForm />)

    const nameInput = screen.getByPlaceholderText('Series name')
    await userEvent.type(nameInput, 'My New Series')

    expect(screen.getByPlaceholderText('series-slug')).toHaveValue('my-new-series')
  })

  it('submits form with correct data', async () => {
    render(<SeriesForm />)

    await userEvent.type(screen.getByPlaceholderText('Series name'), 'New Series')
    await userEvent.type(screen.getByPlaceholderText('Brief description'), 'Description')
    await userEvent.type(screen.getByPlaceholderText('https://example.com/feed.xml'), 'https://feed.com/rss')
    await userEvent.click(screen.getByRole('button', { name: 'Create Series' }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('New Series'),
      })
    })
  })

  it('shows loading state during submission', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))
    render(<SeriesForm />)

    await userEvent.type(screen.getByPlaceholderText('Series name'), 'Test')
    await userEvent.click(screen.getByRole('button', { name: 'Create Series' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled()
    })
  })

  it('shows error message on failure', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Series already exists' }),
    })

    render(<SeriesForm />)

    await userEvent.type(screen.getByPlaceholderText('Series name'), 'Test')
    await userEvent.click(screen.getByRole('button', { name: 'Create Series' }))

    await waitFor(() => {
      expect(screen.getByText('Series already exists')).toBeInTheDocument()
    })
  })
})
