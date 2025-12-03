/**
 * @file route.ts
 * @description Agent orchestration API - Secure endpoint for agent tasks
 * @module api/agents/run
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Request validation schema
const RequestSchema = z.object({
  agentType: z.enum(['social', 'asset', 'outbound', 'finance', 'strategy']),
  clientId: z.string().min(1, 'clientId is required'),
  shootId: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Agent type descriptions
const AGENT_DESCRIPTIONS = {
  social: 'Social media content scheduling and posting',
  asset: 'Photo/video asset processing and optimization',
  outbound: 'Lead outreach and follow-up automation',
  finance: 'Invoice generation and payment tracking',
  strategy: 'Content strategy and performance analysis',
};

/**
 * POST /api/agents/run
 * Queue an agent task for execution
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Auth check
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.AGENT_SECRET_KEY}`;

  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing authorization token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validated = RequestSchema.parse(body);

    const db = adminDb();
    const taskId = randomUUID();
    const now = new Date();

    // Create agent task document
    const taskData = {
      taskId,
      agentType: validated.agentType,
      agentDescription: AGENT_DESCRIPTIONS[validated.agentType],
      clientId: validated.clientId,
      shootId: validated.shootId || null,
      priority: validated.priority,
      metadata: validated.metadata || {},
      status: 'queued',
      createdAt: now,
      updatedAt: now,
      startedAt: null,
      completedAt: null,
      error: null,
      retryCount: 0,
      maxRetries: 3,
    };

    await db.collection('agent_tasks').doc(taskId).set(taskData);

    console.log(`✅ Agent task queued: ${taskId} (${validated.agentType})`);

    return NextResponse.json({
      taskId,
      status: 'queued',
      agentType: validated.agentType,
      message: `Task queued for ${AGENT_DESCRIPTIONS[validated.agentType]}`,
    });
  } catch (error) {
    console.error('Agent API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agents/run?taskId=xxx
 * Check status of an agent task
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Auth check
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.AGENT_SECRET_KEY}`;

  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const taskId = request.nextUrl.searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json(
      { error: 'taskId query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const db = adminDb();
    const doc = await db.collection('agent_tasks').doc(taskId).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(doc.data());
  } catch (error) {
    console.error('Agent status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
