"use client";
/**
 * @file RoiMath.tsx
 * @description ROI Math section for GettUpp landing page
 * @module components/sections/RoiMath
 */

import { motion } from 'framer-motion';
import { H2, Body, Accent } from '@/components/ui';

export function RoiMath() {
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
      className="px-6 py-24 bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-4xl text-center">
        <H2 className="mb-4">
          The <Accent>Math</Accent> Is Simple
        </H2>
        <Body className="text-gray-400 mb-8">
          Average venue covers $350/customer LTV. Your content brings 3+ new
          faces minimum.
        </Body>
        <div className="text-5xl font-bold">
          3 NEW CUSTOMERS = <span className="text-gold-gradient">$995 PACKAGE PAID FOR</span>
        </div>
      </div>
    </motion.section>
  );
}
