/**
 * @file firestore.ts
 * @description Firestore collection type definitions - STRICT typing, no any
 * @module types/firestore
 */

import { z } from 'zod';

// ============================================
// Enum Types
// ============================================

export type Tier = 'pilot' | 't1' | 't2' | 'vip';
export type SubscriptionStatus = 'active' | 'paused' | 'churned';
export type ShootStatus = 'scheduled' | 'in_progress' | 'editing' | 'delivered' | 'archived';
export type LeadSource = 'instagram_dm' | 'website_form' | 'referral' | 'cold_outreach' | 'event';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost';
export type SLA = '24h' | '48h' | '72h';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type Neighborhood = 'north_loop' | 'warehouse' | 'uptown' | 'downtown' | 'northeast' | 'other';

// ============================================
// Collection: clients
// ============================================

export interface Client {
  id: string;
  stripeCustomerId: string;
  name: string;
  email: string;
  phone?: string;
  tier: Tier;
  subscriptionId: string;
  subscriptionStatus: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
  nextShootDate?: Date;
  totalShoots: number;
  metadata: {
    venue?: string;
    neighborhood?: Neighborhood;
    notes?: string;
    instagram?: string;
  };
}

export const ClientSchema = z.object({
  id: z.string(),
  stripeCustomerId: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  tier: z.enum(['pilot', 't1', 't2', 'vip']),
  subscriptionId: z.string(),
  subscriptionStatus: z.enum(['active', 'paused', 'churned']),
  createdAt: z.date(),
  updatedAt: z.date(),
  nextShootDate: z.date().optional(),
  totalShoots: z.number().default(0),
  metadata: z.object({
    venue: z.string().optional(),
    neighborhood: z.enum(['north_loop', 'warehouse', 'uptown', 'downtown', 'northeast', 'other']).optional(),
    notes: z.string().optional(),
    instagram: z.string().optional(),
  }),
});

// ============================================
// Collection: shoots
// ============================================

export interface Shoot {
  id: string;
  clientId: string;
  date: Date;
  location: string;
  status: ShootStatus;
  photoCount: number;
  reelCount: number;
  deliveredAt?: Date;
  sla: SLA;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ShootSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  date: z.date(),
  location: z.string().min(1),
  status: z.enum(['scheduled', 'in_progress', 'editing', 'delivered', 'archived']),
  photoCount: z.number().default(0),
  reelCount: z.number().default(0),
  deliveredAt: z.date().optional(),
  sla: z.enum(['24h', '48h', '72h']),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ============================================
// Collection: leads
// ============================================

export interface Lead {
  id: string;
  source: LeadSource;
  email: string;
  name?: string;
  phone?: string;
  venue?: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  assignedTo?: string;
  convertedToClientId?: string;
}

export const LeadSchema = z.object({
  id: z.string(),
  source: z.enum(['instagram_dm', 'website_form', 'referral', 'cold_outreach', 'event']),
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  venue: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'converted', 'lost']),
  createdAt: z.date(),
  updatedAt: z.date(),
  notes: z.string().default(''),
  assignedTo: z.string().optional(),
  convertedToClientId: z.string().optional(),
});

// ============================================
// Collection: payments
// ============================================

export interface Payment {
  id: string;
  clientId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: 'usd';
  status: PaymentStatus;
  description: string;
  createdAt: Date;
  metadata?: {
    shootId?: string;
    tier?: Tier;
  };
}

export const PaymentSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  stripePaymentIntentId: z.string(),
  amount: z.number().positive(),
  currency: z.literal('usd'),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  description: z.string(),
  createdAt: z.date(),
  metadata: z.object({
    shootId: z.string().optional(),
    tier: z.enum(['pilot', 't1', 't2', 'vip']).optional(),
  }).optional(),
});

// ============================================
// Collection: site_content (CMS)
// ============================================

export interface SiteContent {
  id: string;
  key: string;
  content: Record<string, unknown>;
  updatedAt: Date;
  updatedBy: string;
}

// ============================================
// Firestore Timestamp Helpers
// ============================================

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export function toDate(timestamp: FirestoreTimestamp): Date {
  return new Date(timestamp.seconds * 1000);
}

export function toFirestoreTimestamp(date: Date): FirestoreTimestamp {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1000000,
  };
}
