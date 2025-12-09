/**
 * @file page.tsx
 * @description Contact page
 * @module app/contact/page
 */

import { PageHeader } from '@/components/ui/PageHeader';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="CONTACT"
        title={
          <>
            LET&apos;S <span className="text-gold-gradient">TALK</span>
          </>
        }
        subtitle="We're ready to help you pack your venue."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Contact Form Placeholder */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Send Us a Message</h3>
            <p className="text-gray-400">A contact form component will go here.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
