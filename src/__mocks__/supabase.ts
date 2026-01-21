// Mock Supabase client for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: { username: 'testuser' },
}

export const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({ data: [], error: null }),
  })),
}

export const createClient = jest.fn(() => mockSupabase)
