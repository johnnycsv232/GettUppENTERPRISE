// cascade.config.ts - Project Governance Rules
// GettUpp Enterprise CASCADE Framework

export const CASCADE_RULES = {
	// Code Quality Gates
	typescript: {
		strict: true,
		noImplicitAny: true,
		strictNullChecks: true,
		noUnusedLocals: true,
		noUnusedParameters: true,
	},

	testing: {
		minCoverage: 80,
		requireTestsForPR: true,
		testFramework: "vitest" as const,
	},

	linting: {
		treatWarningsAsErrors: true,
		eslintConfig: "eslint-config-next",
	},

	// Deployment Gates
	deploy: {
		requirePassingCI: true,
		requireApproval: true,
		autoRollbackOnError: true,
		previewDeployOnPR: true,
		productionBranch: "main",
	},

	// Security Gates
	security: {
		auditOnInstall: true,
		blockHighVulnerabilities: true,
		rotateSecretsEvery: "90d" as const,
		requireBranchProtection: true,
		requiredReviewers: 1,
	},

	// Webhook Handling
	webhooks: {
		requireIdempotency: true,
		useEventIdAsDocId: true,
		validateSignatures: true,
	},

	// Rate Limiting
	rateLimiting: {
		useRedis: true,
		fallbackToMemory: true, // Only for development
		maxRequestsPerMinute: 60,
		maxRequestsPerHour: 1000,
	},

	// Metrics & Monitoring
	metrics: {
		useAggregationCounters: true,
		avoidFullCollectionScans: true,
		statsDocument: "stats/dashboard",
	},
} as const;

// Pre-commit hook configuration
export const HUSKY_HOOKS = {
	preCommit: ["npm run lint", "npm run typecheck", "npm run test:affected"],
	commitMsg: ["npx commitlint --edit $1"],
} as const;

// CI/CD Pipeline stages
export const CI_PIPELINE = {
	triggers: ["push to main", "PR to main"],
	jobs: [
		{ name: "lint", command: "npm run lint" },
		{ name: "typecheck", command: "npx tsc --noEmit" },
		{ name: "test", command: "npm run test" },
		{ name: "build", command: "npm run build" },
		{ name: "deploy", command: "vercel --prod", condition: "main branch only" },
	],
} as const;

// MCP Server status types
export type MCPStatus = "ACTIVE" | "DEGRADED" | "OFFLINE" | "NEEDS_CONFIG";

// Service health check configuration
export const SERVICE_HEALTH = {
	firebase: { checkAuth: true, checkFirestore: true, checkStorage: true },
	stripe: { checkWebhooks: true, checkAPIKeys: true },
	vercel: { checkDeployment: true, checkEnvVars: true, checkDomain: true },
	github: { checkBranchProtection: true, checkSecrets: true },
} as const;

export type CascadeConfig = typeof CASCADE_RULES;
