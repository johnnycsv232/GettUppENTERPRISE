/**
 * @file alerts.ts
 * @description Slack webhook integration for alerts
 * @module lib/monitoring/alerts
 */

export type AlertLevel = 'info' | 'warning' | 'error' | 'critical';

export interface Alert {
  level: AlertLevel;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

// Alert thresholds
const THRESHOLDS = {
  errorRatePercent: 1, // Alert if error rate > 1%
  webhookFailures: 3,  // Alert after 3 consecutive failures
  responseTimeMs: 5000, // Alert if response > 5s
};

// Tracking for threshold-based alerts
let errorCount = 0;
let totalRequests = 0;
let webhookFailureStreak = 0;

/**
 * Send alert to Slack
 */
export async function sendSlackAlert(alert: Alert): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('[ALERT] Slack webhook not configured:', alert);
    return;
  }

  const color = {
    info: '#36a64f',
    warning: '#ffcc00',
    error: '#ff6600',
    critical: '#ff0000',
  }[alert.level];

  const payload = {
    attachments: [
      {
        color,
        title: `[${alert.level.toUpperCase()}] ${alert.title}`,
        text: alert.message,
        fields: alert.metadata
          ? Object.entries(alert.metadata).map(([key, value]) => ({
              title: key,
              value: String(value),
              short: true,
            }))
          : [],
        footer: 'GettUpp Enterprise',
        ts: Math.floor(alert.timestamp.getTime() / 1000),
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('[ALERT] Failed to send Slack alert:', error);
  }
}

/**
 * Track request for error rate monitoring
 */
export function trackRequest(success: boolean): void {
  totalRequests++;
  if (!success) errorCount++;

  // Check threshold every 100 requests
  if (totalRequests % 100 === 0) {
    const errorRate = (errorCount / totalRequests) * 100;
    if (errorRate > THRESHOLDS.errorRatePercent) {
      sendSlackAlert({
        level: 'warning',
        title: 'High Error Rate Detected',
        message: `Error rate is ${errorRate.toFixed(2)}% (threshold: ${THRESHOLDS.errorRatePercent}%)`,
        metadata: {
          errorCount,
          totalRequests,
          errorRate: `${errorRate.toFixed(2)}%`,
        },
        timestamp: new Date(),
      });
    }

    // Reset counters
    errorCount = 0;
    totalRequests = 0;
  }
}

/**
 * Track webhook result
 */
export function trackWebhook(success: boolean): void {
  if (success) {
    webhookFailureStreak = 0;
  } else {
    webhookFailureStreak++;

    if (webhookFailureStreak >= THRESHOLDS.webhookFailures) {
      sendSlackAlert({
        level: 'error',
        title: 'Webhook Failures',
        message: `${webhookFailureStreak} consecutive webhook failures detected`,
        metadata: {
          failureStreak: webhookFailureStreak,
        },
        timestamp: new Date(),
      });
    }
  }
}

/**
 * Alert on critical errors
 */
export async function alertCriticalError(
  title: string,
  error: Error,
  context?: Record<string, unknown>
): Promise<void> {
  await sendSlackAlert({
    level: 'critical',
    title,
    message: error.message,
    metadata: {
      stack: error.stack?.substring(0, 500),
      ...context,
    },
    timestamp: new Date(),
  });
}

/**
 * Alert on payment issues
 */
export async function alertPaymentIssue(
  customerId: string,
  amount: number,
  issue: string
): Promise<void> {
  await sendSlackAlert({
    level: 'warning',
    title: 'Payment Issue',
    message: issue,
    metadata: {
      customerId,
      amount: `$${(amount / 100).toFixed(2)}`,
    },
    timestamp: new Date(),
  });
}

/**
 * Alert on security event
 */
export async function alertSecurityEvent(
  event: string,
  details: Record<string, unknown>
): Promise<void> {
  await sendSlackAlert({
    level: 'critical',
    title: 'Security Alert',
    message: event,
    metadata: details,
    timestamp: new Date(),
  });
}
