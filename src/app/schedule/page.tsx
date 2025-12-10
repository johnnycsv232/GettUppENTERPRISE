/**
 * @file page.tsx
 * @description Multi-step scheduling and checkout flow
 * @module app/schedule
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton, GlassCard, H1, H2, Body } from '@/components/ui';
import { Check, Calendar, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { PRICING_TIERS } from '@/lib/constants/pricing';
import { useRouter } from 'next/navigation';

type Step = 'plan' | 'date' | 'checkout';

export default function SchedulePage() {
  const [step, setStep] = useState<Step>('plan');
  const [selectedTier, setSelectedTier] = useState<keyof typeof PRICING_TIERS | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const router = useRouter();

  const handleTierSelect = (tier: keyof typeof PRICING_TIERS) => {
    setSelectedTier(tier);
    setStep('date');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep('checkout');
  };

  const handleCheckout = async () => {
    if (!selectedTier) return;
    // In a real app, we'd save the date to state/db before redirecting
    router.push(`/checkout?tier=${selectedTier}`);
  };

  return (
    <main className="min-h-screen bg-brand-ink py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Progress Stepper */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-4">
            <StepIndicator active={step === 'plan'} completed={step !== 'plan'} number={1} label="Select Plan" />
            <div className="w-12 h-0.5 bg-white/10" />
            <StepIndicator active={step === 'date'} completed={step === 'checkout'} number={2} label="Pick Date" />
            <div className="w-12 h-0.5 bg-white/10" />
            <StepIndicator active={step === 'checkout'} completed={false} number={3} label="Checkout" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'plan' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {Object.entries(PRICING_TIERS).filter(([key]) => key !== 'pilot').map(([key, tier]) => (
                <PlanCard
                  key={key}
                  tier={tier}
                  onSelect={() => handleTierSelect(key as any)}
                />
              ))}
            </motion.div>
          )}

          {step === 'date' && (
            <motion.div
              key="date"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <button
                  onClick={() => setStep('plan')}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Plans
                </button>
              </div>
              
              <GlassCard className="min-h-[600px] flex items-center justify-center">
                {/* Cal.com Embed Placeholder */}
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-brand-gold mx-auto mb-4 opacity-50" />
                  <H2 className="mb-4">Select Your First Shoot Date</H2>
                  <Body className="mb-8">We'll sync this with your Johnny Cage's calendar.</Body>
                  {/* Simulated Date Selection for MVP */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Fri Oct 27', 'Sat Oct 28', 'Fri Nov 3', 'Sat Nov 4'].map((date) => (
                      <button
                        key={date}
                        onClick={() => handleDateSelect(date)}
                        className="p-4 rounded-lg border border-white/10 hover:border-brand-gold hover:bg-brand-gold/10 transition-all text-white font-medium"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {step === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto"
            >
              <div className="mb-8">
                <button
                  onClick={() => setStep('date')}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Date
                </button>
              </div>

              <GlassCard accent="gold">
                <H2 className="mb-6">Confirm Subscription</H2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Plan</span>
                    <span className="text-xl font-bold text-white uppercase">{selectedTier} Package</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <span className="text-gray-300">First Shoot</span>
                    <span className="text-xl font-bold text-white">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-brand-gold/30">
                    <span className="text-gray-300">Total Today</span>
                    <span className="text-2xl font-bold text-brand-gold">
                      {PRICING_TIERS[selectedTier as keyof typeof PRICING_TIERS]?.priceDisplay}
                    </span>
                  </div>
                </div>

                <MagneticButton
                  onClick={handleCheckout}
                  size="lg"
                  variant="gold"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Stripe
                </MagneticButton>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  Secure 256-bit encrypted payment. Cancel anytime.
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function StepIndicator({ active, completed, number, label }: { active: boolean; completed: boolean; number: number; label: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${active ? 'opacity-100' : 'opacity-50'}`}>
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
        ${completed ? 'bg-brand-gold text-brand-ink' : active ? 'border-2 border-brand-gold text-brand-gold' : 'border-2 border-white/20 text-white/50'}
      `}>
        {completed ? <Check className="w-6 h-6" /> : number}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
}

function PlanCard({ tier, onSelect }: { tier: any; onSelect: () => void }) {
  return (
    <GlassCard className="relative flex flex-col h-full hover:border-brand-gold/50 transition-colors group">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-brand-gold">{tier.priceDisplay}</span>
          <span className="text-sm text-gray-400">/month</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {tier.features.map((feature: string) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
            <Check className="w-5 h-5 text-brand-gold flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <MagneticButton onClick={onSelect} variant="outline" className="w-full group-hover:bg-brand-gold group-hover:text-brand-ink transition-colors">
        Select Plan
      </MagneticButton>
    </GlassCard>
  );
}
