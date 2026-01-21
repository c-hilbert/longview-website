import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from '../Tabs'

const mockTabs = [
  { id: 'recent', label: 'Recent' },
  { id: 'top', label: 'Top' },
  { id: 'unanswered', label: 'Unanswered' },
]

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs tabs={mockTabs} activeTab="recent" onChange={() => {}} />)
    expect(screen.getByText('Recent')).toBeInTheDocument()
    expect(screen.getByText('Top')).toBeInTheDocument()
    expect(screen.getByText('Unanswered')).toBeInTheDocument()
  })

  it('calls onChange with tab id when clicked', async () => {
    const handleChange = jest.fn()
    render(<Tabs tabs={mockTabs} activeTab="recent" onChange={handleChange} />)

    await userEvent.click(screen.getByText('Top'))
    expect(handleChange).toHaveBeenCalledWith('top')
  })

  it('applies active styles to the active tab', () => {
    render(<Tabs tabs={mockTabs} activeTab="recent" onChange={() => {}} />)
    const activeTab = screen.getByText('Recent')
    expect(activeTab).toHaveClass('border-neutral-900', 'text-neutral-900')
  })

  it('applies inactive styles to non-active tabs', () => {
    render(<Tabs tabs={mockTabs} activeTab="recent" onChange={() => {}} />)
    const inactiveTab = screen.getByText('Top')
    expect(inactiveTab).toHaveClass('border-transparent', 'text-neutral-500')
  })

  it('updates active styles when activeTab changes', () => {
    const { rerender } = render(
      <Tabs tabs={mockTabs} activeTab="recent" onChange={() => {}} />
    )

    expect(screen.getByText('Recent')).toHaveClass('border-neutral-900')
    expect(screen.getByText('Top')).toHaveClass('border-transparent')

    rerender(<Tabs tabs={mockTabs} activeTab="top" onChange={() => {}} />)

    expect(screen.getByText('Recent')).toHaveClass('border-transparent')
    expect(screen.getByText('Top')).toHaveClass('border-neutral-900')
  })
})
