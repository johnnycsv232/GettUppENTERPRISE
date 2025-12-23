/**
 * @file index.ts
 * @description MCP and external service integrations for GettUpp Enterprise
 * @module lib/integrations
 *
 * Active Integrations:
 * - Notion: Business Hub as source of truth
 * - Cal.com: Scheduling and bookings
 * - Stripe: Payments (via ../stripe.ts)
 * - Firebase: Database and auth (via ../firebase-admin.ts)
 *
 * To enable an integration:
 * 1. Add the API key to .env.local
 * 2. Import and use the functions from this module
 */

// Cal.com Scheduling Integration
export {
	type BookingRequest,
	CAL_CONFIG,
	type CalendarEvent,
	cancelBooking,
	createBooking,
	getAvailableSlots,
	getBooking,
	rescheduleBooking,
} from "./calendar";
// Notion Business Hub Integration
export {
	fetchNotionProjects,
	NOTION_CONFIG,
	type NotionClient,
	type NotionProject,
	syncLeadToNotion,
} from "./notion";

/**
 * Integration health check
 * Verifies which integrations are properly configured
 */
export function checkIntegrationHealth(): {
	notion: boolean;
	calendar: boolean;
	stripe: boolean;
	firebase: boolean;
} {
	return {
		notion: Boolean(process.env.NOTION_API_KEY),
		calendar: Boolean(process.env.CAL_API_KEY),
		stripe: Boolean(process.env.STRIPE_SECRET_KEY),
		firebase: Boolean(
			process.env.FIREBASE_ADMIN_PROJECT_ID &&
				process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
				process.env.FIREBASE_ADMIN_PRIVATE_KEY,
		),
	};
}
