import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
	project: "proj_sqvpoxyidozewkvfhwmo",
	runtime: "node",
	logLevel: "info",
	maxDuration: 60, // Added to satisfy TriggerConfig requirements
	retries: {
		enabledInDev: true,
		default: {
			maxAttempts: 3,
			minTimeoutInMs: 1000,
			maxTimeoutInMs: 10000,
			factor: 2,
			randomize: true,
		},
	},
});
