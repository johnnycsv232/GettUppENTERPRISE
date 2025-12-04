"use client";
/**
 * @file FounderSection.tsx
 * @description Founder section with Johnny Cage persona
 * @module components/sections/FounderSection
 */

import { motion } from 'framer-motion';
import { H2, Body, Accent } from '@/components/ui';
import { Instagram } from 'lucide-react';
import Link from 'next/link';

export function FounderSection() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      className="px-6 py-24 bg-brand-ink"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-gray-800 rounded-lg">
          {/* Placeholder for image */}
        </div>

        {/* Content */}
        <div>
          <H2 className="mb-4">Meet The Face</H2>
          <h3 className="text-4xl font-bold mb-6">
            MOTHERFUCKEN <span className="text-gold-gradient">J-CAGE</span>
            <br />
            <span className="text-lg text-gray-400">YOU-ALREADY-KNOW</span>
          </h3>
          <blockquote className="border-l-4 border-brand-gold pl-6 mb-8">
            <Body className="text-xl italic">
              &quot;I don&apos;t sell content. I deliver{' '}
              <Accent>tracked RSVPs</Accent>. If I don&apos;t move the
              numbers, don&apos;t keep me.&quot;
            </Body>
          </blockquote>
          <Body className="mb-8 text-gray-400">
            Operating since 2024 across Warehouse District, North Loop, and
            Uptown. If it&apos;s happening in Minneapolis nightlife, we&apos;re there.
          </Body>
          <Link
            href="https://instagram.com/mplsjohnnycage"
            target="_blank"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-lg text-white font-bold hover:scale-105 transition"
          >
            <Instagram className="w-5 h-5" />
            <span>FOLLOW @MPLSJOHNNYCAGE</span>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            12.4K Followers - Live Updates
          </p>
        </div>
      </div>
    </motion.section>
  );
}
