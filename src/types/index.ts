/**
 * @file index.ts
 * @description Core type definitions
 * @module types
 */

import { z } from "zod";

// ============================================
// User Types
// ============================================

export const UserRoleSchema = z.enum(["admin", "user", "client"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string().min(1),
	role: UserRoleSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

// ============================================
// Lead Types
// ============================================

export const LeadStatusSchema = z.enum([
	"pending",
	"contacted",
	"qualified",
	"proposal",
	"negotiation",
	"closed_won",
	"closed_lost",
]);
export type LeadStatus = z.infer<typeof LeadStatusSchema>;

export const LeadSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().optional(),
	company: z.string().optional(),
	source: z.string().optional(),
	status: LeadStatusSchema.default("pending"),
	notes: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type Lead = z.infer<typeof LeadSchema>;

export const CreateLeadSchema = LeadSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
export type CreateLead = z.infer<typeof CreateLeadSchema>;

// ============================================
// Client Types
// ============================================

export const ClientSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().optional(),
	company: z.string().optional(),
	stripeCustomerId: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type Client = z.infer<typeof ClientSchema>;

// ============================================
// API Response Types
// ============================================

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		data: dataSchema.optional(),
		error: z.string().optional(),
		message: z.string().optional(),
	});

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// ============================================
// Firestore Timestamp Helper
// ============================================

export const FirestoreTimestampSchema = z.object({
	seconds: z.number(),
	nanoseconds: z.number(),
});

export function toDate(
	timestamp: z.infer<typeof FirestoreTimestampSchema>,
): Date {
	return new Date(timestamp.seconds * 1000);
}
