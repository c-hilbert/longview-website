import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupPage from '../signup/page'

// Mock next/navigation
const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

// Mock supabase client
const mockSignUp = jest.fn()
const mockSignInWithOAuth = jest.fn()
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}))

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders signup form', () => {
    render(<SignupPage />)

    expect(screen.getByText('Create an account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
  })

  it('renders Google signup button', () => {
    render(<SignupPage />)
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  it('renders link to login page', () => {
    render(<SignupPage />)
    const loginLink = screen.getByRole('link', { name: 'Sign in' })
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('allows typing username, email, and password', async () => {
    render(<SignupPage />)

    const usernameInput = screen.getByPlaceholderText('Username')
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')

    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')

    expect(usernameInput).toHaveValue('testuser')
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('calls signUp with username in metadata on form submit', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    render(<SignupPage />)

    await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser')
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { username: 'testuser' },
        },
      })
    })
  })

  it('redirects to home on successful signup', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    render(<SignupPage />)

    await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser')
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('displays error message on failed signup', async () => {
    mockSignUp.mockResolvedValue({
      error: { message: 'Email already in use' }
    })
    render(<SignupPage />)

    await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser')
    await userEvent.type(screen.getByPlaceholderText('Email'), 'existing@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    mockSignUp.mockImplementation(() => new Promise(() => {}))
    render(<SignupPage />)

    await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser')
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Creating account...' })).toBeDisabled()
    })
  })

  it('calls signInWithOAuth when Google button is clicked', async () => {
    render(<SignupPage />)

    await userEvent.click(screen.getByText('Continue with Google'))

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: expect.stringContaining('/auth/callback') },
    })
  })
})
