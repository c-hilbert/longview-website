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
    expect(screen.getByRole('heading', { name: 'Context is everything' })).toBeInTheDocument()
  })

  it('renders the subheadline', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Long-form interviews that go deeper/)).toBeInTheDocument()
  })

  it('renders platform links', () => {
    render(<HeroSection />)
    expect(screen.getByTestId('platform-links')).toBeInTheDocument()
  })
})
