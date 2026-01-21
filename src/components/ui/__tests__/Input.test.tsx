import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('accepts user input', async () => {
    render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText('Type here')

    await userEvent.type(input, 'hello')
    expect(input).toHaveValue('hello')
  })

  it('displays error message when error prop is set', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('applies error styling when error prop is set', () => {
    render(<Input error="Error" data-testid="error-input" />)
    const input = screen.getByTestId('error-input')
    expect(input).toHaveClass('border-rose-400')
  })

  it('applies normal border when no error', () => {
    render(<Input data-testid="normal-input" />)
    const input = screen.getByTestId('normal-input')
    expect(input).toHaveClass('border-stone-300')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('forwards ref to input element', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('passes through HTML input attributes', () => {
    render(<Input type="email" required data-testid="email-input" />)
    const input = screen.getByTestId('email-input')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toBeRequired()
  })

  it('calls onChange when value changes', async () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} placeholder="Test" />)

    await userEvent.type(screen.getByPlaceholderText('Test'), 'a')
    expect(handleChange).toHaveBeenCalled()
  })
})
