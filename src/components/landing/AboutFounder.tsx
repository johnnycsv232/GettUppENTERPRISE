/**
 * @file AboutFounder.tsx
 * @description Johnny Cage founder section with photo and story
 */

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { NightlifeImage } from '@/components/ui/NightlifeImage';
import Link from 'next/link';
import { Camera, Calendar, Award, Users, Instagram, ArrowRight } from 'lucide-react';

const stats = [
  { icon: <Camera />, value: '350+', label: 'Events Shot in 2024' },
  { icon: <Calendar />, value: '10+', label: 'Partner Venues' },
  { icon: <Award />, value: '99%', label: 'On-Time Delivery' },
  { icon: <Users />, value: '79.7K', label: 'Views (90 Days)' },
];

export function AboutFounder() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-gradient-to-b from-[#0B0B0D] via-[#111113] to-[#0B0B0D] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#D9AE43]/5 rounded-full blur-[200px] -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Photo Side */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative frame */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#D9AE43]/20 via-transparent to-[#FF3C93]/20 rounded-3xl blur-2xl" />
            
            {/* Main photo container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[#D9AE43]/30 bg-[#1a1a1d]">
              <NightlifeImage
                src="/images/johnny-cage.jpg"
                alt="Johnny Cage - Founder of GettUpp ENT"
                fill
                className="object-cover"
                priority
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent" />
              
              {/* Name badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <div className="bg-[#0B0B0D]/80 backdrop-blur-xl rounded-2xl p-4 border border-[#D9AE43]/30">
                  <h3 className="font-heading text-2xl font-bold text-[#D9AE43]">JOHNNY CAGE</h3>
                  <p className="text-gray-400">Founder & Lead Photographer</p>
                </div>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.7, type: 'spring' }}
              className="absolute -right-4 top-8 bg-gradient-to-r from-[#D9AE43] to-[#f4d03f] text-[#0B0B0D] px-6 py-3 rounded-full font-bold text-sm shadow-xl shadow-[#D9AE43]/30"
            >
              Official Last Call Photographer
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#D9AE43]/10 border border-[#D9AE43]/30 text-[#D9AE43] text-sm font-medium mb-6">
              MEET THE FOUNDER
            </span>

            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              THE MAN BEHIND
              <br />
              <span className="bg-gradient-to-r from-[#D9AE43] to-[#FF3C93] bg-clip-text text-transparent">
                MINNEAPOLIS NIGHTS
              </span>
            </h2>

            <div className="space-y-6 text-lg text-gray-300 leading-relaxed mb-10">
              <p>
                <span className="text-[#D9AE43] font-semibold">Johnny Cage</span> is the lens behind 
                350+ Minneapolis nights this year and the name venues recognize before they see the camera.
              </p>
              <p>
                Official photographer for <span className="text-white font-semibold">Last Call</span> and 
                a fixture at <span className="text-white font-semibold">DJ YS</span> sets, he turned 
                "pull up with the homies" access into a system that delivers nightclub-grade content 
                on a 24-72h clock.
              </p>
              <p>
                <span className="text-[#D9AE43] font-semibold">GettUpp ENT</span> is that system—built 
                by the guy who's already in the room, then hardened with an enterprise playbook so your 
                content hits on schedule every time.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-[#D9AE43]/30 transition-colors"
                >
                  <div className="text-[#D9AE43] mb-2">{stat.icon}</div>
                  <div className="font-heading text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/pilot-intake">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-[#D9AE43] to-[#f4d03f] text-[#0B0B0D] font-bold rounded-full flex items-center gap-2"
                >
                  WORK WITH JOHNNY
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <a
                href="https://instagram.com/gettuppent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-full flex items-center gap-2 hover:border-[#D9AE43] transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  @gettuppent
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutFounder;
