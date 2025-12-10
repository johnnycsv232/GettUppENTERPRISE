/**
 * @file TrustSection.tsx
 * @description "Trusted By" section showing venues/DJs worked with
 * @module components/landing/TrustSection
 */

'use client';

import { motion } from 'framer-motion';

const PARTNERS = [
  { name: 'DJ YS', type: 'DJ' },
  { name: 'Bdiffrent', type: 'DJ' },
  { name: 'Last Call', type: 'Venue' },
  { name: 'Mic Drop / Polo G', type: 'Event' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export function TrustSection() {
  return (
    <section className="py-24 px-6 bg-[var(--brand-ink)]">
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm uppercase tracking-[0.3em] text-[var(--brand-gold)] text-center mb-4"
        >
          Trusted By
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-heading text-4xl md:text-5xl font-bold text-white text-center mb-16"
        >
          WE WORK WHERE THE CITY GOES OUT.
        </motion.h2>

        {/* Partner Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {PARTNERS.map((partner) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05, borderColor: 'rgba(217, 174, 67, 0.5)' }}
              className="aspect-square rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center p-6 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--brand-gold)]/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--brand-gold)]">
                  {partner.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white text-center">{partner.name}</h3>
              <p className="text-sm text-gray-400">{partner.type}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TrustSection;
