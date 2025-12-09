/**
 * @file page.tsx
 * @description Cancellation Policy page
 * @module app/cancellation/page
 */

import { PageHeader } from '@/components/ui/PageHeader';

export default function CancellationPage() {
  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="LEGAL"
        title={
          <>
            CANCELLATION <span className="text-gold-gradient">POLICY</span>
          </>
        }
        subtitle="Please review our cancellation policy."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-invert lg:prose-xl">
            <h2>1. Pilot Shoots</h2>
            <p>
              Cancellations for Pilot Shoots must be made at least 48 hours in advance for a full refund.
            </p>
            {/* More cancellation content will be added here */}
          </div>
        </div>
      </section>
    </main>
  );
}
