/**
 * @file admin/billing/page.tsx
 * @description Stripe billing management - subscriptions, invoices, and payments
 * @module app/admin/billing
 */

'use client';

import { useState } from 'react';
import { H2, Body } from '@/components/ui/Typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { 
  CreditCard, DollarSign, Receipt, Users, AlertCircle, 
  CheckCircle, Clock, ExternalLink, Terminal, RefreshCw,
  TrendingUp, ArrowUpRight
} from 'lucide-react';

interface Subscription {
  id: string;
  venueName: string;
  tier: 'pilot' | 't1' | 't2' | 'vip';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  amount: number;
  nextBilling: string;
  customerId: string;
}

interface Invoice {
  id: string;
  venueName: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  invoiceUrl: string;
}

const SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub_1', venueName: 'Skybar', tier: 't2', status: 'active', amount: 695, nextBilling: '2025-01-07', customerId: 'cus_xxx1' },
  { id: 'sub_2', venueName: 'Noir Club', tier: 'vip', status: 'active', amount: 995, nextBilling: '2025-01-10', customerId: 'cus_xxx2' },
  { id: 'sub_3', venueName: 'The Loft', tier: 't1', status: 'active', amount: 445, nextBilling: '2025-01-15', customerId: 'cus_xxx3' },
  { id: 'sub_4', venueName: 'Electric Lounge', tier: 't2', status: 'past_due', amount: 695, nextBilling: '2024-12-01', customerId: 'cus_xxx4' },
  { id: 'sub_5', venueName: 'Uptown Social', tier: 't1', status: 'active', amount: 445, nextBilling: '2025-01-20', customerId: 'cus_xxx5' },
];

const RECENT_INVOICES: Invoice[] = [
  { id: 'inv_1', venueName: 'Noir Club', amount: 995, status: 'paid', date: '2024-12-10', invoiceUrl: '#' },
  { id: 'inv_2', venueName: 'Skybar', amount: 695, status: 'paid', date: '2024-12-07', invoiceUrl: '#' },
  { id: 'inv_3', venueName: 'The Loft (Pilot)', amount: 345, status: 'paid', date: '2024-12-05', invoiceUrl: '#' },
  { id: 'inv_4', venueName: 'Electric Lounge', amount: 695, status: 'failed', date: '2024-12-01', invoiceUrl: '#' },
  { id: 'inv_5', venueName: 'Uptown Social', amount: 445, status: 'paid', date: '2024-11-20', invoiceUrl: '#' },
];

const TIER_PRICES = {
  pilot: 345,
  t1: 445,
  t2: 695,
  vip: 995,
};

const STATUS_STYLES = {
  active: 'bg-green-500/20 text-green-400 border-green-500/50',
  past_due: 'bg-red-500/20 text-red-400 border-red-500/50',
  canceled: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  trialing: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  paid: 'bg-green-500/20 text-green-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  failed: 'bg-red-500/20 text-red-400',
};

export default function BillingPage() {
  const [selectedTab, setSelectedTab] = useState<'subscriptions' | 'invoices'>('subscriptions');
  const [syncing, setSyncing] = useState(false);

  const totalMrr = SUBSCRIPTIONS
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  const activeCount = SUBSCRIPTIONS.filter(s => s.status === 'active').length;
  const pastDueCount = SUBSCRIPTIONS.filter(s => s.status === 'past_due').length;

  const handleSyncStripe = async () => {
    setSyncing(true);
    // In production, sync with Stripe API
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('✅ Synced with Stripe');
    setSyncing(false);
  };

  const handleOpenStripeDashboard = () => {
    window.open('https://dashboard.stripe.com', '_blank');
  };

  return (
    <main className="min-h-screen bg-[var(--brand-ink)] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <H2>Billing & Subscriptions</H2>
            <Body className="text-gray-400 mt-1">Manage Stripe payments and subscriptions</Body>
          </div>
          <div className="flex gap-3">
            <MagneticButton variant="outline" onClick={handleSyncStripe} disabled={syncing}>
              <RefreshCw className={`w-4 h-4 mr-2 inline ${syncing ? 'animate-spin' : ''}`} />
              Sync Stripe
            </MagneticButton>
            <MagneticButton onClick={handleOpenStripeDashboard}>
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              Stripe Dashboard
            </MagneticButton>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${totalMrr.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Monthly Recurring Revenue</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{activeCount}</p>
                <p className="text-sm text-gray-400">Active Subscriptions</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pastDueCount}</p>
                <p className="text-sm text-gray-400">Past Due</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">67%</p>
                <p className="text-sm text-gray-400">Pilot → Retainer Rate</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setSelectedTab('subscriptions')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              selectedTab === 'subscriptions'
                ? 'text-[var(--brand-gold)] border-b-2 border-[var(--brand-gold)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            Subscriptions
          </button>
          <button
            onClick={() => setSelectedTab('invoices')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              selectedTab === 'invoices'
                ? 'text-[var(--brand-gold)] border-b-2 border-[var(--brand-gold)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4 inline mr-2" />
            Recent Invoices
          </button>
        </div>

        {/* Subscriptions Table */}
        {selectedTab === 'subscriptions' && (
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                    <th className="pb-3">Venue</th>
                    <th className="pb-3">Tier</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Next Billing</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {SUBSCRIPTIONS.map(sub => (
                    <tr key={sub.id} className="border-b border-white/5">
                      <td className="py-4 font-medium text-white">{sub.venueName}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded text-xs bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] uppercase">
                          {sub.tier}
                        </span>
                      </td>
                      <td className="py-4 text-green-400 font-medium">${sub.amount}/mo</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs border ${STATUS_STYLES[sub.status]}`}>
                          {sub.status === 'active' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                          {sub.status === 'past_due' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                          {sub.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 text-gray-300">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(sub.nextBilling).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <button className="text-[var(--brand-gold)] hover:underline text-sm">
                          Manage <ArrowUpRight className="w-3 h-3 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Invoices Table */}
        {selectedTab === 'invoices' && (
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                    <th className="pb-3">Invoice</th>
                    <th className="pb-3">Venue</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {RECENT_INVOICES.map(inv => (
                    <tr key={inv.id} className="border-b border-white/5">
                      <td className="py-4 font-mono text-gray-400">{inv.id}</td>
                      <td className="py-4 font-medium text-white">{inv.venueName}</td>
                      <td className="py-4 text-green-400 font-medium">${inv.amount}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${STATUS_STYLES[inv.status]}`}>
                          {inv.status === 'paid' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                          {inv.status === 'failed' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-300">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="py-4">
                        <a href={inv.invoiceUrl} className="text-[var(--brand-gold)] hover:underline text-sm">
                          View <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Stripe CLI Commands */}
        <GlassCard className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-[var(--brand-gold)]" />
            <h3 className="text-lg font-semibold text-white">Stripe CLI Commands</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm font-mono">
            <div className="p-3 bg-black/30 rounded-lg">
              <p className="text-gray-400 mb-1"># Login to Stripe</p>
              <code className="text-[var(--brand-gold)]">stripe login</code>
            </div>
            <div className="p-3 bg-black/30 rounded-lg">
              <p className="text-gray-400 mb-1"># Listen for webhooks</p>
              <code className="text-[var(--brand-gold)]">stripe listen --forward-to localhost:3000/api/webhooks/stripe</code>
            </div>
            <div className="p-3 bg-black/30 rounded-lg">
              <p className="text-gray-400 mb-1"># List subscriptions</p>
              <code className="text-[var(--brand-gold)]">stripe subscriptions list --limit 10</code>
            </div>
            <div className="p-3 bg-black/30 rounded-lg">
              <p className="text-gray-400 mb-1"># Check balance</p>
              <code className="text-[var(--brand-gold)]">stripe balance retrieve</code>
            </div>
            <div className="p-3 bg-black/30 rounded-lg">
              <p className="text-gray-400 mb-1"># List recent payments</p>
              <code className="text-[var(--brand-gold)]">stripe payment_intents list --limit 5</code>
            </div>
            <div className="p-3 bg-black/30 rounded-lg">
              <p className="text-gray-400 mb-1"># Trigger test webhook</p>
              <code className="text-[var(--brand-gold)]">stripe trigger checkout.session.completed</code>
            </div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
