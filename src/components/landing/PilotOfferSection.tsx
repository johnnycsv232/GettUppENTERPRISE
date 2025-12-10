/**
 * @file PilotOfferSection.tsx
 * @description Dedicated pilot offer section with scarcity and guarantee
 * @module components/landing/PilotOfferSection
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Check, Shield, Clock, AlertTriangle } from 'lucide-react';

const DELIVERABLES = [
  '1 premium on-site shoot (6-shot capture set)',
  '30 finished, club-ready edits',
  '72h delivery guarantee',
  'Full GettUpp color and crop treatment',
  'Quick-hit posting plan for the next 7-10 days',
];

export function PilotOfferSection() {
  return (
    <section className="py-24 px-6 bg-[var(--brand-ink)] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-gold)]/5 via-transparent to-[var(--brand-pink)]/5" />

      <div className="max-w-5xl mx-auto relative">
        {/* Scarcity Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">LIMITED AVAILABILITY</span>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">
            START WITH THE PILOT.
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            One night. One shoot. Thirty edited photos. No subscription. Just proof that this 
            engine moves bodies, not just numbers on a post.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[var(--brand-gold)]/10 to-transparent border-2 border-[var(--brand-gold)]/50 rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Price & Deliverables */}
            <div>
              {/* Price Lockup */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl md:text-7xl font-bold text-[var(--brand-gold)]">$345</span>
                  <span className="text-xl text-gray-400">ONE-TIME PILOT NIGHT</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">~$11 per finished photo</p>
              </div>

              {/* Deliverables */}
              <ul className="space-y-3">
                {DELIVERABLES.map((item) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 text-gray-200"
                  >
                    <Check className="w-5 h-5 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right: CTA & Guarantees */}
            <div className="text-center md:text-left">
              {/* Scarcity */}
              <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-gray-300">
                  <span className="text-[var(--brand-gold)] font-bold">Only 3 pilot slots</span> opened 
                  each month to protect delivery quality.
                </p>
              </div>

              {/* CTA */}
              <Link href="/pilot-intake">
                <MagneticButton size="lg" className="w-full md:w-auto text-lg px-12">
                  CLAIM YOUR PILOT SPOT
                </MagneticButton>
              </Link>

              {/* Risk Reversal */}
              <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <Shield className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-green-400 font-semibold mb-1">60-Day Guarantee</p>
                  <p className="text-xs text-gray-300">
                    If we don't move the needle on covers in 60 days, you get a full refund 
                    and an extra shoot on us.
                  </p>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  72h delivery
                </span>
                <span>•</span>
                <span>Stripe secured</span>
                <span>•</span>
                <span>No subscription</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PilotOfferSection;
