/**
 * @file auth-api.ts
 * @description API route authentication utilities
 * @module lib/security/auth-api
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../firebase-admin';
import { z } from 'zod';

/** Authentication result type */
interface AuthResult {
  success: boolean;
  uid?: string;
  email?: string;
  error?: string;
}

/**
 * Validate Bearer token from request headers
 * @param {NextRequest} request - Incoming request
 * @returns {Promise<AuthResult>} Authentication result
 */
export async function validateAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return { success: false, error: 'No token provided' };
    }

    const auth = adminAuth();
    const decodedToken = await auth.verifyIdToken(token);

    return {
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    console.error('Auth validation error:', error);
    return { success: false, error: 'Invalid or expired token' };
  }
}

/**
 * Create unauthorized response
 * @param {string} message - Error message
 * @returns {NextResponse} JSON response with 401 status
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * Require authentication middleware wrapper
 * @param {NextRequest} request - Incoming request
 * @param {Function} handler - Handler function to call if authenticated
 * @returns {Promise<NextResponse>} Response
 */
export async function withAuth(
  request: NextRequest,
  handler: (uid: string, email?: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const authResult = await validateAuth(request);

  if (!authResult.success || !authResult.uid) {
    return unauthorizedResponse(authResult.error);
  }

  return handler(authResult.uid, authResult.email);
}
