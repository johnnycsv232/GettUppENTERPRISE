import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Security headers applied globally
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},

	// Image optimization domains
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
			},
			{
				protocol: "https",
				hostname: "storage.googleapis.com",
			},
		],
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},

	// Strict mode for better error catching
	reactStrictMode: true,

	// Output configuration
	output: "standalone",

	// Powered by header removal for security
	poweredByHeader: false,
};

export default nextConfig;
