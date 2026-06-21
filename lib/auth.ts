import { NextRequest } from 'next/server'

/**
 * Returns true if the request carries a valid admin session cookie.
 * Use this inside any /api/admin/* Route Handler to block direct,
 * unauthenticated calls that bypass the UI and middleware.
 */
export function isAdminRequest(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')
  return !!session && session.value === process.env.ADMIN_PASSWORD
}