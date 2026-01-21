import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies default medium padding', () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('p-6')
  })

  it('applies small padding when padding="sm"', () => {
    render(<Card padding="sm" data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('p-4')
  })

  it('applies no padding when padding="none"', () => {
    render(<Card padding="none" data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('p-0')
  })

  it('applies base card styles', () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('bg-white', 'border', 'rounded-xl', 'shadow-sm')
  })

  it('accepts additional className', () => {
    render(<Card className="custom-class" data-testid="card">Content</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-class')
  })
})
