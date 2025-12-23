import type { R2Bucket } from "@cloudflare/workers-types";
import { createClient } from "@libsql/client/web";
import { Hono } from "hono";
import { cors } from "hono/cors";

type Env = {
	TURSO_DATABASE_URL: string;
	TURSO_AUTH_TOKEN: string;
	ASSETS_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for photo delivery
app.use("/*", cors());

/**
 * QR Code Photo Delivery Endpoint
 * GET /photo/:qrCode
 *
 * Performance target: <50ms total
 * - Turso edge query: ~19ms
 * - R2/UploadThing redirect: instant
 */
app.get("/photo/:qrCode", async (c) => {
	const { qrCode } = c.req.param();

	// Initialize Turso client
	const turso = createClient({
		url: c.env.TURSO_DATABASE_URL,
		authToken: c.env.TURSO_AUTH_TOKEN,
	});

	try {
		// Query Turso at edge (19ms target)
		const result = await turso.execute({
			sql: "SELECT url, thumbnail_url, shoot_id, id FROM photos WHERE qr_code = ? AND is_visible = 1",
			args: [qrCode],
		});

		const photo = result.rows[0];

		if (!photo) {
			return c.json({ error: "Photo not found" }, 404);
		}

		// Log download analytics (async, non-blocking)
		c.executionCtx.waitUntil(
			turso.execute({
				sql: "INSERT INTO photo_downloads (id, photo_id, ip_address, user_agent) VALUES (?, ?, ?, ?)",
				args: [
					crypto.randomUUID(),
					photo.id,
					c.req.header("CF-Connecting-IP") || "unknown",
					c.req.header("User-Agent") || "unknown",
				],
			}),
		);

		// Redirect to UploadThing CDN URL
		// Cache at edge for 1 hour, browser for 5 minutes
		c.header("Cache-Control", "public, max-age=300, s-maxage=3600");
		return c.redirect(photo.url as string, 302);
	} catch (error) {
		console.error("QR delivery error:", error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

/**
 * Health check endpoint
 */
app.get("/health", async (c) => {
	const turso = createClient({
		url: c.env.TURSO_DATABASE_URL,
		authToken: c.env.TURSO_AUTH_TOKEN,
	});

	try {
		const result = await turso.execute("SELECT 1 as health");
		return c.json({ status: "healthy", turso: result.rows.length > 0 });
	} catch (error) {
		return c.json({ status: "unhealthy", error: String(error) }, 503);
	}
});

/**
 * Analytics endpoint - get photo stats
 */
app.get("/analytics/:shootId", async (c) => {
	const { shootId } = c.req.param();
	const turso = createClient({
		url: c.env.TURSO_DATABASE_URL,
		authToken: c.env.TURSO_AUTH_TOKEN,
	});

	try {
		const result = await turso.execute({
			sql: `
        SELECT 
          COUNT(DISTINCT p.id) as total_photos,
          COUNT(DISTINCT pd.id) as total_downloads,
          AVG(p.quality_score) as avg_quality,
          SUM(p.face_count) as total_faces
        FROM photos p
        LEFT JOIN photo_downloads pd ON p.id = pd.photo_id
        WHERE p.shoot_id = ?
      `,
			args: [shootId],
		});

		return c.json(result.rows[0]);
	} catch (error) {
		console.error("Analytics error:", error);
		return c.json({ error: "Failed to fetch analytics" }, 500);
	}
});

export default app;
