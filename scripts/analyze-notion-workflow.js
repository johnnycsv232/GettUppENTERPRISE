// Analyze Notion Workflow for Multi-Agent Orchestration
const https = require("https");
const fs = require("fs");

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

const API_VERSION = "2022-06-28";

const DATABASES = {
	PROJECTS: "8c916197-97c9-49d8-8d8d-9b115688a6f3",
	INBOX: "2bf74da0-cd12-81b1-b1eb-fd684f95ee23",
};

function fetchDatabase(databaseId) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "api.notion.com",
			path: `/v1/databases/${databaseId}`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${NOTION_TOKEN}`,
				"Notion-Version": API_VERSION,
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

function queryDatabase(databaseId, filter = {}) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "api.notion.com",
			path: `/v1/databases/${databaseId}/query`,
			method: "POST",
			headers: {
				Authorization: `Bearer ${NOTION_TOKEN}`,
				"Notion-Version": API_VERSION,
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
		req.write(JSON.stringify({ page_size: 100, ...filter }));
		req.end();
	});
}

async function analyze() {
	console.log("========================================");
	console.log("  Notion Workflow Analysis            ");
	console.log("========================================\n");

	try {
		// 1. Analyze Projects Database Schema
		console.log("1. Analyzing Projects Database Schema...");
		const projectsSchema = await fetchDatabase(DATABASES.PROJECTS);
		console.log("   ✓ Schema loaded\n");

		const projectProps = projectsSchema.properties;
		console.log("   Available Properties:");
		Object.keys(projectProps).forEach((key) => {
			const prop = projectProps[key];
			console.log(`     - ${key}: ${prop.type}`);
			if (prop.type === "select" && prop.select?.options) {
				console.log(
					`       Options: ${prop.select.options.map((o) => o.name).join(", ")}`,
				);
			}
			if (prop.type === "status" && prop.status?.options) {
				console.log(
					`       Statuses: ${prop.status.options.map((o) => o.name).join(", ")}`,
				);
			}
		});
		console.log("");

		// 2. Analyze Inbox Database Schema
		console.log("2. Analyzing Inbox Database Schema...");
		const inboxSchema = await fetchDatabase(DATABASES.INBOX);
		console.log("   ✓ Schema loaded\n");

		const inboxProps = inboxSchema.properties;
		console.log("   Available Properties:");
		Object.keys(inboxProps).forEach((key) => {
			const prop = inboxProps[key];
			console.log(`     - ${key}: ${prop.type}`);
			if (prop.type === "select" && prop.select?.options) {
				console.log(
					`       Options: ${prop.select.options.map((o) => o.name).join(", ")}`,
				);
			}
			if (prop.type === "status" && prop.status?.options) {
				console.log(
					`       Statuses: ${prop.status.options.map((o) => o.name).join(", ")}`,
				);
			}
		});
		console.log("");

		// 3. Query recent inbox items to understand workflow
		console.log("3. Analyzing Recent Inbox Items...");
		const inboxItems = await queryDatabase(DATABASES.INBOX);
		console.log(`   ✓ Found ${inboxItems.results.length} items\n`);

		// Group by status
		const statusGroups = {};
		inboxItems.results.forEach((item) => {
			const status = item.properties["Status"]?.status?.name || "Unknown";
			if (!statusGroups[status]) statusGroups[status] = [];
			statusGroups[status].push(item);
		});

		console.log("   Items by Status:");
		Object.keys(statusGroups).forEach((status) => {
			console.log(`     - ${status}: ${statusGroups[status].length} items`);
		});
		console.log("");

		// 4. Query projects by status
		console.log("4. Analyzing Projects by Status...");
		const projects = await queryDatabase(DATABASES.PROJECTS);
		console.log(`   ✓ Found ${projects.results.length} projects\n`);

		const projectStatusGroups = {};
		projects.results.forEach((item) => {
			const status = item.properties["Status"]?.status?.name || "Unknown";
			if (!projectStatusGroups[status]) projectStatusGroups[status] = [];
			projectStatusGroups[status].push(item);
		});

		console.log("   Projects by Status:");
		Object.keys(projectStatusGroups).forEach((status) => {
			console.log(
				`     - ${status}: ${projectStatusGroups[status].length} projects`,
			);
			projectStatusGroups[status].forEach((p) => {
				const name =
					p.properties["Project Name"]?.title?.[0]?.text?.content ||
					p.properties["Name"]?.title?.[0]?.text?.content ||
					"Untitled";
				console.log(`       • ${name}`);
			});
		});
		console.log("");

		// Save workflow analysis
		const analysis = {
			projectsSchema: {
				properties: Object.keys(projectProps),
				statuses:
					projectProps["Status"]?.status?.options?.map((o) => o.name) || [],
				categories:
					projectProps["Category"]?.select?.options?.map((o) => o.name) || [],
			},
			inboxSchema: {
				properties: Object.keys(inboxProps),
				statuses:
					inboxProps["Status"]?.status?.options?.map((o) => o.name) || [],
				sources:
					inboxProps["Source"]?.select?.options?.map((o) => o.name) || [],
			},
			inboxByStatus: Object.keys(statusGroups).reduce((acc, status) => {
				acc[status] = statusGroups[status].length;
				return acc;
			}, {}),
			projectsByStatus: Object.keys(projectStatusGroups).reduce(
				(acc, status) => {
					acc[status] = projectStatusGroups[status].map((p) => ({
						name:
							p.properties["Project Name"]?.title?.[0]?.text?.content ||
							p.properties["Name"]?.title?.[0]?.text?.content ||
							"Untitled",
						id: p.id,
					}));
					return acc;
				},
				{},
			),
		};

		fs.writeFileSync(
			"./notion-workflow-analysis.json",
			JSON.stringify(analysis, null, 2),
		);

		console.log("========================================");
		console.log("  ✓ Analysis Complete!                ");
		console.log("========================================");
		console.log(
			"\nWorkflow analysis saved to: notion-workflow-analysis.json\n",
		);
	} catch (error) {
		console.error("\n✗ Error:", error);
		if (error.statusCode) {
			console.error(`  Status: ${error.statusCode}`);
			console.error(`  Body: ${error.body}`);
		}
		process.exit(1);
	}
}

analyze();
