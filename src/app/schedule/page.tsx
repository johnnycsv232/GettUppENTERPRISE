/**
 * @file page.tsx
 * @description Booking and scheduling page
 * @module app/schedule/page
 */

import { PageHeader } from '@/components/ui/PageHeader';

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="BOOK YOUR SHOOT"
        title={
          <>
            SECURE YOUR <span className="text-gold-gradient">DATE</span>
          </>
        }
        subtitle="Select your service and preferred time slot. A deposit is required to lock in the team."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Step Indicator Placeholder */}
          <div className="text-center mb-12">
            <p className="text-gray-400">Step Indicator Placeholder</p>
          </div>

          {/* Package Selection Placeholder */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10 mb-8">
            <h3 className="text-2xl font-bold mb-4">Step 1: Select Package</h3>
            <p className="text-gray-400">Package selection UI will go here.</p>
          </div>

          {/* Calendar Placeholder */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10 mb-8">
            <h3 className="text-2xl font-bold mb-4">Step 2: Choose Date & Time</h3>
            <p className="text-gray-400">Calendar and time slot UI will go here.</p>
          </div>

          {/* Payment Placeholder */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Step 3: Payment</h3>
            <p className="text-gray-400">Stripe payment integration will go here.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
