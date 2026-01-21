type Role = 'admin' | 'staff' | 'user'

interface Profile {
  role?: Role | string
}

export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === 'admin'
}

export function isStaff(profile: Profile | null): boolean {
  return profile?.role === 'admin' || profile?.role === 'staff'
}

export function canModerate(profile: Profile | null): boolean {
  return isStaff(profile)
}
