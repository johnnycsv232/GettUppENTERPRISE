/**
 * @file page.tsx
 * @description Checkout success page
 * @module app/checkout/success
 */

import Link from 'next/link';
import { GlassCard, H1, Body, MagneticButton } from '@/components/ui';
import { CheckCircle, Calendar, Mail, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-brand-ink flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <H1 className="text-3xl mb-4">Payment Successful!</H1>
        <Body className="text-gray-400 mb-8">
          Thank you for choosing GettUpp. Your order has been confirmed.
        </Body>

        {/* Next Steps Card */}
        <GlassCard className="text-left mb-8">
          <h3 className="font-semibold text-white mb-4">What happens next?</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <Mail className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Check your email</p>
                <p className="text-sm text-gray-400">
                  You&apos;ll receive a confirmation with your receipt and next steps.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <Calendar className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Schedule your shoot</p>
                <p className="text-sm text-gray-400">
                  We&apos;ll reach out within 24 hours to confirm your preferred date.
                </p>
              </div>
            </li>
          </ul>
        </GlassCard>

        {/* Actions */}
        <div className="space-y-4">
          <Link href="/portal" className="block">
            <MagneticButton variant="gold" size="lg" className="w-full">
              Go to Portal
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </MagneticButton>
          </Link>
          <Link href="/" className="block">
            <MagneticButton variant="outline" className="w-full">
              Back to Home
            </MagneticButton>
          </Link>
        </div>

        {/* Support */}
        <p className="mt-8 text-sm text-gray-500">
          Questions? Email us at{' '}
          <a href="mailto:support@gettuppent.com" className="text-brand-gold hover:underline">
            support@gettuppent.com
          </a>
        </p>
      </div>
    </main>
  );
}
