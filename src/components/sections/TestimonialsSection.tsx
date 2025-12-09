"use client";
/**
 * @file TestimonialsSection.tsx
 * @description Testimonials section with carousel
 * @module components/sections/TestimonialsSection
 */

import { motion } from 'framer-motion';
import { H2, Body, Accent } from '@/components/ui';

export function TestimonialsSection() {
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

  // Dummy data for testimonials
  const testimonials = [
    {
      quote:
        "We tried three photographers before GettUpp. Johnny's the only one who showed up on time every single week. Our Instagram engagement doubled in 60 days.",
      author: 'Marcus, GM',
      venue: 'The Warehouse',
      result: '+105% Engagement',
    },
    {
      quote:
        "I don't have time to chase freelancers. GettUpp delivers Friday content by Monday morning, every time. That's what I pay for.",
      author: 'Sarah, Owner',
      venue: 'Rabbit Hole',
      result: '100% On-Time',
    },
    {
      quote:
        "They don't just take photos—they track what works. Our table bookings are up 28% since we started.",
      author: 'DJ Khrome, Resident',
      venue: 'Vanquish',
      result: '+28% Bookings',
    },
  ];

  return (
    <motion.section
      className="px-6 py-24 bg-brand-ink"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-6xl">
        <H2 className="text-center mb-12">
          Venues <Accent>Trust</Accent> The Engine
        </H2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 p-8 rounded-lg border border-white/10"
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
              <p className="text-sm text-gray-400 mb-2">Verified Venue Partner</p>
              <Body className="mb-6 italic">&quot;{testimonial.quote}&quot;</Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.venue}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-gold">
                    {testimonial.result}
                  </p>
                  <p className="text-xs text-gray-500">Verified Result</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
