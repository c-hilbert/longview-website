import { render, screen } from '@testing-library/react'
import { MissionSection } from '../MissionSection'

describe('MissionSection', () => {
  it('renders the section heading', () => {
    render(<MissionSection />)
    expect(screen.getByRole('heading', { name: 'Our Mission' })).toBeInTheDocument()
  })

  it('renders the mission statement', () => {
    render(<MissionSection />)
    expect(screen.getByText(/Longview is politically independent/)).toBeInTheDocument()
  })

  it('renders all three value cards', () => {
    render(<MissionSection />)
    expect(screen.getByRole('heading', { name: 'Intellectual Humility' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Opposing Perspectives' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Prizing Curiosity' })).toBeInTheDocument()
  })

  it('renders value card descriptions', () => {
    render(<MissionSection />)
    expect(screen.getByText(/We practice transparency about what we know/)).toBeInTheDocument()
    expect(screen.getByText(/We believe opposing views are essential/)).toBeInTheDocument()
    expect(screen.getByText(/The lifeblood of our work/)).toBeInTheDocument()
  })
})
