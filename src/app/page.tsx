/**
 * @file page.tsx
 * @description GettUpp Landing Page - Hero + ROI Math + Pricing
 * @module app/page
 */

import { MagneticButton, H1, H2, Body, Small } from '@/components/ui';
import { PricingCard } from '@/components/ui/PricingCard';
import { RoiMath } from '@/components/sections/RoiMath';
import { getAllTiers } from '@/lib/constants/pricing';
import { Shield, Clock, MapPin, Zap, Camera, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const tiers = getAllTiers();

  return (
    <main className="min-h-screen bg-brand-ink">
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl text-center">
          {/* Headline */}
          <H1 className="mb-6 text-4xl md:text-6xl lg:text-7xl">
            We don&apos;t just post.
            <br />
            <span className="text-white">We pack venues.</span>
          </H1>

          {/* Subheadline */}
          <Body className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
            24-72h delivery. Real ROI. Zero excuses.
          </Body>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/pilot-intake">
              <MagneticButton size="lg" variant="gold">
                Start Your Pilot ($345)
              </MagneticButton>
            </Link>
            <Link href="#pricing">
              <MagneticButton size="lg" variant="outline">
                View Pricing
              </MagneticButton>
            </Link>
          </div>

          {/* Proof Chips */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <ProofChip icon={<Zap className="w-4 h-4 text-brand-gold" />} text="79.7K views (90 days)" />
            <ProofChip icon={<Clock className="w-4 h-4" />} text="24-72h delivery" />
            <ProofChip icon={<MapPin className="w-4 h-4" />} text="Minneapolis specialist" />
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <StatBadge icon={<Zap className="w-4 h-4" />} text="99.2% On-Time Delivery" />
            <StatBadge icon={<Camera className="w-4 h-4" />} text="≤2.3 Min/Photo Edit" />
            <StatBadge icon={<Users className="w-4 h-4" />} text="6-10 Venues Weekly" />
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <TrustBadge icon={<Shield className="w-4 h-4" />} text="Stripe Verified" />
            <TrustBadge text="Non-exclusive license" />
            <TrustBadge text="MN tax aligned" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ROI MATH SECTION */}
      {/* ============================================ */}
      <RoiMath />

      {/* ============================================ */}
      {/* PRICING SECTION */}
      {/* ============================================ */}
      <section id="pricing" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <H2 className="text-center mb-4">Simple, Transparent Pricing</H2>
          <Body className="text-center mb-12 text-gray-400 max-w-2xl mx-auto">
            No hidden fees. No contracts. Cancel anytime. 
            Start with a Pilot to prove we deliver.
          </Body>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier, index) => (
              <PricingCard key={tier.id} tier={tier} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h4 className="font-bold text-brand-gold mb-4">GETTUPP ENT</h4>
              <p className="text-sm text-gray-400">
                Premium nightlife photography for Minneapolis venues that want to own the night.
              </p>
            </div>
            {/* Services */}
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/pilot-intake" className="hover:text-brand-gold">Pilot Night ($345)</Link></li>
                <li><Link href="#pricing" className="hover:text-brand-gold">Retainer Plans</Link></li>
                <li><Link href="/gallery" className="hover:text-brand-gold">Our Work</Link></li>
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-brand-gold">About Us</Link></li>
                <li><Link href="/faq" className="hover:text-brand-gold">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-brand-gold">Contact</Link></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-brand-gold">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-brand-gold">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/10">
            <Small className="text-gray-500">
              © {new Date().getFullYear()} GettUpp ENT. Minneapolis, MN. We don&apos;t just post—we pack venues.
            </Small>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ============================================
// Sub-components
// ============================================

function ProofChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
      {icon}
      <span className="text-sm text-white">{text}</span>
    </div>
  );
}

function StatBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30">
      {icon}
      <span className="text-xs font-medium text-[var(--brand-gold)]">{text}</span>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span>{text}</span>
    </div>
  );
}
