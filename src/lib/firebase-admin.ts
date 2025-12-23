/**
 * @file firebase-admin.ts
 * @description Firebase Admin SDK initialization (Vercel-safe singleton pattern)
 * @module lib/firebase-admin
 */

import * as admin from "firebase-admin";

let initialized = false;

/**
 * Get Firebase Admin instance (singleton pattern)
 * Handles Vercel's environment variable formatting where \n is stored as literal "\\n"
 * @returns {typeof admin} Firebase Admin instance
 * @throws {Error} If required environment variables are missing
 */
export function getFirebaseAdmin(): typeof admin {
	if (initialized) {
		return admin;
	}

	// Check if already initialized by another import
	if (admin.apps.length > 0) {
		initialized = true;
		return admin;
	}

	// Validate required environment variables with helpful errors
	const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
	const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

	if (!projectId) {
		throw new Error(
			"❌ FIREBASE_ADMIN_PROJECT_ID not set.\n" +
				"   Add to .env.local or Vercel Environment Variables.\n" +
				'   Value: Your Firebase project ID (e.g., "my-app-production")',
		);
	}

	if (!clientEmail) {
		throw new Error(
			"❌ FIREBASE_ADMIN_CLIENT_EMAIL not set.\n" +
				"   Add to .env.local or Vercel Environment Variables.\n" +
				'   Value: Service account email (e.g., "firebase-adminsdk-xxx@project.iam.gserviceaccount.com")',
		);
	}

	if (!privateKeyRaw) {
		throw new Error(
			"❌ FIREBASE_ADMIN_PRIVATE_KEY not set.\n" +
				"   Add to .env.local or Vercel Environment Variables.\n" +
				"   Value: Full private key from service account JSON (including BEGIN/END markers)",
		);
	}

	// Vercel stores \n as literal "\\n" - convert back to actual newlines
	const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId,
				clientEmail,
				privateKey,
			}),
		});
		initialized = true;
		console.log("✅ Firebase Admin SDK initialized successfully");
	} catch (error) {
		console.error("❌ Firebase Admin initialization failed:", error);
		throw error;
	}

	return admin;
}

/**
 * Firestore instance (spec-compliant alias)
 * @returns {admin.firestore.Firestore} Firestore instance
 */
export const db = (): admin.firestore.Firestore =>
	getFirebaseAdmin().firestore();

/**
 * Auth instance (spec-compliant alias)
 * @returns {admin.auth.Auth} Auth instance
 */
export const auth = (): admin.auth.Auth => getFirebaseAdmin().auth();

/**
 * Get Firestore Admin instance (legacy alias)
 * @returns {admin.firestore.Firestore} Firestore instance
 */
export function adminDb(): admin.firestore.Firestore {
	return getFirebaseAdmin().firestore();
}

/**
 * Get Auth Admin instance (legacy alias)
 * @returns {admin.auth.Auth} Auth instance
 */
export function adminAuth(): admin.auth.Auth {
	return getFirebaseAdmin().auth();
}

/**
 * Get Storage Admin instance
 * @returns {admin.storage.Storage} Storage instance
 */
export function adminStorage(): admin.storage.Storage {
	return getFirebaseAdmin().storage();
}
