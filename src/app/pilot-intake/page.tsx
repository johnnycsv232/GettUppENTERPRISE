/**
 * @file page.tsx
 * @description Pilot Intake - Simplified high-conversion booking form
 * @module app/pilot-intake
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagneticButton, GlassCard, H1, H2, Body, Small } from '@/components/ui';
import { PRICING_TIERS, SCARCITY } from '@/lib/constants/pricing';
import { Check, AlertTriangle, Calendar, Clock, Camera } from 'lucide-react';
import { z } from 'zod';

// Form validation schema
const PilotFormSchema = z.object({
  venueName: z.string().min(2, 'Venue name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  preferredNight: z.enum(['friday', 'saturday', 'flexible']),
  notes: z.string().optional(),
});

type PilotFormData = z.infer<typeof PilotFormSchema>;

export default function PilotIntakePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<PilotFormData>>({
    preferredNight: 'flexible',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pilotSlotsRemaining] = useState(2); // TODO: Fetch from API

  const pilot = PRICING_TIERS.pilot;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      const validated = PilotFormSchema.parse(formData);
      
      // TODO: Submit to API
      console.log('Submitting pilot intake:', validated);
      
      // Redirect to checkout
      router.push(`/checkout?tier=pilot&email=${encodeURIComponent(validated.email)}`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(issue => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-ink py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <H1 className="mb-4">Claim Your Pilot Night</H1>
          <Body className="text-gray-300 max-w-2xl mx-auto">
            One shoot. 30 photos. 72-hour delivery. Prove we deliver before you commit.
          </Body>
        </div>

        {/* Scarcity Banner */}
        <div className="mb-8">
          <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4 flex items-center justify-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <p className="text-amber-400 font-semibold">
              {SCARCITY.message(pilotSlotsRemaining)}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <GlassCard>
              <form onSubmit={handleSubmit} className="space-y-6">
                <H2 className="text-xl mb-6">Venue Information</H2>

                {/* Venue Name */}
                <div>
                  <label htmlFor="venueName" className="block text-sm font-medium text-gray-300 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    id="venueName"
                    name="venueName"
                    value={formData.venueName || ''}
                    onChange={handleChange}
                    placeholder="e.g., The Warehouse Minneapolis"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                      errors.venueName ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.venueName && (
                    <p className="mt-1 text-sm text-red-400">{errors.venueName}</p>
                  )}
                </div>

                {/* Contact Name */}
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName || ''}
                    onChange={handleChange}
                    placeholder="Full name"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                      errors.contactName ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-400">{errors.contactName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="you@venue.com"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                      errors.email ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="(612) 555-0123"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                      errors.phone ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Preferred Night */}
                <div>
                  <label htmlFor="preferredNight" className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Night
                  </label>
                  <select
                    id="preferredNight"
                    name="preferredNight"
                    value={formData.preferredNight || 'flexible'}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  >
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any special requests or details about your venue..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
                  />
                </div>

                {/* Submit */}
                <MagneticButton
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : `Claim Your Pilot - ${pilot.priceDisplay}`}
                </MagneticButton>

                <p className="text-center text-sm text-gray-500">
                  Secure payment via Stripe. No subscription required.
                </p>
              </form>
            </GlassCard>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Package Summary */}
              <GlassCard accent="gold">
                <h3 className="text-lg font-semibold text-white mb-4">Pilot Package</h3>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-brand-gold">{pilot.priceDisplay}</span>
                  <span className="text-gray-400 ml-2">one-time</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {pilot.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-brand-gold flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Camera className="w-4 h-4" />
                    <span>{pilot.photos} edited photos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{pilot.delivery} delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Flexible scheduling</span>
                  </div>
                </div>
              </GlassCard>

              {/* Trust Signals */}
              <GlassCard padding="sm">
                <div className="text-center space-y-2">
                  <Small className="block">Minneapolis Specialist</Small>
                  <Small className="block">79.7K views generated</Small>
                  <Small className="block">MN tax aligned</Small>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
