# GettUpp ENT - CLI Command Reference

## 🚀 Vercel (Deployment)

```bash
# Login
vercel login

# Deploy preview
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull .env.local

# View deployment logs
vercel logs [deployment-url]

# List deployments
vercel ls

# Rollback deployment
vercel rollback

# Add environment variable
vercel env add STRIPE_SECRET_KEY
```

## 💳 Stripe (Payments)

```bash
# Login
stripe login

# Listen for webhooks (development)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# List subscriptions
stripe subscriptions list --limit 10

# List customers
stripe customers list --limit 10

# Check balance
stripe balance retrieve

# List recent payments
stripe payment_intents list --limit 5

# Create test payment
stripe payment_intents create --amount 34500 --currency usd

# Trigger test webhook events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed

# View webhook logs
stripe logs tail

# List products
stripe products list

# Create product
stripe products create --name "Pilot Package" --description "One-time pilot shoot"

# Create price
stripe prices create --product prod_xxx --unit-amount 34500 --currency usd
```

## 🔥 Firebase (Database/Auth/Analytics)

```bash
# Login
firebase login

# List projects
firebase projects:list

# Select project
firebase use gettapp-production

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Export Firestore data
firebase firestore:export gs://bucket-name/backup

# Delete all documents (careful!)
firebase firestore:delete --all-collections

# Start local emulators
firebase emulators:start

# Start emulators with data persistence
firebase emulators:start --import=./emulator-data --export-on-exit

# View Firebase Analytics
firebase analytics:report

# Deploy hosting
firebase deploy --only hosting
```

## 📦 npm Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 🔄 Common Workflows

### Deploy to Production
```bash
git add .
git commit -m "feat: update content"
git push origin main
vercel --prod
```

### Test Stripe Webhooks Locally
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: Trigger events
stripe trigger checkout.session.completed
```

### Sync Environment Variables
```bash
# Pull from Vercel
vercel env pull .env.local

# Push to Vercel
vercel env add STRIPE_SECRET_KEY production
```

### Database Backup
```bash
# Export to GCS
firebase firestore:export gs://gettapp-backups/$(date +%Y%m%d)

# Import from backup
firebase firestore:import gs://gettapp-backups/20241204
```

## 🔑 Environment Variables Required

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_APP_URL=https://gettapp.com
```
