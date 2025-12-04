/**
 * @file page.tsx
 * @description Terms of Service page
 * @module app/terms/page
 */

import { PageHeader } from '@/components/ui/PageHeader';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="LEGAL"
        title={
          <>
            TERMS OF <span className="text-gold-gradient">SERVICE</span>
          </>
        }
        subtitle="Please read our terms of service carefully."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-invert lg:prose-xl">
            <h2>1. Introduction</h2>
            <p>
              Welcome to GettUpp ENT. By accessing our website, you agree to
              these terms of service.
            </p>
            {/* More terms content will be added here */}
          </div>
        </div>
      </section>
    </main>
  );
}
