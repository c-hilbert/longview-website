import { render, screen } from '@testing-library/react'
import HomePage from '../page'

describe('HomePage', () => {
  it('renders the discussions heading', () => {
    render(<HomePage />)
    expect(screen.getByText('Discussions')).toBeInTheDocument()
  })

  it('renders New Discussion link', () => {
    render(<HomePage />)
    const newLink = screen.getByRole('link', { name: 'New Discussion' })
    expect(newLink).toHaveAttribute('href', '/discussions/new')
  })

  it('shows empty state message', () => {
    render(<HomePage />)
    expect(screen.getByText('No discussions yet. Be the first to start a conversation.')).toBeInTheDocument()
  })

  it('renders About Longview sidebar section', () => {
    render(<HomePage />)
    expect(screen.getByText('About Longview')).toBeInTheDocument()
  })

  it('renders Latest Episodes sidebar section', () => {
    render(<HomePage />)
    expect(screen.getByText('Latest Episodes')).toBeInTheDocument()
  })

  it('renders Community Guidelines sidebar section', () => {
    render(<HomePage />)
    expect(screen.getByText('Community Guidelines')).toBeInTheDocument()
  })

  it('has link to full guidelines', () => {
    render(<HomePage />)
    const link = screen.getByRole('link', { name: 'Read full guidelines →' })
    expect(link).toHaveAttribute('href', '/guidelines')
  })
})
