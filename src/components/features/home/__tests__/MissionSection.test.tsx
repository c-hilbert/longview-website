import { render, screen } from '@testing-library/react'
import { MissionSection } from '../MissionSection'

describe('MissionSection', () => {
  it('renders the mission heading', () => {
    render(<MissionSection />)
    expect(screen.getByText('Our Mission')).toBeInTheDocument()
  })

  it('renders mission content', () => {
    render(<MissionSection />)
    expect(screen.getByText(/Longview Investigations produces/i)).toBeInTheDocument()
    expect(screen.getByText(/essential context/i)).toBeInTheDocument()
  })
})
