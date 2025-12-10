/**
 * @file api/admin/metrics/route.ts
 * @description Admin dashboard metrics API
 * @module app/api/admin/metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/security/auth-api';
import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface DashboardMetrics {
  mrr: number;
  activeClients: number;
  pilotsThisMonth: number;
  conversionRate: number;
  recentActivity?: ActivityItem[];
}

interface ActivityItem {
  type: 'pilot' | 'payment' | 'delivery';
  venue: string;
  action: string;
  timestamp: string;
}

/**
 * GET /api/admin/metrics
 * Fetch dashboard metrics for admin panel
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const db = adminDb();
      const tierPrices: Record<string, number> = { t1: 445, t2: 695, vip: 995 };
      
      // Get active clients
      const clientsSnapshot = await db.collection('clients')
        .where('subscriptionStatus', '==', 'active')
        .get();
      
      // Calculate MRR
      let mrr = 0;
      clientsSnapshot.forEach(doc => {
        const tier = doc.data().tier as string;
        if (tier && tierPrices[tier]) {
          mrr += tierPrices[tier];
        }
      });
      
      // Get pilots this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const leadsSnapshot = await db.collection('leads')
        .where('status', '==', 'pilot')
        .where('createdAt', '>=', startOfMonth)
        .get();
      
      // Get recent payments for activity feed
      const paymentsSnapshot = await db.collection('payments')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
      
      const recentActivity: ActivityItem[] = paymentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          type: data.status === 'completed' ? 'payment' : 'pilot',
          venue: data.customerEmail || 'Unknown',
          action: data.status === 'completed' 
            ? `Payment received: $${(data.amount / 100).toFixed(0)}` 
            : 'Payment processing',
          timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
      });

      // Calculate conversion rate (leads that became clients)
      const totalLeads = (await db.collection('leads').count().get()).data().count;
      const convertedLeads = clientsSnapshot.size;
      const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

      const metrics: DashboardMetrics = {
        mrr,
        activeClients: clientsSnapshot.size,
        pilotsThisMonth: leadsSnapshot.size,
        conversionRate,
        recentActivity,
      };

      return NextResponse.json(metrics);
    } catch (error) {
      console.error('Metrics fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch metrics' },
        { status: 500 }
      );
    }
  });
}
