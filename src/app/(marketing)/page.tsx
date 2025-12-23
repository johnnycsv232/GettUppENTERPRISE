/**
 * @file page.tsx
 * @description GettUpp ENT Landing Page - Full marketing page with all sections
 * @module app/(marketing)/page
 */

import {
	FinalCTASection,
	FounderSection,
	HeroSection,
	PilotOfferSection,
	PricingSection,
	ROISection,
	TrustSection,
} from "@/components/landing";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
	return (
		<main className="min-h-screen bg-[var(--brand-ink)]">
			{/* Hero with 3D background */}
			<HeroSection />

			{/* Trust / Worked With */}
			<TrustSection />

			{/* Johnny Cage Founder Story */}
			<FounderSection />

			{/* ROI Math Section */}
			<ROISection />

			{/* Pilot Offer (dedicated section) */}
			<PilotOfferSection />

			{/* Pricing Tiers */}
			<PricingSection />

			{/* Final CTA */}
			<FinalCTASection />

			{/* Footer */}
			<Footer />
		</main>
	);
}
