/**
 * @file page.tsx
 * @description Privacy Policy page
 * @module app/privacy/page
 */

import { PageHeader } from '@/components/ui/PageHeader';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="LEGAL"
        title={
          <>
            PRIVACY <span className="text-gold-gradient">POLICY</span>
          </>
        }
        subtitle="Your privacy is important to us."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-invert lg:prose-xl">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information to provide and improve our services.
            </p>
            {/* More privacy content will be added here */}
          </div>
        </div>
      </section>
    </main>
  );
}
