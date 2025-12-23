// Test Notion API Connection
// Run: node scripts/test-notion.js

const https = require("https");

const NOTION_TOKEN = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;

if (!NOTION_TOKEN) {
	console.error(
		"Error: NOTION_TOKEN or NOTION_API_KEY environment variable is required",
	);
	console.error(
		'Set it with: $env:NOTION_API_KEY="your-token" (PowerShell) or export NOTION_API_KEY="your-token" (Bash)',
	);
	process.exit(1);
}

console.log("========================================");
console.log("  Notion API Connection Test           ");
console.log("========================================\n");

console.log("Testing with token:", NOTION_TOKEN.substring(0, 15) + "...");

// Test 1: Get current user (bot info)
function testConnection() {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "api.notion.com",
			port: 443,
			path: "/v1/users/me",
			method: "GET",
			headers: {
				Authorization: `Bearer ${NOTION_TOKEN}`,
				"Notion-Version": "2022-06-28",
				"Content-Type": "application/json",
			},
		};

		const req = https.request(options, (res) => {
			let data = "";
			res.on("data", (chunk) => (data += chunk));
			res.on("end", () => {
				if (res.statusCode === 200) {
					resolve(JSON.parse(data));
				} else {
					reject({ statusCode: res.statusCode, body: data });
				}
			});
		});

		req.on("error", reject);
		req.end();
	});
}

// Test 2: Search for all accessible content
function searchNotion(query = "") {
	return new Promise((resolve, reject) => {
		const postData = JSON.stringify({
			query: query,
			page_size: 10,
		});

		const options = {
			hostname: "api.notion.com",
			port: 443,
			path: "/v1/search",
			method: "POST",
			headers: {
				Authorization: `Bearer ${NOTION_TOKEN}`,
				"Notion-Version": "2022-06-28",
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(postData),
			},
		};

		const req = https.request(options, (res) => {
			let data = "";
			res.on("data", (chunk) => (data += chunk));
			res.on("end", () => {
				if (res.statusCode === 200) {
					resolve(JSON.parse(data));
				} else {
					reject({ statusCode: res.statusCode, body: data });
				}
			});
		});

		req.on("error", reject);
		req.write(postData);
		req.end();
	});
}

async function runTests() {
	try {
		// Test 1: Get bot info
		console.log("\n1. Testing Bot Info (users/me)...");
		const user = await testConnection();
		console.log("   ✓ Connected successfully!");
		console.log(
			`   Bot Name: ${user.name || user.bot?.owner?.user?.name || "Integration"}`,
		);
		console.log(`   Bot ID: ${user.id}`);
		console.log(`   Type: ${user.type}`);

		// Test 2: Search for content
		console.log("\n2. Searching Notion workspace...");
		const searchResults = await searchNotion("");
		console.log("   ✓ Search successful!");
		console.log(`   Accessible items: ${searchResults.results.length}`);

		if (searchResults.results.length > 0) {
			console.log("\n   Accessible Content:");
			searchResults.results.forEach((item, i) => {
				const title =
					item.properties?.title?.title?.[0]?.plain_text ||
					item.properties?.Name?.title?.[0]?.plain_text ||
					item.title?.[0]?.plain_text ||
					"Untitled";
				console.log(`     ${i + 1}. [${item.object}] ${title} (${item.id})`);
			});
		} else {
			console.log("\n   ⚠️  No content accessible yet.");
			console.log(
				"   Make sure to share pages/databases with your integration!",
			);
		}

		console.log("\n========================================");
		console.log("  ✓ Notion Connection Verified!        ");
		console.log("========================================");
		console.log("\nYour Notion integration is working.");
		console.log("The MCP server can now control your workspace.\n");

		// Display capabilities
		console.log("MCP Server Capabilities:");
		console.log("  • Create, read, update pages");
		console.log("  • Create, query databases");
		console.log("  • Search workspace content");
		console.log("  • Manage blocks and content");
		console.log("  • Add comments to pages");
		console.log("");
	} catch (error) {
		console.error("\n✗ Connection failed!");
		if (error.statusCode === 401) {
			console.error("  Invalid API token. Check your NOTION_API_KEY.");
		} else if (error.statusCode === 403) {
			console.error(
				"  Access denied. Make sure your integration has proper permissions.",
			);
		} else {
			console.error("  Error:", error);
		}
		process.exit(1);
	}
}

runTests();
