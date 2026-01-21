import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileMenu } from '../MobileMenu'

describe('MobileMenu', () => {
  it('renders toggle button', () => {
    render(<MobileMenu isLoggedIn={false} />)
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument()
  })

  it('shows menu when toggled', async () => {
    render(<MobileMenu isLoggedIn={false} />)

    await userEvent.click(screen.getByRole('button', { name: /toggle menu/i }))

    expect(screen.getByText('Discussions')).toBeInTheDocument()
    expect(screen.getByText('Archive')).toBeInTheDocument()
    expect(screen.getByText('Guidelines')).toBeInTheDocument()
  })

  it('shows auth links when not logged in', async () => {
    render(<MobileMenu isLoggedIn={false} />)

    await userEvent.click(screen.getByRole('button', { name: /toggle menu/i }))

    expect(screen.getByText('Sign in')).toBeInTheDocument()
    expect(screen.getByText('Sign up')).toBeInTheDocument()
  })

  it('hides auth links when logged in', async () => {
    render(<MobileMenu isLoggedIn={true} />)

    await userEvent.click(screen.getByRole('button', { name: /toggle menu/i }))

    expect(screen.queryByText('Sign in')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument()
  })

  it('closes menu when link is clicked', async () => {
    render(<MobileMenu isLoggedIn={false} />)

    await userEvent.click(screen.getByRole('button', { name: /toggle menu/i }))
    expect(screen.getByText('Discussions')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Discussions'))
    expect(screen.queryByText('Archive')).not.toBeInTheDocument()
  })

  it('toggles menu open and closed', async () => {
    render(<MobileMenu isLoggedIn={false} />)

    await userEvent.click(screen.getByRole('button', { name: /toggle menu/i }))
    expect(screen.getByText('Discussions')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /toggle menu/i }))
    expect(screen.queryByText('Discussions')).not.toBeInTheDocument()
  })
})
