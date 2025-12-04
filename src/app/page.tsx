"use client";
/**
 * @file page.tsx
 * @description GettUpp Landing Page - Hero + ROI Math + Pricing
 * @module app/page
 */

import { motion } from 'framer-motion';
import { MagneticButton, H1, H2, Body, Small } from '@/components/ui';
import { PricingCard } from '@/components/ui/PricingCard';
import { RoiMath } from '@/components/sections/RoiMath';
import { FounderSection } from '@/components/sections/FounderSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { GettUppGirlsSection } from '@/components/sections/GettUppGirlsSection';
import { EditingOnlySection } from '@/components/sections/EditingOnlySection';
import { GalleryPreviewSection } from '@/components/sections/GalleryPreviewSection';
import { getAllTiers } from '@/lib/constants/pricing';
import Link from 'next/link';

export default function Home() {
  const tiers = getAllTiers();

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="min-h-screen bg-brand-ink">
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative px-6 py-24 md:py-32">
        <motion.div
          className="mx-auto max-w-6xl text-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Headline */}
          <motion.div variants={heroVariants}>
            <H1 className="mb-6 text-4xl md:text-6xl lg:text-7xl">
              OWN THE <span className="text-gold-gradient">NIGHT</span>
            </H1>
          </motion.div>

          {/* Subheadline & CTAs */}
          <motion.div variants={heroVariants}>
            <Body className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
              We don&apos;t just post. We pack venues.
              <br />
              Energy. Consistency. Measurable Results.
            </Body>
          </motion.div>

          <motion.div variants={heroVariants}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/pilot-intake">
                <MagneticButton size="lg" variant="gold">
                  Start The Pilot
                </MagneticButton>
              </Link>
              <Link href="/gallery">
                <MagneticButton size="lg" variant="outline">
                  View Work
                </MagneticButton>
              </Link>
            </div>
          </motion.div>

          {/* Trust Bar */}
          <motion.div variants={heroVariants}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <TrustBadge text="Trusted by 12+ Minneapolis Venues" />
              <TrustBadge text="500+ Shoots Completed" />
              <TrustBadge text="99.2% On-Time Record" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* ROI MATH SECTION */}
      {/* ============================================ */}
      <RoiMath />

      {/* ============================================ */}
      {/* FOUNDER SECTION */}
      {/* ============================================ */}
      <motion.div variants={heroVariants}><FounderSection /></motion.div>

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <motion.div variants={heroVariants}><TestimonialsSection /></motion.div>

      {/* ============================================ */}
      {/* GETTUPP GIRLS SECTION */}
      {/* ============================================ */}
      <motion.div variants={heroVariants}><GettUppGirlsSection /></motion.div>

      {/* ============================================ */}
      {/* EDITING ONLY SECTION */}
      {/* ============================================ */}
      <motion.div variants={heroVariants}><EditingOnlySection /></motion.div>

      {/* ============================================ */}
      {/* GALLERY PREVIEW SECTION */}
      {/* ============================================ */}
      <motion.div variants={heroVariants}><GalleryPreviewSection /></motion.div>

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
          <div className="text-center mb-12">
            <h4 className="font-bold text-lg mb-2">Still Deciding?</h4>
            <p className="text-gray-400">
              Text &apos;VISIT&apos; to <a href="sms:555-0199" className="text-brand-gold font-bold">555-0199</a> to see us shoot live this Friday.
            </p>
          </div>
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

function TrustBadge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span>{text}</span>
    </div>
  );
}
