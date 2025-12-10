/**
 * @file page.tsx
 * @description Checkout page - Creates Stripe checkout session
 * @module app/checkout
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GlassCard, H1, H2, Body, Small, MagneticButton } from '@/components/ui';
import { PRICING_TIERS, getTier, TierId } from '@/lib/constants/pricing';
import { Check, Lock, CreditCard, Shield } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tierParam = searchParams.get('tier') as TierId | null;
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate tier
  const tier = tierParam && PRICING_TIERS[tierParam] ? getTier(tierParam) : null;

  useEffect(() => {
    if (!tier) {
      router.push('/');
    }
  }, [tier, router]);

  if (!tier) {
    return (
      <main className="min-h-screen bg-brand-ink flex items-center justify-center">
        <Body>Loading...</Body>
      </main>
    );
  }

  const handleCheckout = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: tier.id,
          email,
          returnUrl: `${window.location.origin}/checkout/success`,
        }),
      });

      const data = await response.json();

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-ink py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <H1 className="mb-4">Complete Your Order</H1>
          <Body className="text-gray-400">
            Secure checkout powered by Stripe
          </Body>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <GlassCard accent="gold">
            <H2 className="text-xl mb-6">Order Summary</H2>

            {/* Package */}
            <div className="border-b border-white/10 pb-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                  <Small className="text-gray-400">{tier.tagline}</Small>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-brand-gold">{tier.priceDisplay}</span>
                  {tier.interval === 'monthly' && (
                    <span className="text-gray-400">/mo</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {tier.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-brand-gold" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Info */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shoots per month</span>
                <span className="text-white">{tier.shoots}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Photos included</span>
                <span className="text-white">{tier.photos}</span>
              </div>
              {tier.reels > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Reels included</span>
                  <span className="text-white">{tier.reels}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery</span>
                <span className="text-white">{tier.delivery}</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">
                  {tier.interval === 'monthly' ? 'Monthly Total' : 'Total'}
                </span>
                <span className="text-3xl font-bold text-brand-gold">{tier.priceDisplay}</span>
              </div>
              {tier.interval === 'monthly' && (
                <Small className="text-gray-500 mt-2 block">
                  Billed monthly. Cancel anytime.
                </Small>
              )}
            </div>
          </GlassCard>

          {/* Payment */}
          <div className="space-y-6">
            <GlassCard>
              <H2 className="text-xl mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-gold" />
                Payment
              </H2>

              <p className="text-gray-300 mb-6">
                You&apos;ll be redirected to Stripe&apos;s secure checkout to complete your payment.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <MagneticButton
                variant="gold"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Redirecting to Stripe...' : `Pay ${tier.priceDisplay}`}
              </MagneticButton>

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Stripe Verified</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* FAQ */}
            <GlassCard padding="sm">
              <h4 className="font-semibold text-white mb-3">Common Questions</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">When will I be charged?</p>
                  <p className="text-gray-300">
                    {tier.interval === 'monthly' 
                      ? 'Today, then monthly on the same date.'
                      : 'One-time payment today.'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Can I cancel anytime?</p>
                  <p className="text-gray-300">Yes, no questions asked.</p>
                </div>
              </div>
            </GlassCard>

            {/* Back Link */}
            <div className="text-center">
              <button
                onClick={() => router.back()}
                className="text-sm text-gray-500 hover:text-gray-300"
              >
                ← Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-brand-ink flex items-center justify-center">
        <Body>Loading checkout...</Body>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
