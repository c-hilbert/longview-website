import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EmailSignup } from '../EmailSignup'

describe('EmailSignup', () => {
  it('renders the section heading', () => {
    render(<EmailSignup />)
    expect(screen.getByRole('heading', { name: 'Stay in the loop' })).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<EmailSignup />)
    expect(screen.getByText(/Get new episodes and exclusive content/)).toBeInTheDocument()
  })

  it('renders email input', () => {
    render(<EmailSignup />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('renders subscribe button', () => {
    render(<EmailSignup />)
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('updates email input value', () => {
    render(<EmailSignup />)
    const input = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    expect(input).toHaveValue('test@example.com')
  })

  it('shows loading state when submitting', async () => {
    render(<EmailSignup />)
    const input = screen.getByPlaceholderText('Enter your email')
    const button = screen.getByRole('button', { name: 'Subscribe' })
    
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Subscribing...' })).toBeInTheDocument()
    })
  })

  it('shows success message after submission', async () => {
    render(<EmailSignup />)
    const input = screen.getByPlaceholderText('Enter your email')
    const button = screen.getByRole('button', { name: 'Subscribe' })
    
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/Thanks for subscribing!/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('renders privacy text', () => {
    render(<EmailSignup />)
    expect(screen.getByText(/Join 5,000\+ listeners/)).toBeInTheDocument()
  })
})
