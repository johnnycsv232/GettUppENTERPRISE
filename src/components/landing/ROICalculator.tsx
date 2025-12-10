/**
 * @file ROICalculator.tsx
 * @description ROI math section with animated counters and visualization
 */

'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Target, CheckCircle2 } from 'lucide-react';

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => `${prefix}${Math.round(current)}${suffix}`);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <motion.span ref={ref}>
      {display}
    </motion.span>
  );
}

const roiPoints = [
  { icon: <Users />, value: 3, label: 'New Regulars Needed', desc: 'to cover VIP tier cost' },
  { icon: <DollarSign />, value: 350, prefix: '$', label: 'Avg LTV Per Regular', desc: 'lifetime value each' },
  { icon: <TrendingUp />, value: 1050, prefix: '$', label: 'Return Generated', desc: 'from 3 new regulars' },
  { icon: <Target />, value: 11, prefix: '$', label: 'Cost Per Photo', desc: 'Pilot price breakdown' },
];

export function ROICalculator() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-gradient-to-b from-[#0B0B0D] via-[#111113] to-[#0B0B0D] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #D9AE43 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
            THE MATH
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            TRACKED RSVPs.
            <br />
            <span className="text-[#D9AE43]">NOT HOPIUM.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Your nights aren't judged on likes—they're judged on doors, covers, and who comes back next week.
          </p>
        </motion.div>

        {/* ROI Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {roiPoints.map((point, i) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-[#D9AE43]/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#D9AE43]/20 flex items-center justify-center mx-auto mb-4 text-[#D9AE43]">
                {point.icon}
              </div>
              <div className="font-heading text-4xl font-bold text-white mb-2">
                <AnimatedNumber value={point.value} prefix={point.prefix || ''} />
              </div>
              <div className="text-[#D9AE43] font-semibold mb-1">{point.label}</div>
              <div className="text-sm text-gray-400">{point.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Break-even Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D9AE43]/20 to-green-500/20 rounded-3xl blur-xl" />
          <div className="relative bg-gradient-to-br from-[#1a1a1d] to-[#0B0B0D] border border-[#D9AE43]/20 rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Math breakdown */}
              <div>
                <h3 className="font-heading text-3xl font-bold text-white mb-6">
                  THE BREAK-EVEN MATH
                </h3>
                <ul className="space-y-4">
                  {[
                    { text: '3 new regulars × $350 lifetime value', result: '$1,050' },
                    { text: 'Covers $995 VIP tier', result: '1 month' },
                    { text: 'One VIP table night (~$3K)', result: '~3 months' },
                    { text: 'Pilot breaks down to', result: '~$11/photo' },
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{item.text} = </span>
                      <span className="text-[#D9AE43] font-bold">{item.result}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Right: Visual */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Investment (VIP Tier)</span>
                    <span className="text-[#D9AE43] font-bold">$995/mo</span>
                  </div>
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: '100%' } : {}}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full bg-gradient-to-r from-[#D9AE43] to-[#f4d03f] rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Return (3 regulars)</span>
                    <span className="text-green-400 font-bold">$1,050+</span>
                  </div>
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: '105%' } : {}}
                      transition={{ duration: 1.2, delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                    />
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.2 }}
                  className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                >
                  <span className="text-green-400 font-bold text-lg">✓ ROI Positive with just 3 new regulars</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ROICalculator;
