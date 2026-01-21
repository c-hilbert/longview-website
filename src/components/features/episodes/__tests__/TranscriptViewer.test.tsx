import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TranscriptViewer } from '../TranscriptViewer'

const mockTranscript = `[00:00:00] Host: Welcome to the show.
[00:00:05] Guest: Thanks for having me.
[00:00:10] Host: Let's dive into today's topic.
[00:00:15] Guest: Sounds great. I've been looking forward to this discussion.`

describe('TranscriptViewer', () => {
  it('renders transcript content', () => {
    render(<TranscriptViewer transcript={mockTranscript} />)
    expect(screen.getByText(/Welcome to the show/)).toBeInTheDocument()
  })

  it('renders transcript heading', () => {
    render(<TranscriptViewer transcript={mockTranscript} />)
    expect(screen.getByText('Transcript')).toBeInTheDocument()
  })

  it('shows placeholder when no transcript provided', () => {
    render(<TranscriptViewer transcript={null} />)
    expect(screen.getByText('No transcript available for this episode.')).toBeInTheDocument()
  })

  it('shows placeholder for empty transcript', () => {
    render(<TranscriptViewer transcript="" />)
    expect(screen.getByText('No transcript available for this episode.')).toBeInTheDocument()
  })

  it('renders expand/collapse button', () => {
    render(<TranscriptViewer transcript={mockTranscript} />)
    expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument()
  })

  it('expands transcript when button is clicked', async () => {
    render(<TranscriptViewer transcript={mockTranscript} />)

    const button = screen.getByRole('button', { name: /expand/i })
    await userEvent.click(button)

    expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument()
  })

  it('preserves line breaks in transcript', () => {
    render(<TranscriptViewer transcript={mockTranscript} />)
    const container = screen.getByTestId('transcript-content')
    expect(container).toHaveClass('whitespace-pre-wrap')
  })
})
