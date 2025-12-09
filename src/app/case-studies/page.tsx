/**
 * @file page.tsx
 * @description Case studies page
 * @module app/case-studies/page
 */

import { PageHeader } from '@/components/ui/PageHeader';

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="CASE STUDIES"
        title={
          <>
            REAL VENUES. <span className="text-gold-gradient">REAL RESULTS.</span>
          </>
        }
        subtitle="See how we've helped Minneapolis venues pack their dance floors."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Case Study 1 Placeholder */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10 mb-8">
            <h3 className="text-2xl font-bold mb-4">The Warehouse: +105% Engagement</h3>
            <p className="text-gray-400">Detailed case study content will go here.</p>
          </div>

          {/* Case Study 2 Placeholder */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Vanquish: +28% Bookings</h3>
            <p className="text-gray-400">Detailed case study content will go here.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
