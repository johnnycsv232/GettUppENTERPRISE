/**
 * @file HowItWorks.tsx
 * @description Visual step-by-step process section
 */

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, Calendar, Camera, Sparkles, Send, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: <MessageSquare className="w-8 h-8" />,
    number: '01',
    title: 'BOOK YOUR PILOT',
    description: "Fill out the quick intake form. We'll confirm your date within 24 hours.",
    color: '#D9AE43',
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    number: '02',
    title: 'WE PULL UP',
    description: 'Johnny and the team arrive, capture the energy, and document the night.',
    color: '#FF3C93',
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    number: '03',
    title: 'EDIT & DELIVER',
    description: '30 club-ready edits delivered in 24-72 hours. Full GettUpp treatment.',
    color: '#D9AE43',
  },
  {
    icon: <Send className="w-8 h-8" />,
    number: '04',
    title: 'POST & TRACK',
    description: 'Get your 7-10 day posting plan. We track from post to door with ShotClock.',
    color: '#FF3C93',
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-[#0B0B0D] relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(217, 174, 67, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(217, 174, 67, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#D9AE43]/10 border border-[#D9AE43]/30 text-[#D9AE43] text-sm font-medium mb-6">
            THE PROCESS
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            HOW IT
            <span className="text-[#D9AE43]"> WORKS</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From booking to packed venue—here's the system that makes it happen.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D9AE43]/20 via-[#FF3C93]/20 to-[#D9AE43]/20 -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative group"
              >
                {/* Card */}
                <div className="relative bg-gradient-to-br from-[#1a1a1d] to-[#0B0B0D] border border-white/10 rounded-3xl p-8 h-full hover:border-[#D9AE43]/30 transition-all duration-300">
                  {/* Number badge */}
                  <div
                    className="absolute -top-4 left-8 px-4 py-1 rounded-full font-heading font-bold text-[#0B0B0D]"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${step.color}20`, color: step.color }}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-heading text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Glow effect on hover */}
                <div
                  className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
                  style={{ backgroundColor: `${step.color}10` }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Ready to see it in action?
          </p>
          <motion.a
            href="/pilot-intake"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D9AE43] to-[#f4d03f] text-[#0B0B0D] font-bold rounded-full"
          >
            START YOUR PILOT NOW
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
