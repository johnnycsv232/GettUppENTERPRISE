/**
 * @file PremiumPricing.tsx
 * @description Stunning pricing section with animated tier cards
 */

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, Crown, Zap, Star } from 'lucide-react';

const tiers = [
  {
    id: 'pilot',
    name: 'Pilot Night',
    tagline: 'Test the Engine',
    price: 345,
    period: 'one-time',
    popular: false,
    icon: <Zap className="w-6 h-6" />,
    features: [
      '1 premium on-site shoot',
      '30 club-ready photo edits',
      '72h delivery guarantee',
      'Full GettUpp color treatment',
      '7-10 day posting plan',
    ],
    cta: 'START PILOT',
    href: '/pilot-intake',
    gradient: 'from-gray-600 to-gray-700',
    borderColor: 'border-white/10',
  },
  {
    id: 't1',
    name: 'Friday Nights',
    tagline: 'Tier 1',
    price: 445,
    period: '/month',
    popular: false,
    icon: <Star className="w-6 h-6" />,
    features: [
      '1 shoot per month',
      '30 photos per shoot',
      '72h delivery',
      'Content calendar',
      'Priority scheduling',
    ],
    cta: 'SELECT TIER 1',
    href: '/checkout?tier=t1',
    gradient: 'from-[#D9AE43]/80 to-[#D9AE43]',
    borderColor: 'border-[#D9AE43]/30',
    savings: 'Save $540/yr',
  },
  {
    id: 't2',
    name: 'Weekend Warrior',
    tagline: 'Most Popular',
    price: 695,
    period: '/month',
    popular: true,
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      '2 shoots per month',
      '60 photos total',
      '2 reels included',
      '48h delivery',
      'Content strategy session',
      'Priority scheduling',
    ],
    cta: 'SELECT TIER 2',
    href: '/checkout?tier=t2',
    gradient: 'from-[#FF3C93] to-[#D9AE43]',
    borderColor: 'border-[#D9AE43]',
    savings: 'Save $1,140/yr',
  },
  {
    id: 'vip',
    name: 'VIP Partner',
    tagline: 'Full Service',
    price: 995,
    period: '/month',
    popular: false,
    icon: <Crown className="w-6 h-6" />,
    features: [
      '3 shoots per month',
      '80 photos total',
      '3 reels included',
      '24h delivery',
      'Dedicated strategy calls',
      'ShotClock ROI tracking',
      'First-priority scheduling',
    ],
    cta: 'SELECT VIP',
    href: '/checkout?tier=vip',
    gradient: 'from-purple-600 to-[#D9AE43]',
    borderColor: 'border-purple-500/30',
    savings: 'Save $2,340/yr',
  },
];

export function PremiumPricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-32 px-6 bg-[#0B0B0D] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D9AE43]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF3C93]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#D9AE43]/10 border border-[#D9AE43]/30 text-[#D9AE43] text-sm font-medium mb-6">
            PRICING
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            WHEN YOU'RE READY TO
            <span className="text-[#D9AE43]"> LOCK IT IN</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pilot night proves it works. These are the subscription engines that keep your weekends heavy.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHoveredId(tier.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group"
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-[#FF3C93] to-[#D9AE43] text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg shadow-[#FF3C93]/30">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Card */}
              <motion.div
                animate={{
                  y: hoveredId === tier.id ? -8 : 0,
                  scale: hoveredId === tier.id ? 1.02 : 1,
                }}
                className={`relative h-full bg-gradient-to-br from-[#1a1a1d] to-[#0B0B0D] border ${tier.borderColor} rounded-3xl p-6 transition-all duration-300 ${tier.popular ? 'border-2' : ''}`}
              >
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${tier.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10`} />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tier.gradient} flex items-center justify-center text-white mb-4`}>
                  {tier.icon}
                </div>

                {/* Tier info */}
                <div className="mb-6">
                  <p className="text-sm text-[#D9AE43] font-medium mb-1">{tier.tagline}</p>
                  <h3 className="font-heading text-2xl font-bold text-white">{tier.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-gray-400">{tier.period}</span>
                  </div>
                  {tier.savings && (
                    <p className="text-sm text-green-400 mt-1">{tier.savings}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-[#D9AE43] flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={tier.href} className="block mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                      tier.popular
                        ? 'bg-gradient-to-r from-[#D9AE43] to-[#f4d03f] text-[#0B0B0D]'
                        : 'border border-white/20 text-white hover:border-[#D9AE43] hover:text-[#D9AE43]'
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-400 text-sm mt-12"
        >
          All plans include non-exclusive licensing. Cancel anytime. MN sales tax exempt for advertising services.
        </motion.p>
      </div>
    </section>
  );
}

export default PremiumPricing;
