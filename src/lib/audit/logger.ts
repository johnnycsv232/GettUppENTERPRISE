/**
 * @file logger.ts
 * @description Audit logging for admin actions and payment events
 * @module lib/audit/logger
 */

export type AuditAction =
	| "user.login"
	| "user.logout"
	| "user.register"
	| "client.create"
	| "client.update"
	| "client.delete"
	| "shoot.create"
	| "shoot.update"
	| "shoot.complete"
	| "payment.created"
	| "payment.completed"
	| "payment.failed"
	| "payment.refunded"
	| "subscription.created"
	| "subscription.updated"
	| "subscription.cancelled"
	| "agent.task_queued"
	| "agent.task_completed"
	| "agent.task_failed"
	| "admin.access"
	| "admin.settings_change"
	| "security.rate_limited"
	| "security.auth_failed";

export interface AuditLogEntry {
	id?: string;
	timestamp: Date;
	action: AuditAction;
	userId?: string;
	userEmail?: string;
	resourceType?: string;
	resourceId?: string;
	metadata?: Record<string, unknown>;
	ipAddress?: string;
	userAgent?: string;
	success: boolean;
	errorMessage?: string;
}

/**
 * In-memory log store (replace with Firestore in production)
 */
const auditLogs: AuditLogEntry[] = [];

/**
 * Log an audit event
 */
export async function logAudit(
	entry: Omit<AuditLogEntry, "id" | "timestamp">,
): Promise<void> {
	const logEntry: AuditLogEntry = {
		...entry,
		id: crypto.randomUUID(),
		timestamp: new Date(),
	};

	// Store in memory (TODO: persist to Firestore)
	auditLogs.push(logEntry);

	// Log to console in development
	if (process.env.NODE_ENV === "development") {
		console.log(`[AUDIT] ${logEntry.action}`, {
			userId: logEntry.userId,
			resourceId: logEntry.resourceId,
			success: logEntry.success,
		});
	}

	// In production, you would:
	// 1. Write to Firestore 'audit_logs' collection
	// 2. Send critical events to Slack/PagerDuty
	// 3. Track in analytics

	// Alert on security events
	if (logEntry.action.startsWith("security.") && !logEntry.success) {
		await alertSecurityEvent(logEntry);
	}
}

/**
 * Alert on security events
 */
async function alertSecurityEvent(entry: AuditLogEntry): Promise<void> {
	// TODO: Integrate with Slack webhook
	console.error(`[SECURITY ALERT] ${entry.action}`, {
		userId: entry.userId,
		ipAddress: entry.ipAddress,
		errorMessage: entry.errorMessage,
	});
}

/**
 * Log payment event
 */
export async function logPaymentEvent(
	action:
		| "payment.created"
		| "payment.completed"
		| "payment.failed"
		| "payment.refunded",
	paymentId: string,
	amount: number,
	customerId?: string,
	metadata?: Record<string, unknown>,
): Promise<void> {
	await logAudit({
		action,
		resourceType: "payment",
		resourceId: paymentId,
		userId: customerId,
		metadata: { amount, ...metadata },
		success: action !== "payment.failed",
	});
}

/**
 * Log admin action
 */
export async function logAdminAction(
	action: "admin.access" | "admin.settings_change",
	adminUserId: string,
	details: Record<string, unknown>,
): Promise<void> {
	await logAudit({
		action,
		userId: adminUserId,
		metadata: details,
		success: true,
	});
}

/**
 * Get recent audit logs (for admin dashboard)
 */
export function getRecentLogs(limit: number = 100): AuditLogEntry[] {
	return auditLogs.slice(-limit).reverse();
}

/**
 * Get logs by user
 */
export function getLogsByUser(
	userId: string,
	limit: number = 50,
): AuditLogEntry[] {
	return auditLogs
		.filter((log) => log.userId === userId)
		.slice(-limit)
		.reverse();
}

/**
 * Get logs by action type
 */
export function getLogsByAction(
	action: AuditAction,
	limit: number = 50,
): AuditLogEntry[] {
	return auditLogs
		.filter((log) => log.action === action)
		.slice(-limit)
		.reverse();
}
