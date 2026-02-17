import { render, screen } from '@testing-library/react'
import { HeroSection } from '../HeroSection'

describe('HeroSection', () => {
  it('renders the company name', () => {
    render(<HeroSection />)
    expect(screen.getByText('Longview Investigations')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<HeroSection />)
    expect(screen.getByText('Context is everything')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<HeroSection />)
    expect(screen.getByText(/In-depth investigative journalism/i)).toBeInTheDocument()
  })

  it('renders the logo circle', () => {
    const { container } = render(<HeroSection />)
    const logo = container.querySelector('.rounded-full')
    expect(logo).toBeInTheDocument()
    expect(screen.getByText('LV')).toBeInTheDocument()
  })
})
