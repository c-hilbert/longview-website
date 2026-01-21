import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '../Textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Textarea label="Description" />)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('accepts user input', async () => {
    render(<Textarea placeholder="Type here" />)
    const textarea = screen.getByPlaceholderText('Type here')

    await userEvent.type(textarea, 'hello world')
    expect(textarea).toHaveValue('hello world')
  })

  it('displays error message when error prop is set', () => {
    render(<Textarea error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('applies error styling when error prop is set', () => {
    render(<Textarea error="Error" data-testid="error-textarea" />)
    const textarea = screen.getByTestId('error-textarea')
    expect(textarea).toHaveClass('border-rose-400')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('forwards ref to textarea element', () => {
    const ref = { current: null } as React.RefObject<HTMLTextAreaElement>
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })
})
