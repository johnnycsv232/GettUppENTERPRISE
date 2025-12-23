# GettUpp Enterprise

Premium nightlife photography platform for Minneapolis venues. We don't just post—we pack venues.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/johnnycsv232/GettUppENTERPRISE)

## Live Site

**Production:** [gettupp-enterprise.vercel.app](https://gettupp-enterprise.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Auth** | Firebase Authentication |
| **Database** | Firestore |
| **Payments** | Stripe (Checkout + Subscriptions) |
| **Hosting** | Vercel |

---

## Features

- **Pilot Intake Flow** - Lead capture with Stripe payment
- **Pricing Tiers** - Pilot ($345), T1 ($445/mo), T2 ($695/mo), VIP ($995/mo)
- **Client Portal** - Dashboard for managing shoots and content
- **Stripe Webhooks** - Automatic payment processing
- **ROI Calculator** - Interactive cost breakdown
- **Agent API** - Automation orchestration endpoints

---

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase project with Firestore + Auth enabled
- Stripe account (test or live)

### Installation

```bash
# Clone the repo
git clone https://github.com/johnnycsv232/GettUppENTERPRISE.git
cd GettUppENTERPRISE

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` with:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Security
AGENT_SECRET_KEY=
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── checkout/       # Stripe checkout sessions
│   │   ├── webhooks/stripe # Payment webhooks
│   │   └── agents/run      # Agent orchestration
│   ├── login/              # Firebase auth
│   ├── pilot-intake/       # Lead capture form
│   ├── checkout/           # Payment flow
│   └── portal/             # Client dashboard
├── components/
│   ├── ui/                 # Reusable components
│   │   ├── MagneticButton  # Animated CTA buttons
│   │   ├── GlassCard       # Glassmorphism cards
│   │   ├── PricingCard     # Tier pricing display
│   │   └── Typography      # Brand text styles
│   └── sections/           # Page sections
├── lib/
│   ├── firebase.ts         # Client SDK
│   ├── firebase-admin.ts   # Admin SDK
│   ├── stripe.ts           # Payment integration
│   ├── constants/pricing   # Canonical pricing data
│   └── security/           # Rate limiting, auth
└── types/                  # TypeScript interfaces
```

---

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/webhooks/stripe` | POST | Handle payment events |
| `/api/agents/run` | POST | Queue agent tasks |

---

## Pricing Tiers

| Tier | Price | Shoots | Photos | Delivery |
|------|-------|--------|--------|----------|
| **Pilot** | $345 | 1 | 30 | 72h |
| **T1: Friday Nights** | $445/mo | 1 | 30 | 72h |
| **T2: Weekend Warrior** | $695/mo | 2 | 60 | 48h |
| **T3: VIP Partner** | $995/mo | 3 | 80 | 24h |

---

## Deployment

### Vercel (Recommended)

1. Connect repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Stripe Webhook Setup

1. Create webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
2. Enable events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

---

## Brand

| Element | Value |
|---------|-------|
| **Primary** | Ink `#0B0B0D` |
| **Accent** | Gold `#D9AE43` |
| **Highlight** | Pink `#FF3C93` |
| **Headings** | Oswald |
| **Body** | Inter |

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
```

---

## License

Proprietary - GettUpp Entertainment LLC

---

## Contact

**GettUpp Entertainment**  
Minneapolis, MN  
[gettupp-enterprise.vercel.app](https://gettupp-enterprise.vercel.app)
