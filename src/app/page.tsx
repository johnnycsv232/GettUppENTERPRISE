/**
 * @file page.tsx
 * @description GettUpp ENT - Ultimate Landing Page
 * @module app/page
 */

import {
	AboutFounder,
	FAQ,
	HowItWorks,
	PortfolioPreview,
	PremiumPricing,
	ProblemSolution,
	ROICalculator,
	Testimonials,
	UltimateCTA,
	UltimateHero,
} from "@/components/landing";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
	return (
		<main className="min-h-screen bg-[#0B0B0D]">
			{/* Hero with 3D nightlife scene */}
			<UltimateHero />

			{/* Problem / Solution contrast */}
			<ProblemSolution />

			{/* About Johnny Cage - Founder */}
			<AboutFounder />

			{/* How It Works - Process steps */}
			<HowItWorks />

			{/* Portfolio / Gallery preview */}
			<PortfolioPreview />

			{/* Testimonials carousel */}
			<Testimonials />

			{/* ROI Calculator with animated numbers */}
			<ROICalculator />

			{/* Premium Pricing tiers */}
			<PremiumPricing />

			{/* FAQ Accordion */}
			<FAQ />

			{/* Final CTA */}
			<UltimateCTA />

			{/* Footer */}
			<Footer />
		</main>
	);
}
