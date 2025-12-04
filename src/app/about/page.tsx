/**
 * @file page.tsx
 * @description About GettUpp ENT page
 * @module app/about/page
 */

import { PageHeader } from '@/components/ui/PageHeader';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="ABOUT US"
        title={
          <>
            WE DON'T JUST POST. <span className="text-gold-gradient">WE PACK VENUES.</span>
          </>
        }
        subtitle="Learn the story behind Minneapolis&apos;s premier nightlife content engine."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Founder Story Placeholder */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10 mb-8">
            <h3 className="text-2xl font-bold mb-4">Founder Story</h3>
            <p className="text-gray-400">Content about Johnny Cage and the company&apos;s origins will go here.</p>
          </div>

          {/* Mission Placeholder */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-400">Content about the company&apos;s mission and values will go here.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
