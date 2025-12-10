/**
 * @file HeroSection.tsx
 * @description Main hero section with 3D background and CTAs
 * @module components/landing/HeroSection
 */

'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Shield, Clock, MapPin, Zap } from 'lucide-react';

// Dynamic import for 3D scene (client-only, no SSR)
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-ink)] to-black" />,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--brand-ink)]">
      {/* 3D Background */}
      <HeroScene />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className="text-sm uppercase tracking-[0.3em] text-[var(--brand-gold)] mb-4"
        >
          Minneapolis Nightlife Content Engine
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-[var(--brand-gold)] leading-tight"
        >
          OWN THE NIGHT.
          <br />
          <span className="text-white">PACK YOUR VENUE.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
        >
          Premium nightlife photography run like an operations system—so your room fills up every weekend, not just on lucky Fridays.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/pilot-intake">
            <MagneticButton size="lg" variant="gold">
              START THE $345 PILOT
            </MagneticButton>
          </Link>
          <Link href="/gallery">
            <MagneticButton size="lg" variant="outline">
              SEE REAL NIGHTS WE'VE SHOT
            </MagneticButton>
          </Link>
        </motion.div>

        {/* Proof Chips */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          <ProofChip icon={<Zap className="w-4 h-4" />} text="79.7K views (90 days)" />
          <ProofChip icon={<Clock className="w-4 h-4" />} text="24-72h delivery" />
          <ProofChip icon={<MapPin className="w-4 h-4" />} text="Minneapolis specialist" />
        </motion.div>

        {/* Trust Strip */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400"
        >
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--brand-gold)]" />
            Stripe Verified
          </span>
          <span>•</span>
          <span>Non-exclusive license</span>
          <span>•</span>
          <span>MN tax aligned</span>
          <span>•</span>
          <span>350+ Minneapolis events</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-1 h-2 bg-[var(--brand-gold)] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function ProofChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
      <span className="text-[var(--brand-gold)]">{icon}</span>
      <span className="text-sm text-white">{text}</span>
    </div>
  );
}

export default HeroSection;
