/**
 * @file page.tsx
 * @description FAQ page
 * @module app/faq/page
 */

import { PageHeader } from '@/components/ui/PageHeader';

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="FAQ"
        title={
          <>
            GOT <span className="text-gold-gradient">QUESTIONS?</span>
          </>
        }
        subtitle="Everything you need to know about GettUpp ENT."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          {/* FAQ Accordion Placeholder */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
            <p className="text-gray-400">An accordion-style FAQ component will go here.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
