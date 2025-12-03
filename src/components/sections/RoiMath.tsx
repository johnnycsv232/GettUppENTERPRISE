/**
 * @file RoiMath.tsx
 * @description "The Math Is Simple" ROI section - Key conversion element
 * @module components/sections/RoiMath
 */

'use client';

import { motion } from 'framer-motion';
import { ROI_MATH } from '@/lib/constants/pricing';

export function RoiMath() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[var(--brand-ink)] via-[#0B0B0D] to-[var(--brand-ink)]">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--brand-gold)]/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-white">THE MATH IS </span>
            <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
              SIMPLE.
            </span>
          </h2>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-gray-300 text-lg max-w-3xl mx-auto mb-16"
        >
          It takes just <span className="text-brand-gold font-bold">3 New Regulars</span> to pay for our highest tier.
          <br />
          Everything else is <span className="text-brand-gold font-bold">profit</span>.
        </motion.p>

        {/* Three-column ROI breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {/* Column 1: VIP Cost */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-[#0B0B0D] border border-[var(--brand-gold)]/30 rounded-2xl p-8 text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">VIP COST</p>
              <p className="text-5xl md:text-6xl font-black text-white">${ROI_MATH.vipCost}</p>
            </div>
          </motion.div>

          {/* Column 2: VS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[var(--brand-ink)] font-black text-2xl md:text-3xl px-8 py-4 rounded-full">
              VS
            </div>
          </motion.div>

          {/* Column 3: Avg Regular Value */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-[#0B0B0D] border border-[var(--brand-gold)]/30 rounded-2xl p-8 text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">AVG. REGULAR VALUE</p>
              <p className="text-5xl md:text-6xl font-black text-white">${ROI_MATH.avgRegularValue}</p>
            </div>
          </motion.div>
        </div>

        {/* Break Even Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] rounded-2xl p-1">
            <div className="bg-[var(--brand-ink)] rounded-xl p-8 text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">BREAK EVEN</p>
              <p className="text-7xl md:text-8xl font-black bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
                {ROI_MATH.breakeven}
              </p>
              <p className="text-gray-300 text-sm uppercase tracking-wider mt-2">NEW CUSTOMERS</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default RoiMath;
