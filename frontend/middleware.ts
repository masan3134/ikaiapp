import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-based route protection mapping
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // Super Admin only routes
  '/super-admin': ['SUPER_ADMIN'],
  '/admin': ['SUPER_ADMIN'], // /admin redirects - SUPER_ADMIN only

  // Job postings - HR staff and above
  '/job-postings/new': ['HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'],
  '/job-postings/create': ['HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'],
  '/job-postings/edit': ['HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'],

  // Candidates - HR staff and above
  '/candidates': ['HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'],

  // Analysis wizard - HR staff and above
  '/wizard': ['HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'],

  // Analyses - HR staff and above (for viewing past analyses)
  '/analyses': ['HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'],

  // Offers - HR staff and above
  '/offers': ['HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'],

  // Interviews - HR staff and above
  '/interviews': ['HR_SPECIALIST', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'],

  // Team management - Manager and above
  '/team': ['MANAGER', 'ADMIN', 'SUPER_ADMIN'],

  // Analytics - Manager and above
  '/analytics': ['MANAGER', 'ADMIN', 'SUPER_ADMIN'],

  // Reports - Manager and above
  '/reports': ['MANAGER', 'ADMIN', 'SUPER_ADMIN'],

  // Organization settings - ADMIN only (not MANAGER!)
  '/settings/organization': ['ADMIN', 'SUPER_ADMIN'],
  '/settings/billing': ['ADMIN', 'SUPER_ADMIN'],

  // Settings overview - All users can access their own settings
  // But we don't restrict /settings root here since all roles should access their profile settings
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for public routes, static files, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Get user info from cookies (stored by auth system)
  const userCookie = request.cookies.get('user')?.value;

  if (!userCookie) {
    // No user cookie - redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch (e) {
    // Invalid user cookie - redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const userRole = user?.role;

  if (!userRole) {
    // No role - redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check if route requires specific roles
  for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    // Check if current path starts with protected route
    if (pathname.startsWith(route)) {
      // Check if user role is in allowed roles
      if (!allowedRoles.includes(userRole)) {
        // User doesn't have permission - redirect to dashboard
        const response = NextResponse.redirect(new URL('/dashboard', request.url));

        // Add a header to indicate why redirect happened (for debugging)
        response.headers.set('X-Redirect-Reason', 'insufficient-permissions');
        response.headers.set('X-Required-Roles', allowedRoles.join(','));
        response.headers.set('X-User-Role', userRole);

        return response;
      }

      // User has permission - allow access
      break;
    }
  }

  // Allow access if no restrictions found
  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
