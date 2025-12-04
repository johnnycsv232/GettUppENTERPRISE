/**
 * @file page.tsx
 * @description Services page with detailed pricing tiers
 * @module app/services/page
 */

import { PageHeader } from '@/components/ui/PageHeader';
import { PricingCard } from '@/components/ui/PricingCard';
import { getAllTiers } from '@/lib/constants/pricing';
import { H2, Body } from '@/components/ui';

export default function ServicesPage() {
  const tiers = getAllTiers();

  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="PHOTOGRAPHY SERVICES"
        title={
          <>
            WE OWN YOUR <span className="text-gold-gradient">NIGHTLIFE CONTENT</span>
          </>
        }
        subtitle="Stop chasing flaky freelancers. Predictable content engine for Minneapolis venues. One night to prove it."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier, index) => (
              <PricingCard key={tier.id} tier={tier} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-gray-900">
        <div className="mx-auto max-w-4xl text-center">
          <H2 className="mb-4">WHY WE NEVER MISS</H2>
          <Body className="text-gray-400 mb-8">
            Most photographers are artists. We are an operations company.
          </Body>
          {/* Placeholder for ShotClock visual */}
          <div className="relative aspect-video bg-gray-800 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">ShotClock System Visual Placeholder</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
