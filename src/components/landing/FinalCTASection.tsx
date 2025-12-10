/**
 * @file FinalCTASection.tsx
 * @description Final call-to-action section
 * @module components/landing/FinalCTASection
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function FinalCTASection() {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[var(--brand-ink)] to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--brand-gold)]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[var(--brand-pink)]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            THIS WEEKEND DOESN'T HAVE TO LOOK LIKE LAST WEEKEND.
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Lock in a pilot night and see what happens when your content finally matches 
            the energy inside your venue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pilot-intake">
              <MagneticButton size="lg" className="text-lg px-10">
                BOOK YOUR PILOT NIGHT
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </MagneticButton>
            </Link>
            <Link href="/contact">
              <MagneticButton size="lg" variant="outline" className="text-lg">
                <MessageCircle className="w-5 h-5 mr-2 inline" />
                TALK TO THE TEAM
              </MagneticButton>
            </Link>
          </div>
        </motion.div>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <p className="text-sm text-gray-500">
            Minneapolis's premier nightlife content engine. 350+ events shot in 2025.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTASection;
