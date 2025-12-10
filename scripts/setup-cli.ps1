# GettUpp ENT - CLI Setup Script
# Run: .\scripts\setup-cli.ps1

Write-Host "🚀 GettUpp ENT CLI Setup" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

# Check Node.js
Write-Host "`n📦 Checking Node.js..." -ForegroundColor Cyan
node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install global CLIs
Write-Host "`n📦 Installing Vercel CLI..." -ForegroundColor Cyan
npm install -g vercel

Write-Host "`n📦 Installing Stripe CLI..." -ForegroundColor Cyan
npm install -g stripe

Write-Host "`n📦 Installing Firebase CLI..." -ForegroundColor Cyan
npm install -g firebase-tools

# Login prompts
Write-Host "`n🔐 CLI Authentication" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

Write-Host "`n1. Vercel Login:" -ForegroundColor Cyan
Write-Host "   Run: vercel login" -ForegroundColor White

Write-Host "`n2. Stripe Login:" -ForegroundColor Cyan  
Write-Host "   Run: stripe login" -ForegroundColor White

Write-Host "`n3. Firebase Login:" -ForegroundColor Cyan
Write-Host "   Run: firebase login" -ForegroundColor White

# Quick reference
Write-Host "`n📋 Quick Reference Commands" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

Write-Host "`n🚀 VERCEL (Deployment)" -ForegroundColor Magenta
Write-Host "   vercel              # Preview deploy"
Write-Host "   vercel --prod       # Production deploy"
Write-Host "   vercel env pull     # Pull env vars"
Write-Host "   vercel logs         # View logs"

Write-Host "`n💳 STRIPE (Payments)" -ForegroundColor Magenta
Write-Host "   stripe login                    # Authenticate"
Write-Host "   stripe listen --forward-to localhost:3000/api/webhooks/stripe"
Write-Host "   stripe subscriptions list       # List subs"
Write-Host "   stripe balance retrieve         # Check balance"
Write-Host "   stripe trigger checkout.session.completed  # Test webhook"

Write-Host "`n🔥 FIREBASE (Database/Analytics)" -ForegroundColor Magenta
Write-Host "   firebase login                  # Authenticate"
Write-Host "   firebase projects:list          # List projects"
Write-Host "   firebase deploy --only firestore:rules"
Write-Host "   firebase firestore:delete --all-collections"
Write-Host "   firebase emulators:start        # Local dev"

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start development server" -ForegroundColor White
