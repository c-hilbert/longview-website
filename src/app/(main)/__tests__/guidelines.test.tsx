import { render, screen } from '@testing-library/react'
import GuidelinesPage from '../guidelines/page'

describe('GuidelinesPage', () => {
  it('renders the page title', () => {
    render(<GuidelinesPage />)
    expect(screen.getByText('Community Guidelines')).toBeInTheDocument()
  })

  it('renders the welcome section', () => {
    render(<GuidelinesPage />)
    expect(screen.getByText('Welcome to Longview')).toBeInTheDocument()
  })

  it('renders all guideline sections', () => {
    render(<GuidelinesPage />)

    expect(screen.getByText('Discussion Guidelines')).toBeInTheDocument()
    expect(screen.getByText('Be Respectful')).toBeInTheDocument()
    expect(screen.getByText('Stay On Topic')).toBeInTheDocument()
    expect(screen.getByText('Cite Your Sources')).toBeInTheDocument()
    expect(screen.getByText('No Self-Promotion')).toBeInTheDocument()
  })

  it('renders voting guidelines', () => {
    render(<GuidelinesPage />)
    expect(screen.getByText('Voting')).toBeInTheDocument()
  })

  it('renders moderation section', () => {
    render(<GuidelinesPage />)
    expect(screen.getByText('Moderation')).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(<GuidelinesPage />)
    expect(screen.getByText('Questions?')).toBeInTheDocument()
    expect(screen.getByText(/community@longviewinvestigations.com/)).toBeInTheDocument()
  })
})
