import { isAdmin, isStaff, canModerate } from '../admin'

describe('admin utilities', () => {
  describe('isAdmin', () => {
    it('returns true for admin role', () => {
      expect(isAdmin({ role: 'admin' })).toBe(true)
    })

    it('returns false for staff role', () => {
      expect(isAdmin({ role: 'staff' })).toBe(false)
    })

    it('returns false for user role', () => {
      expect(isAdmin({ role: 'user' })).toBe(false)
    })

    it('returns false for null profile', () => {
      expect(isAdmin(null)).toBe(false)
    })

    it('returns false for undefined role', () => {
      expect(isAdmin({ role: undefined })).toBe(false)
    })
  })

  describe('isStaff', () => {
    it('returns true for staff role', () => {
      expect(isStaff({ role: 'staff' })).toBe(true)
    })

    it('returns true for admin role', () => {
      expect(isStaff({ role: 'admin' })).toBe(true)
    })

    it('returns false for user role', () => {
      expect(isStaff({ role: 'user' })).toBe(false)
    })

    it('returns false for null profile', () => {
      expect(isStaff(null)).toBe(false)
    })
  })

  describe('canModerate', () => {
    it('returns true for admin', () => {
      expect(canModerate({ role: 'admin' })).toBe(true)
    })

    it('returns true for staff', () => {
      expect(canModerate({ role: 'staff' })).toBe(true)
    })

    it('returns false for regular user', () => {
      expect(canModerate({ role: 'user' })).toBe(false)
    })

    it('returns false for null profile', () => {
      expect(canModerate(null)).toBe(false)
    })
  })
})
