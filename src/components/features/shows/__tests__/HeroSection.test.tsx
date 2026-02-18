import { render, screen } from '@testing-library/react'
import { HeroSection } from '../HeroSection'

// Mock the PlatformLinks component
jest.mock('../PlatformLinks', () => ({
  PlatformLinks: () => <div data-testid="platform-links">Platform Links</div>
}))

describe('HeroSection', () => {
  it('renders the tagline', () => {
    render(<HeroSection />)
    expect(screen.getByText('Longview Podcast Network')).toBeInTheDocument()
  })

  it('renders the main headline', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { name: 'How did we get here?' })).toBeInTheDocument()
  })

  it('renders the subheadline', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Longview is for the curious and open minded/)).toBeInTheDocument()
  })

  it('renders platform links', () => {
    render(<HeroSection />)
    expect(screen.getByTestId('platform-links')).toBeInTheDocument()
  })
})
