import { render, screen } from '@testing-library/react'
import { TeamSection } from '../TeamSection'

describe('TeamSection', () => {
  it('renders the team heading', () => {
    render(<TeamSection />)
    expect(screen.getByText('Team')).toBeInTheDocument()
  })

  it('renders team members', () => {
    render(<TeamSection />)
    expect(screen.getByText('Andy Mills')).toBeInTheDocument()
    expect(screen.getByText('Host & Creator')).toBeInTheDocument()
    
    expect(screen.getByText('Megan Phelps-Roper')).toBeInTheDocument()
    expect(screen.getByText('Host')).toBeInTheDocument()
    
    expect(screen.getByText('Carmen Hilbert')).toBeInTheDocument()
    expect(screen.getByText('Revenue & Business')).toBeInTheDocument()
  })

  it('renders all 5 team members', () => {
    render(<TeamSection />)
    expect(screen.getByText('Andy Mills')).toBeInTheDocument()
    expect(screen.getByText('Megan Phelps-Roper')).toBeInTheDocument()
    expect(screen.getByText('Carmen Hilbert')).toBeInTheDocument()
    expect(screen.getByText('Jake Gorst')).toBeInTheDocument()
    expect(screen.getByText('Andrew Mast')).toBeInTheDocument()
  })
})
