import { Surreal } from "surrealdb.js";

/**
 * SurrealDB Client (Experimental)
 * God Mode 2.0 - Graph & Multi-Model Database Experiment
 *
 * Used for complex relationship traversals in Phase 4.
 * NOT for primary production data yet.
 */

const db = new Surreal();

export async function initSurreal() {
	try {
		await db.connect("ws://127.0.0.1:8000/rpc", {
			namespace: "gettup",
			database: "graph",
		});
		console.log("✅ SurrealDB connected");
		return db;
	} catch (e) {
		console.warn(
			"⚠️ SurrealDB connection failed (Experimental feature skipped)",
			e,
		);
		return null;
	}
}

/**
 * Log a graph relationship: User -> VISITED -> Venue
 */
export async function logVisit(userId: string, venueId: string) {
	if (!db) return;
	try {
		await db.query(
			`RELATE user:${userId}->VISITED->venue:${venueId} SET timestamp = time::now()`,
		);
	} catch (e) {
		console.error("SurrealDB relation error:", e);
	}
}

export default db;
