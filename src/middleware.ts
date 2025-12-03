/**
 * @file middleware.ts
 * @description Next.js 14 Edge Middleware for route protection
 * @module middleware
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Routes that require authentication
 * Any route starting with these paths will be protected
 */
const protectedRoutes = ['/admin', '/ops', '/api/agents'];

/**
 * Public routes that should never be protected
 * (explicit allowlist for clarity)
 */
const publicRoutes = ['/', '/login', '/pilot-intake', '/api/leads'];

/**
 * Middleware function - runs on Edge runtime for every matched request
 * @param {NextRequest} request - Incoming request
 * @returns {NextResponse} Response (redirect or pass-through)
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Check if route requires authentication
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Check for auth token cookie
    const token = request.cookies.get('auth-token');

    if (!token) {
      // No token - redirect to login
      const loginUrl = new URL('/login', request.url);
      // Preserve the original URL for redirect after login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists - allow request
    // Note: For MVP, we trust token existence = valid session
    // Production: Verify token with Firebase Admin SDK in API routes
  }

  // Non-protected route or authenticated - proceed
  return NextResponse.next();
}

/**
 * Matcher configuration
 * Excludes static files and images for performance
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
