// Mocked auth: two demo identities plus a simple role toggle so the app
// keeps a real notion of guest vs host without a full auth layer.

export type Role = 'guest' | 'host'

export interface DemoUser {
  id: string
  name: string
  initials: string
  color: string
  role: Role
}

export const DEMO_GUEST: DemoUser = {
  id: 'guest-demo',
  name: 'Alex Morgan',
  initials: 'AM',
  color: '#f5c5b8',
  role: 'guest',
}

export const DEMO_HOST: DemoUser = {
  id: 'host-demo',
  name: 'Priya Sharma',
  initials: 'PS',
  color: '#bfe2d0',
  role: 'host',
}

export const userForRole = (role: Role): DemoUser => (role === 'host' ? DEMO_HOST : DEMO_GUEST)
