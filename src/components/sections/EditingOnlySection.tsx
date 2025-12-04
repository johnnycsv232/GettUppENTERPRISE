"use client";
/**
 * @file EditingOnlySection.tsx
 * @description Editing-only service section
 * @module components/sections/EditingOnlySection
 */

import { motion } from 'framer-motion';
import { H2, Body, Accent } from '@/components/ui';
import { MagneticButton } from '@/components/ui/MagneticButton';
import Link from 'next/link';

export function EditingOnlySection() {
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
        <H2 className="mb-4">
          Already Shooting? <Accent>We&apos;ll Polish It</Accent>
        </H2>
        <Body className="mx-auto max-w-2xl text-xl text-gray-300 mb-8">
          Send us your RAW photos. Get the GettUpp look in 72h.
        </Body>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Before/After Placeholder */}
          <div className="relative aspect-video bg-gray-800 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Before/After Placeholder</p>
            </div>
          </div>
          <div className="relative aspect-video bg-gray-700 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400">After</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Batch Service */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10">
            <h3 className="text-2xl font-bold mb-2">$199/Batch</h3>
            <p className="text-sm text-gray-400 mb-4">Flat Rate</p>
            <ul className="text-left space-y-2 mb-6">
              <li>- 30 RAW Photos</li>
              <li>- AI + Manual Polish</li>
              <li>- 72h Turnaround</li>
            </ul>
            <Link href="/pilot-intake?service=editing-batch">
              <MagneticButton variant="gold" className="w-full">
                Start Batch
              </MagneticButton>
            </Link>
          </div>

          {/* Single Photo Service */}
          <div className="bg-gray-900 p-8 rounded-lg border border-white/10">
            <h3 className="text-2xl font-bold mb-2">$49/Single</h3>
            <p className="text-sm text-gray-400 mb-4">Perfect for testing</p>
            <ul className="text-left space-y-2 mb-6">
              <li>- 1 RAW Photo</li>
              <li>- Same 72h Turnaround</li>
              <li>- Perfect for testing</li>
            </ul>
            <Link href="/pilot-intake?service=editing-single">
              <MagneticButton variant="outline" className="w-full">
                Test 1 Photo
              </MagneticButton>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
