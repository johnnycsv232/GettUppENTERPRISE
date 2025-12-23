/**
 * @file calendar.ts
 * @description Cal.com integration for GettUpp scheduling
 * @module lib/integrations/calendar
 */

/**
 * Cal.com Configuration
 * Used for scheduling pilot consultations and shoot sessions
 */
export const CAL_CONFIG = {
	// Cal.com API base URL
	API_BASE: "https://api.cal.com/v2",

	// Default event type for pilot consultations
	DEFAULT_EVENT_DURATION: 30, // minutes

	// Booking categories
	EVENT_TYPES: {
		PILOT_CONSULTATION: "pilot-consultation",
		SHOOT_BOOKING: "shoot-booking",
		STRATEGY_CALL: "strategy-call",
	},
} as const;

/**
 * Type definitions for calendar data
 */
export interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	attendees: { name: string; email: string }[];
	metadata?: Record<string, string>;
}

export interface BookingRequest {
	eventTypeId: number;
	start: string; // ISO 8601 UTC
	attendee: {
		name: string;
		email: string;
		timeZone: string;
	};
	metadata?: Record<string, string>;
}

/**
 * Get available time slots for a given event type
 * @param eventTypeId - Cal.com event type ID
 * @param startDate - Start of availability window
 * @param endDate - End of availability window
 */
export async function getAvailableSlots(
	eventTypeId: number,
	startDate: Date,
	endDate: Date,
): Promise<{ date: string; slots: string[] }[]> {
	const calApiKey = process.env.CAL_API_KEY;

	if (!calApiKey) {
		console.warn("CAL_API_KEY not configured - returning empty slots");
		return [];
	}

	try {
		const params = new URLSearchParams({
			eventTypeId: eventTypeId.toString(),
			startTime: startDate.toISOString(),
			endTime: endDate.toISOString(),
		});

		const response = await fetch(`${CAL_CONFIG.API_BASE}/slots?${params}`, {
			headers: {
				Authorization: `Bearer ${calApiKey}`,
				"cal-api-version": "2024-08-13",
			},
		});

		if (!response.ok) {
			throw new Error(`Cal.com API error: ${response.status}`);
		}

		const data = await response.json();
		return data.data?.slots || [];
	} catch (error) {
		console.error("Failed to fetch calendar slots:", error);
		return [];
	}
}

/**
 * Create a new booking
 * @param booking - Booking request data
 */
export async function createBooking(
	booking: BookingRequest,
): Promise<CalendarEvent | null> {
	const calApiKey = process.env.CAL_API_KEY;

	if (!calApiKey) {
		console.error("CAL_API_KEY not configured");
		return null;
	}

	try {
		const response = await fetch(`${CAL_CONFIG.API_BASE}/bookings`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${calApiKey}`,
				"cal-api-version": "2024-08-13",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(booking),
		});

		if (!response.ok) {
			const error = await response.json();
			console.error("Booking creation failed:", error);
			return null;
		}

		const data = await response.json();
		return {
			id: data.data.uid,
			title: data.data.title,
			start: new Date(data.data.start),
			end: new Date(data.data.end),
			attendees: data.data.attendees || [],
		};
	} catch (error) {
		console.error("Failed to create booking:", error);
		return null;
	}
}

/**
 * Cancel a booking
 * @param bookingUid - The booking UID to cancel
 * @param reason - Optional cancellation reason
 */
export async function cancelBooking(
	bookingUid: string,
	reason?: string,
): Promise<boolean> {
	const calApiKey = process.env.CAL_API_KEY;

	if (!calApiKey) {
		console.error("CAL_API_KEY not configured");
		return false;
	}

	try {
		const response = await fetch(
			`${CAL_CONFIG.API_BASE}/bookings/${bookingUid}/cancel`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${calApiKey}`,
					"cal-api-version": "2024-08-13",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					cancellationReason: reason || "Cancelled by user",
				}),
			},
		);

		return response.ok;
	} catch (error) {
		console.error("Failed to cancel booking:", error);
		return false;
	}
}

/**
 * Reschedule a booking
 * @param bookingUid - The booking UID to reschedule
 * @param newStart - New start time (ISO 8601 UTC)
 */
export async function rescheduleBooking(
	bookingUid: string,
	newStart: string,
): Promise<CalendarEvent | null> {
	const calApiKey = process.env.CAL_API_KEY;

	if (!calApiKey) {
		console.error("CAL_API_KEY not configured");
		return null;
	}

	try {
		const response = await fetch(
			`${CAL_CONFIG.API_BASE}/bookings/${bookingUid}/reschedule`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${calApiKey}`,
					"cal-api-version": "2024-08-13",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					start: newStart,
					reschedulingReason: "Rescheduled by user",
				}),
			},
		);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return {
			id: data.data.uid,
			title: data.data.title,
			start: new Date(data.data.start),
			end: new Date(data.data.end),
			attendees: data.data.attendees || [],
		};
	} catch (error) {
		console.error("Failed to reschedule booking:", error);
		return null;
	}
}

/**
 * Get booking details
 * @param bookingUid - The booking UID
 */
export async function getBooking(
	bookingUid: string,
): Promise<CalendarEvent | null> {
	const calApiKey = process.env.CAL_API_KEY;

	if (!calApiKey) {
		console.error("CAL_API_KEY not configured");
		return null;
	}

	try {
		const response = await fetch(
			`${CAL_CONFIG.API_BASE}/bookings/${bookingUid}`,
			{
				headers: {
					Authorization: `Bearer ${calApiKey}`,
					"cal-api-version": "2024-08-13",
				},
			},
		);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return {
			id: data.data.uid,
			title: data.data.title,
			start: new Date(data.data.start),
			end: new Date(data.data.end),
			attendees: data.data.attendees || [],
			metadata: data.data.metadata,
		};
	} catch (error) {
		console.error("Failed to get booking:", error);
		return null;
	}
}
