/**
 * @file env.mjs
 * @description Environment variable validation with Zod - crashes app with helpful errors if misconfigured
 * @module env
 */

import { z } from 'zod';

const envSchema = z.object({
  // Firebase Client SDK (public)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, '❌ NEXT_PUBLIC_FIREBASE_API_KEY not set. Add to .env.local'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, '❌ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN not set'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, '❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID not set'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, '❌ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET not set'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, '❌ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID not set'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, '❌ NEXT_PUBLIC_FIREBASE_APP_ID not set'),
  
  // Firebase Admin SDK (server-only)
  FIREBASE_ADMIN_PROJECT_ID: z.string().min(1, '❌ FIREBASE_ADMIN_PROJECT_ID not set. Add to Vercel secrets.'),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email('❌ FIREBASE_ADMIN_CLIENT_EMAIL must be valid email'),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string()
    .min(1, '❌ FIREBASE_ADMIN_PRIVATE_KEY not set. Add to Vercel secrets.')
    .transform(key => key.replace(/\\n/g, '\n')),
  
  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string()
    .startsWith('pk_', '❌ STRIPE_PUBLISHABLE_KEY must start with pk_')
    .optional(),
  STRIPE_SECRET_KEY: z.string()
    .startsWith('sk_', '❌ STRIPE_SECRET_KEY must start with sk_')
    .optional(),
  STRIPE_WEBHOOK_SECRET: z.string()
    .startsWith('whsec_', '❌ STRIPE_WEBHOOK_SECRET must start with whsec_')
    .optional(),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
});

/**
 * Validated environment variables
 * App crashes with helpful error if any required var is missing
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `  ${e.path.join('.')}: ${e.message}`).join('\n');
      console.error('\n🚨 Environment Variable Validation Failed:\n' + messages + '\n');
      throw new Error('Invalid environment configuration. Check the errors above.');
    }
    throw error;
  }
}

export const env = validateEnv();
