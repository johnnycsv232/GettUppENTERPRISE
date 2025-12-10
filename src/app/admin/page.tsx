/**
 * @file admin/page.tsx
 * @description Admin Dashboard - Business metrics overview
 * @module app/admin
 */

'use client';

import { useEffect, useState } from 'react';
import { H2, Body } from '@/components/ui/Typography';
import { GlassCard } from '@/components/ui/GlassCard';

interface Metrics {
  mrr: number;
  activeClients: number;
  pilotsThisMonth: number;
  conversionRate: number;
}

/**
 * AdminPage - Dashboard showing key business metrics
 * Protected by middleware (requires auth-token cookie)
 */
export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    mrr: 0,
    activeClients: 0,
    pilotsThisMonth: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        } else {
          // Use placeholder data if API not available
          setMetrics({
            mrr: 4485,
            activeClients: 6,
            pilotsThisMonth: 3,
            conversionRate: 67,
          });
        }
      } catch (err) {
        console.error('Metrics fetch error:', err);
        setError('Failed to load metrics');
        // Use placeholder data
        setMetrics({
          mrr: 4485,
          activeClients: 6,
          pilotsThisMonth: 3,
          conversionRate: 67,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--brand-ink)] text-white flex items-center justify-center">
        <div className="text-[var(--brand-gold)] text-xl animate-pulse">Loading dashboard...</div>
      </main>
    );
  }

  const cards = [
    { label: 'MRR', value: `$${metrics.mrr.toLocaleString()}`, description: 'Monthly Recurring Revenue' },
    { label: 'Active Clients', value: metrics.activeClients, description: 'Currently subscribed venues' },
    { label: 'Pilots This Month', value: metrics.pilotsThisMonth, description: 'New pilot trials started' },
    { label: 'Conversion Rate', value: `${metrics.conversionRate}%`, description: 'Pilot → Retainer conversion' },
  ];

  return (
    <main className="min-h-screen bg-[var(--brand-ink)] text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <H2>Admin Dashboard</H2>
          <Body className="text-gray-400 mt-2">
            GettUpp ENT business metrics overview
          </Body>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-300 text-sm">
            ⚠️ {error} - Showing placeholder data
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {cards.map((card) => (
            <GlassCard key={card.label} padding="lg">
              <Body className="text-gray-400 text-sm">{card.label}</Body>
              <div className="text-4xl font-bold text-[var(--brand-gold)] mt-2">{card.value}</div>
              <Body className="text-gray-500 text-xs mt-2">{card.description}</Body>
            </GlassCard>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              title="📅 Calendar"
              description="Schedule and manage photo shoots"
              href="/admin/calendar"
            />
            <ActionCard
              title="📝 CMS"
              description="Edit landing page content"
              href="/admin/cms"
            />
            <ActionCard
              title="📊 Analytics"
              description="Revenue and conversion metrics"
              href="/admin/analytics"
            />
            <ActionCard
              title="💳 Billing"
              description="Stripe subscriptions and invoices"
              href="/admin/billing"
            />
            <ActionCard
              title="🎯 Leads"
              description="Review pilot intake submissions"
              href="/admin/leads"
            />
            <ActionCard
              title="🚀 Deploy"
              description="Push updates to production"
              href="#"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <GlassCard>
            <div className="space-y-4">
              <ActivityItem
                type="pilot"
                venue="The Loft"
                action="Pilot intake submitted"
                time="2 hours ago"
              />
              <ActivityItem
                type="payment"
                venue="Skybar"
                action="T2 subscription renewed"
                time="1 day ago"
              />
              <ActivityItem
                type="delivery"
                venue="Noir Club"
                action="Gallery delivered (48 photos)"
                time="2 days ago"
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}

// ============================================
// Sub-components
// ============================================

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
}

function ActionCard({ title, description, href }: ActionCardProps) {
  return (
    <a
      href={href}
      className="block p-4 rounded-lg border border-white/10 hover:border-[var(--brand-gold)]/50 hover:bg-white/5 transition-all"
    >
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </a>
  );
}

interface ActivityItemProps {
  type: 'pilot' | 'payment' | 'delivery';
  venue: string;
  action: string;
  time: string;
}

function ActivityItem({ type, venue, action, time }: ActivityItemProps) {
  const icons = {
    pilot: '🎯',
    payment: '💰',
    delivery: '📸',
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icons[type]}</span>
        <div>
          <p className="text-white font-medium">{venue}</p>
          <p className="text-sm text-gray-400">{action}</p>
        </div>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}
