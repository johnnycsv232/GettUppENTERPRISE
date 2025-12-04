"use client";
/**
 * @file GettUppGirlsSection.tsx
 * @description GettUpp Girls clothing line announcement section
 * @module components/sections/GettUppGirlsSection
 */

import { motion } from 'framer-motion';
import { H2, Body } from '@/components/ui';
import Link from 'next/link';

export function GettUppGirlsSection() {
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
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-pink mb-4">
          Official Announcement
        </p>
        <H2 className="mb-4">
          GETTUPP<span className="text-brand-pink">Girls</span>
        </H2>
        <p className="text-lg text-gray-400 mb-2">
          🔥 47 sold this week
        </p>
        <Body className="mx-auto max-w-2xl text-xl text-gray-300 mb-8">
          The unofficial uniform for the girls who never wait in line.
        </Body>
        <div className="relative aspect-[16/9] bg-gray-800 rounded-lg mb-8">
          {/* Placeholder for image collage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Image Collage Placeholder</p>
          </div>
        </div>
        <p className="font-bold mb-2">QR Enabled</p>
        <p className="text-gray-400 mb-8">
          Scan patch to view tonight&apos;s photos instantly.
        </p>
        <p className="text-sm font-bold uppercase tracking-wider text-brand-gold mb-4">
          Drop 001 Live
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-4 bg-brand-gold text-brand-ink font-bold rounded-lg hover:scale-105 transition"
        >
          Shop The Collection
        </Link>
        <p className="text-sm text-gray-500 mt-8">
          Worn by bottle girls at The Warehouse, Rabbit Hole, and Vanquish
        </p>
      </div>
    </motion.section>
  );
}
