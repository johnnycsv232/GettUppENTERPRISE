# GettUpp Enterprise Architecture

## Overview

GettUpp Enterprise is a Next.js 14+ application with Firebase backend and Stripe payments, designed for managing nightlife photography services.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| Auth | Firebase Authentication |
| Database | Firestore |
| Payments | Stripe (Checkout, Subscriptions, Webhooks) |
| Hosting | Vercel |
| Monitoring | Sentry, Slack Alerts |

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── checkout/       # Stripe checkout
│   │   ├── webhooks/       # Stripe webhooks
│   │   └── agents/         # Agent orchestration
│   ├── login/              # Auth pages
│   ├── portal/             # Client dashboard
│   ├── pilot-intake/       # Lead capture
│   └── checkout/           # Payment flow
├── components/
│   ├── ui/                 # Reusable UI components
│   └── sections/           # Page sections
├── lib/
│   ├── firebase.ts         # Client SDK
│   ├── firebase-admin.ts   # Admin SDK (server only)
│   ├── stripe.ts           # Stripe integration
│   ├── constants/          # Pricing, config
│   ├── security/           # Rate limiting, auth
│   ├── monitoring/         # Alerts, logging
│   └── audit/              # Audit logging
├── types/                  # TypeScript types
└── middleware.ts           # Route protection
```

## Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│   Next.js    │────▶│  Firestore  │
│  (Browser)  │     │  API Routes  │     │  Database   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Stripe    │
                    │   Payments   │
                    └──────────────┘
```

## Authentication Flow

1. User visits `/login`
2. Firebase Auth validates credentials
3. Auth cookie set for middleware
4. Middleware protects `/admin/*`, `/ops/*`, `/portal/*`
5. API routes verify tokens via Firebase Admin SDK

## Payment Flow

1. User selects tier → `/checkout?tier=X`
2. API creates Stripe Checkout Session
3. User completes payment on Stripe
4. Stripe sends webhook to `/api/webhooks/stripe`
5. Webhook creates client/payment records in Firestore
6. User redirected to success page

## Security Layers

1. **Middleware** - Route protection
2. **Rate Limiting** - 100 req/min per IP
3. **Input Validation** - Zod schemas
4. **Auth Headers** - Bearer tokens for APIs
5. **Firestore Rules** - Field-level access
6. **Security Headers** - XSS, CORS, Frame

## Environment Variables

Required in Vercel:

```
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY

# Stripe
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Security
AGENT_SECRET_KEY

# Monitoring
SLACK_WEBHOOK_URL
```

## Scaling Considerations

- **Vercel Edge** - Auto-scaling serverless
- **Firestore** - Automatic scaling with indexes
- **Stripe** - Rate limits apply (100/sec test, 10000/sec live)
- **Rate Limiting** - Upgrade to Redis for distributed limiting

## Disaster Recovery

- **Database** - Daily Firestore backups (30-day retention)
- **Code** - Git history + Vercel deployments
- **Secrets** - Rotated quarterly, stored in Vercel
