/**
 * @file middleware.ts
 * @description Next.js Edge Middleware for route protection with JWT validation
 * @module middleware
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Routes that require authentication
 * Any route starting with these paths will be protected
 */
const protectedRoutes = ["/admin", "/ops", "/api/agents"];

/**
 * Public routes that should never be protected
 * (explicit allowlist for clarity)
 */
const _publicRoutes = ["/", "/login", "/pilot-intake", "/api/leads"];

/**
 * Middleware function - runs on Edge runtime for every matched request
 * @param {NextRequest} request - Incoming request
 * @returns {NextResponse} Response (redirect or pass-through)
 */
export function middleware(request: NextRequest): NextResponse {
	const { pathname } = request.nextUrl;

	// Check if route requires authentication
	const isProtected = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (isProtected) {
		// Check for auth token cookie
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			// No token - redirect to login
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}

		// Basic JWT structure validation (full validation happens server-side)
		// JWT format: header.payload.signature
		const jwtParts = token.split(".");
		if (jwtParts.length !== 3) {
			// Invalid token format - clear it and redirect
			const response = NextResponse.redirect(new URL("/login", request.url));
			response.cookies.delete("auth-token");
			return response;
		}

		// Check token expiration (decode payload without verification for quick check)
		try {
			const payload = JSON.parse(atob(jwtParts[1]));
			const exp = payload.exp;
			if (exp && Date.now() >= exp * 1000) {
				// Token expired - clear and redirect
				const response = NextResponse.redirect(new URL("/login", request.url));
				response.cookies.delete("auth-token");
				return response;
			}
		} catch {
			// Invalid payload - continue to server-side validation
		}
	}

	// Add security headers to all responses
	const response = NextResponse.next();

	// Security headers
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

	return response;
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
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
