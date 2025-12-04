"use client";
/**
 * @file GalleryPreviewSection.tsx
 * @description Gallery preview section with masonry grid
 * @module components/sections/GalleryPreviewSection
 */

import { motion } from 'framer-motion';
import { H2, Accent } from '@/components/ui';
import Link from 'next/link';

export function GalleryPreviewSection() {
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

  const recentShoots = [
    { venue: 'The Warehouse', date: 'Nov 14' },
    { venue: 'Vanquish', date: 'Nov 12' },
    { venue: 'Rabbit Hole', date: 'Nov 10' },
    { venue: 'Club Nova', date: 'Nov 08' },
    { venue: 'Rooftop', date: 'Nov 07' },
    { venue: 'Skyline', date: 'Nov 05' },
  ];

  return (
    <motion.section
      className="px-6 py-24 bg-brand-ink"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-6xl text-center">
        <H2 className="mb-12">
          The <Accent>GettUpp Look</Accent>
        </H2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {recentShoots.map((shoot, index) => (
            <motion.div
              key={index}
              className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden"
              custom={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: i * 0.1,
                  },
                }),
              }}
            >
              {/* Placeholder for image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">{shoot.venue}</p>
              </div>
              <div className="absolute bottom-4 left-4 text-left">
                <p className="text-sm font-bold">{shoot.venue}</p>
                <p className="text-xs text-gray-400">{shoot.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <Link
          href="/gallery"
          className="inline-block px-8 py-4 border-2 border-brand-gold text-brand-gold font-bold rounded-lg hover:bg-brand-gold hover:text-brand-ink transition"
        >
          Explore Full Gallery
        </Link>
      </div>
    </motion.section>
  );
}
