/**
 * @file PricingSection.tsx
 * @description Pricing tiers section with animated cards
 * @module components/landing/PricingSection
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Check, Sparkles, Clock, Camera, Video } from 'lucide-react';

const TIERS = [
  {
    id: 'pilot',
    name: 'Pilot Night',
    tagline: 'Test the Engine',
    price: 345,
    period: 'one-time',
    popular: false,
    features: [
      '1 premium on-site shoot',
      '30 finished, club-ready edits',
      '72h delivery guarantee',
      'Full GettUpp color treatment',
      '7-10 day posting plan',
    ],
    cta: 'START THE PILOT',
    href: '/pilot-intake',
  },
  {
    id: 't1',
    name: 'Friday Nights',
    tagline: 'Tier 1',
    price: 445,
    period: '/month',
    popular: false,
    features: [
      '1 shoot per month',
      '30 photos per shoot',
      '72h delivery',
      'Monthly content calendar',
      'Priority scheduling',
    ],
    cta: 'SELECT TIER 1',
    href: '/checkout?tier=t1',
    savings: 'Save $540/yr vs one-offs',
  },
  {
    id: 't2',
    name: 'Weekend Warrior',
    tagline: 'Tier 2 • Most Popular',
    price: 695,
    period: '/month',
    popular: true,
    features: [
      '2 shoots per month',
      '60 photos total',
      '2 reels included',
      '48h delivery',
      'Priority scheduling',
      'Content strategy session',
    ],
    cta: 'SELECT TIER 2',
    href: '/checkout?tier=t2',
    savings: 'Save $1,140/yr vs one-offs',
  },
  {
    id: 'vip',
    name: 'VIP Partner',
    tagline: 'Tier 3',
    price: 995,
    period: '/month',
    popular: false,
    features: [
      '3 shoots per month',
      '80 photos total',
      '3 reels included',
      '24h delivery',
      'Dedicated strategy calls',
      'First-priority scheduling',
      'ShotClock ROI tracking',
    ],
    cta: 'SELECT VIP',
    href: '/checkout?tier=vip',
    savings: 'Save $2,340/yr vs one-offs',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function PricingSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black to-[var(--brand-ink)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            WHEN YOU'RE READY TO LOCK IT IN.
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Pilot night proves it works. These are the subscription engines that keep your 
            weekends heavy.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {TIERS.map((tier) => (
            <motion.div
              key={tier.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl p-6 ${
                tier.popular
                  ? 'bg-gradient-to-b from-[var(--brand-gold)]/20 to-[var(--brand-ink)] border-2 border-[var(--brand-gold)]'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--brand-gold)] text-[var(--brand-ink)] text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  MOST POPULAR
                </div>
              )}

              {/* Tier Header */}
              <div className="text-center mb-6">
                <p className="text-sm text-[var(--brand-gold)] font-medium mb-2">{tier.tagline}</p>
                <h3 className="font-heading text-2xl font-bold text-white mb-4">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-[var(--brand-gold)]">${tier.price}</span>
                  <span className="text-gray-400">{tier.period}</span>
                </div>
                {tier.savings && (
                  <p className="text-xs text-green-400 mt-2">{tier.savings}</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={tier.href} className="block">
                <MagneticButton
                  variant={tier.popular ? 'gold' : 'outline'}
                  className="w-full justify-center"
                >
                  {tier.cta}
                </MagneticButton>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 text-sm mt-12"
        >
          All plans include non-exclusive licensing. Cancel anytime. MN sales tax exempt for advertising services.
        </motion.p>
      </div>
    </section>
  );
}

export default PricingSection;
