/**
 * Benchmark Script: Turso vs Firebase
 * God Mode 2.0 - Performance Validation
 *
 * Measures query latency differences between Firebase (cloud) and Turso (edge/local).
 * Run with: bun run scripts/benchmark-turso-vs-firebase.ts
 */

import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

// Configuration
const TRIALS = 20;

async function benchmark() {
	console.log("🚀 Starting database benchmark: Firebase vs Turso\n");

	// 1. Setup Firebase
	// Note: Assuming firebase-admin is already configured or using default creds
	// If running locally without creds, this might fail unless authenticated
	try {
		initializeApp();
		console.log("✅ Firebase initialized");
	} catch {
		console.log("⚠️ Firebase init skipped/failed (using existing?)");
	}
	const firestore = getFirestore();

	// 2. Setup Turso
	if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
		console.error("❌ Turso credentials missing in .env");
		return;
	}
	const turso = createClient({
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	});
	console.log("✅ Turso initialized");

	console.log(`\nRunning ${TRIALS} trials per database...\n`);

	// --- Firebase Benchmark ---
	let firebaseTotal = 0;
	console.log("🔥 Benchmarking Firebase (read single document)...");

	// Warmup
	try {
		await firestore.collection("bench").doc("warmup").get();
	} catch {}

	for (let i = 0; i < TRIALS; i++) {
		const start = performance.now();
		try {
			await firestore.collection("shoots").limit(1).get();
			const duration = performance.now() - start;
			firebaseTotal += duration;
			process.stdout.write(".");
		} catch {
			console.error("F");
		}
	}
	const firebaseAvg = firebaseTotal / TRIALS;
	console.log(`\nAvg Latency: ${firebaseAvg.toFixed(2)}ms`);

	// --- Turso Benchmark ---
	let tursoTotal = 0;
	console.log("\n⚡ Benchmarking Turso (read single row)...");

	// Warmup
	try {
		await turso.execute("SELECT 1");
	} catch {}

	for (let i = 0; i < TRIALS; i++) {
		const start = performance.now();
		try {
			await turso.execute("SELECT * FROM shoots LIMIT 1");
			const duration = performance.now() - start;
			tursoTotal += duration;
			process.stdout.write(".");
		} catch {
			console.error("T");
		}
	}
	const tursoAvg = tursoTotal / TRIALS;
	console.log(`\nAvg Latency: ${tursoAvg.toFixed(2)}ms`);

	// --- Results ---
	console.log("\n-------------------------------------------");
	console.log("🏆 FINAL RESULTS");
	console.log("-------------------------------------------");
	console.log(`Firebase: ${firebaseAvg.toFixed(2)}ms`);
	console.log(`Turso:    ${tursoAvg.toFixed(2)}ms`);

	const diff = firebaseAvg - tursoAvg;
	const speedup = firebaseAvg / tursoAvg;

	if (diff > 0) {
		console.log(
			`\n✅ Turso is ${speedup.toFixed(1)}x faster (${diff.toFixed(2)}ms reduction)`,
		);
	} else {
		console.log(`\n⚠️ Turso is slower by ${Math.abs(diff).toFixed(2)}ms`);
	}
}

benchmark().catch(console.error);
