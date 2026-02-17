import { render, screen } from '@testing-library/react'
import { MissionSection } from '../MissionSection'

describe('MissionSection', () => {
  it('renders the section heading', () => {
    render(<MissionSection />)
    expect(screen.getByRole('heading', { name: 'Our Mission' })).toBeInTheDocument()
  })

  it('renders the mission statement', () => {
    render(<MissionSection />)
    expect(screen.getByText(/In an age of fragmented attention/)).toBeInTheDocument()
  })

  it('renders all three value cards', () => {
    render(<MissionSection />)
    expect(screen.getByRole('heading', { name: 'Depth Over Speed' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Expert Voices' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Curated Quality' })).toBeInTheDocument()
  })

  it('renders value card descriptions', () => {
    render(<MissionSection />)
    expect(screen.getByText(/Conversations that take time to explore ideas fully/)).toBeInTheDocument()
    expect(screen.getByText(/Access to leading thinkers/)).toBeInTheDocument()
    expect(screen.getByText(/Every episode meticulously produced/)).toBeInTheDocument()
  })
})
