/**
 * @file gallery/page.tsx
 * @description Public gallery showcasing venue photography work
 * @module app/gallery
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { H1, H2, Body } from '@/components/ui/Typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  venueName: string;
  date: string;
  djName?: string;
  tag?: string;
  coverImage: string;
  photoCount: number;
  galleryUrl: string;
}

// Placeholder gallery data - in production this would come from Firestore
const SAMPLE_GALLERIES: GalleryItem[] = [
  {
    id: '1',
    venueName: 'The Loft',
    date: '2024-11-22',
    djName: 'DJ Velocity',
    tag: 'Friday Vibes',
    coverImage: '/gallery/loft-cover.jpg',
    photoCount: 45,
    galleryUrl: '#',
  },
  {
    id: '2',
    venueName: 'Skybar',
    date: '2024-11-16',
    djName: 'DJ Pulse',
    tag: 'VIP Night',
    coverImage: '/gallery/skybar-cover.jpg',
    photoCount: 62,
    galleryUrl: '#',
  },
  {
    id: '3',
    venueName: 'Noir Club',
    date: '2024-11-09',
    tag: 'Grand Opening',
    coverImage: '/gallery/noir-cover.jpg',
    photoCount: 78,
    galleryUrl: '#',
  },
  {
    id: '4',
    venueName: 'Electric Lounge',
    date: '2024-11-02',
    djName: 'DJ Spark',
    tag: 'Saturday Sessions',
    coverImage: '/gallery/electric-cover.jpg',
    photoCount: 52,
    galleryUrl: '#',
  },
  {
    id: '5',
    venueName: 'The Warehouse',
    date: '2024-10-26',
    tag: 'Halloween Special',
    coverImage: '/gallery/warehouse-cover.jpg',
    photoCount: 89,
    galleryUrl: '#',
  },
  {
    id: '6',
    venueName: 'Uptown Social',
    date: '2024-10-19',
    djName: 'DJ Nova',
    tag: 'Weekend Warrior',
    coverImage: '/gallery/uptown-cover.jpg',
    photoCount: 41,
    galleryUrl: '#',
  },
];

const TAGS = ['All', 'Friday Vibes', 'VIP Night', 'Weekend Warrior', 'Special Events'];

/**
 * GalleryPage - Showcase of venue photography work
 * Demonstrates quality and style to potential clients
 */
export default function GalleryPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [galleries] = useState<GalleryItem[]>(SAMPLE_GALLERIES);

  const filteredGalleries = selectedTag === 'All'
    ? galleries
    : galleries.filter((g) => g.tag?.toLowerCase().includes(selectedTag.toLowerCase()));

  return (
    <main className="min-h-screen bg-[var(--brand-ink)] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <H1>See Real Nights</H1>
            <Body className="mt-4 text-xl text-gray-300">
              350+ Minneapolis events captured. This is what we do.
            </Body>
          </motion.div>

          {/* Filter Tags */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-ink)]'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery, idx) => (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <GalleryCard gallery={gallery} />
              </motion.div>
            ))}
          </div>

          {filteredGalleries.length === 0 && (
            <div className="text-center py-20">
              <Body className="text-gray-400">No galleries found for this filter.</Body>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[var(--brand-gold)]/10">
        <div className="max-w-4xl mx-auto text-center">
          <H2>Ready to see your venue here?</H2>
          <Body className="mt-4 text-gray-300">
            Start with a $345 pilot night. No commitment. Just results.
          </Body>
          <Link href="/pilot-intake" className="inline-block mt-8">
            <MagneticButton size="lg">Book Your Pilot Night</MagneticButton>
          </Link>
        </div>
      </section>
    </main>
  );
}

// ============================================
// Sub-components
// ============================================

interface GalleryCardProps {
  gallery: GalleryItem;
}

function GalleryCard({ gallery }: GalleryCardProps) {
  const formattedDate = new Date(gallery.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <GlassCard className="group overflow-hidden hover:border-[var(--brand-gold)]/50 transition-all cursor-pointer">
      {/* Image Placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-gold)]/20 to-[var(--brand-pink)]/20 rounded-lg mb-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl">📸</span>
            <p className="text-sm text-gray-400 mt-2">{gallery.photoCount} photos</p>
          </div>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[var(--brand-gold)]/0 group-hover:bg-[var(--brand-gold)]/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="px-4 py-2 bg-[var(--brand-gold)] text-[var(--brand-ink)] rounded-lg font-semibold text-sm">
            View Gallery →
          </span>
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-white text-lg">{gallery.venueName}</h3>
          {gallery.tag && (
            <span className="px-2 py-1 bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] rounded text-xs font-medium">
              {gallery.tag}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{formattedDate}</span>
          {gallery.djName && <span>{gallery.djName}</span>}
        </div>
      </div>
    </GlassCard>
  );
}
