import { type Client, createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import * as path from "path";

// Support for running scripts from the project root or scripts/ directory
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

/**
 * Turso Database Client for God Mode 2.0
 *
 * Edge-first SQLite database with 19ms query latency.
 * Supports per-venue database isolation and offline-first sync.
 */

// Main Turso client (shared database)
export const turso: Client | null = createTursoClient();

function createTursoClient(): Client | null {
	if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
		console.warn("Turso credentials not configured. Using Firebase fallback.");
		return null;
	}

	return createClient({
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	});
}

/**
 * Get venue-specific database client
 * Per-venue isolation for data separation and horizontal scaling
 */
export function getVenueDb(venueId: string): Client | null {
	if (!process.env.TURSO_AUTH_TOKEN) {
		console.warn("Turso auth token not configured");
		return null;
	}

	const venueUrl = `libsql://${venueId}-${process.env.TURSO_ORG_SLUG}.turso.io`;

	return createClient({
		url: venueUrl,
		authToken: process.env.TURSO_AUTH_TOKEN,
	});
}

/**
 * Initialize database schema for a new venue
 */
export async function initVenueDatabase(venueId: string): Promise<void> {
	const db = getVenueDb(venueId);
	if (!db) throw new Error("Turso not configured");

	await db.batch([
		`CREATE TABLE IF NOT EXISTS shoots (
      id TEXT PRIMARY KEY,
      venue_id TEXT NOT NULL,
      name TEXT NOT NULL,
      shoot_date INTEGER NOT NULL,
      photographer_uid TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    )`,

		`CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      shoot_id TEXT NOT NULL,
      url TEXT NOT NULL,
      thumbnail_url TEXT,
      qr_code TEXT UNIQUE NOT NULL,
      quality_score REAL,
      tags TEXT,
      face_count INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (shoot_id) REFERENCES shoots(id) ON DELETE CASCADE
    )`,

		`CREATE INDEX IF NOT EXISTS idx_photos_shoot ON photos(shoot_id)`,
		`CREATE INDEX IF NOT EXISTS idx_photos_qr ON photos(qr_code)`,
		`CREATE INDEX IF NOT EXISTS idx_shoots_date ON shoots(shoot_date)`,

		`CREATE TABLE IF NOT EXISTS photo_downloads (
      id TEXT PRIMARY KEY,
      photo_id TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      downloaded_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE
    )`,

		`CREATE INDEX IF NOT EXISTS idx_downloads_photo ON photo_downloads(photo_id)`,
	]);

	console.log(`✅ Initialized Turso database for venue: ${venueId}`);
}

/**
 * Health check for Turso connection
 */
export async function testTursoConnection(): Promise<boolean> {
	if (!turso) return false;

	try {
		const result = await turso.execute("SELECT 1 as health");
		return result.rows.length === 1;
	} catch (error) {
		console.error("Turso health check failed:", error);
		return false;
	}
}
