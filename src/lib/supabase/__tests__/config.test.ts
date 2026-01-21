describe('Supabase Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should have NEXT_PUBLIC_SUPABASE_URL set', () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    expect(url).toBeDefined()
    expect(url).not.toBe('')
  })

  it('should have NEXT_PUBLIC_SUPABASE_ANON_KEY set', () => {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(key).toBeDefined()
    expect(key).not.toBe('')
  })

  it('should not use placeholder URL', () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    expect(url).not.toContain('placeholder')
  })

  it('should not use placeholder key', () => {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(key).not.toBe('placeholder-key')
  })

  it('should have valid Supabase URL format', () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (url && !url.includes('placeholder')) {
      expect(url).toMatch(/^https:\/\/[a-z0-9-]+\.supabase\.co$/)
    }
  })
})
