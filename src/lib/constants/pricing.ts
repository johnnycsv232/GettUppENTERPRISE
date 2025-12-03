/**
 * @file pricing.ts
 * @description CANONICAL pricing data - Single source of truth
 * @module lib/constants/pricing
 * 
 * CRITICAL: All pricing displays MUST use these constants
 * DO NOT hardcode prices anywhere else in the codebase
 */

export type TierId = 'pilot' | 't1' | 't2' | 't3';
export type Interval = 'one-time' | 'monthly';

export interface PricingTier {
  id: TierId;
  name: string;
  displayName: string;
  tagline: string;
  price: number;
  priceDisplay: string;
  interval: Interval;
  shoots: number;
  photos: number;
  reels: number;
  delivery: string;
  description: string;
  features: string[];
  popular?: boolean;
  scarcity?: boolean;
  breakeven?: number;
}

/**
 * CANONICAL PRICING TIERS
 * Source: GUX-CANON-PRICING, GUX-BA-201 to GUX-BA-203
 */
export const PRICING_TIERS: Record<TierId, PricingTier> = {
  pilot: {
    id: 'pilot',
    name: 'Pilot Night',
    displayName: 'Pilot',
    tagline: 'Test our engine before you commit',
    price: 345,
    priceDisplay: '$345',
    interval: 'one-time',
    shoots: 1,
    photos: 30,
    reels: 0,
    delivery: '72h',
    description: 'One shoot to prove we deliver. Limited to 3 venues/month.',
    features: [
      '1 professional shoot',
      '30 edited photos',
      '72-hour delivery',
      'Commercial license included',
      'No commitment required',
    ],
    scarcity: true,
  },
  t1: {
    id: 't1',
    name: 'Tier 1: Friday Nights',
    displayName: 'Tier 1',
    tagline: 'Essential coverage for emerging venues',
    price: 445,
    priceDisplay: '$445',
    interval: 'monthly',
    shoots: 1,
    photos: 30,
    reels: 0,
    delivery: '72h',
    description: 'Consistent weekly content to build your presence.',
    features: [
      '1 shoot per month',
      '30 edited photos',
      '72-hour delivery',
      'Priority booking',
      'Dedicated support',
    ],
  },
  t2: {
    id: 't2',
    name: 'Tier 2: Weekend Warrior',
    displayName: 'Tier 2',
    tagline: 'Full content engine for growing venues',
    price: 695, // CORRECT: $695, NOT $655
    priceDisplay: '$695',
    interval: 'monthly',
    shoots: 2, // CORRECT: 2 shoots, NOT 8
    photos: 60,
    reels: 2,
    delivery: '48h',
    description: 'Double the coverage for Fri/Sat programming.',
    features: [
      '2 shoots per month',
      '60 edited photos',
      '2 professional reels',
      '48-hour delivery',
      'Route-batched scheduling',
    ],
    popular: true,
  },
  t3: {
    id: 't3',
    name: 'Tier 3: VIP Partner',
    displayName: 'VIP',
    tagline: 'White-glove service for premium venues',
    price: 995, // CORRECT: $995, NOT $993
    priceDisplay: '$995',
    interval: 'monthly',
    shoots: 3, // CORRECT: 3 shoots, NOT unlimited
    photos: 80,
    reels: 3,
    delivery: '24h',
    description: 'Maximum coverage with fastest turnaround.',
    features: [
      '3 shoots per month',
      '80 edited photos',
      '3 professional reels',
      '24-hour priority delivery',
      'Dedicated account manager',
      'Custom content strategy',
    ],
    breakeven: 3, // "3 new regulars pays for itself"
  },
};

/**
 * EDITING-ONLY SERVICE
 * Source: GUX-EDT001A to GUX-EDT010M
 */
export const EDITING_ONLY = {
  id: 'editing-only',
  name: 'Editing-Only',
  price: 199,
  priceDisplay: '$199',
  interval: 'one-time' as Interval,
  photos: 30,
  delivery: '72h',
  description: 'Already shot in-house? Get the GettUpp look without the shoot.',
  features: [
    'Up to 30 photos edited',
    '72-hour turnaround',
    'Skin, color & lighting cleanup',
    'Before/after comparison',
  ],
  addOns: {
    rush: { price: 75, description: 'Rush delivery (24h)' },
    advancedRetouch: { price: 15, description: 'Advanced retouch per photo' },
    objectRemoval: { price: 25, description: 'Object removal per photo' },
  },
};

/**
 * Get tier by ID
 */
export function getTier(id: TierId): PricingTier {
  return PRICING_TIERS[id];
}

/**
 * Get all tiers as array (for mapping in UI)
 */
export function getAllTiers(): PricingTier[] {
  return Object.values(PRICING_TIERS);
}

/**
 * Get subscription tiers only (excludes pilot)
 */
export function getSubscriptionTiers(): PricingTier[] {
  return Object.values(PRICING_TIERS).filter(t => t.interval === 'monthly');
}

/**
 * ROI Calculator - "The Math Is Simple"
 */
export const ROI_MATH = {
  vipCost: 995,
  avgRegularValue: 350,
  breakeven: 3,
  tagline: 'It takes just 3 new regulars to pay for our highest tier.',
};

/**
 * Scarcity messaging
 */
export const SCARCITY = {
  pilotSlotsPerMonth: 3,
  message: (remaining: number) => 
    `Only ${remaining}/${SCARCITY.pilotSlotsPerMonth} Pilot slots left this month`,
};
