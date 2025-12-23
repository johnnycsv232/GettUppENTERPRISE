// Explore Notion Vision & Brand Strategy
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

const API_VERSION = "2022-06-28";

// Key pages to explore
const KEY_PAGES = {
	BUSINESS_HUB: "82109bb7-563b-4f96-bfa2-d1bcb76e23b5",
	BRAND_GUIDELINES: "9a6392c5-1c24-4039-8263-260568e2a657",
	BUILD_SPEC: "43e9c92d-ef2f-43d8-886c-27a1898add6b",
	ROADMAP: "ef2983b1-1e28-4b32-953d-41187ff33846",
	ARCHITECTURE: "eb61b15c-1ebe-4c1c-a975-7ca79d51d034",
	COMPANY_BRIEF: "2c074da0-cd12-8051-b15e-d386020bafc7",
};

// Key databases
const DATABASES = {
	PROJECTS: "8c916197-97c9-49d8-8d8d-9b115688a6f3",
	INBOX: "2bf74da0-cd12-81b1-b1eb-fd684f95ee23",
};

function fetchPage(pageId) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "api.notion.com",
			path: `/v1/pages/${pageId}`,
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

function fetchPageContent(pageId) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "api.notion.com",
			path: `/v1/blocks/${pageId}/children`,
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

function fetchDatabase(databaseId) {
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
		req.write(JSON.stringify({ page_size: 100 }));
		req.end();
	});
}

function extractText(block) {
	if (block.type === "paragraph") {
		return block.paragraph?.rich_text?.map((t) => t.plain_text).join("") || "";
	}
	if (
		block.type === "heading_1" ||
		block.type === "heading_2" ||
		block.type === "heading_3"
	) {
		const heading = block[block.type];
		return heading?.rich_text?.map((t) => t.plain_text).join("") || "";
	}
	if (
		block.type === "bulleted_list_item" ||
		block.type === "numbered_list_item"
	) {
		const item = block[block.type];
		return item?.rich_text?.map((t) => t.plain_text).join("") || "";
	}
	return "";
}

async function explore() {
	console.log("========================================");
	console.log("  Notion Vision & Strategy Explorer   ");
	console.log("========================================\n");

	try {
		// 1. Fetch Business Hub page
		console.log("1. Fetching Business Hub structure...");
		const hubPage = await fetchPage(KEY_PAGES.BUSINESS_HUB);
		const hubTitle =
			hubPage.properties?.title?.title?.[0]?.plain_text || "Business Hub";
		console.log(`   ✓ ${hubTitle}\n`);

		// 2. Fetch Brand Guidelines
		console.log("2. Fetching Brand Guidelines...");
		const _brandPage = await fetchPage(KEY_PAGES.BRAND_GUIDELINES);
		const brandContent = await fetchPageContent(KEY_PAGES.BRAND_GUIDELINES);
		console.log(
			`   ✓ Brand Guidelines loaded (${brandContent.results.length} blocks)\n`,
		);

		// Extract brand vision text
		const brandText = brandContent.results
			.map(extractText)
			.filter((t) => t.length > 0)
			.join("\n");
		console.log("   Brand Vision Excerpt:");
		console.log("   " + brandText.substring(0, 500) + "...\n");

		// 3. Fetch Projects Database
		console.log("3. Fetching Projects Database...");
		const projectsDb = await fetchDatabase(DATABASES.PROJECTS);
		console.log(`   ✓ Found ${projectsDb.results.length} projects\n`);

		if (projectsDb.results.length > 0) {
			console.log("   Projects:");
			projectsDb.results.forEach((page, i) => {
				const props = page.properties;
				const name =
					props["Project Name"]?.title?.[0]?.text?.content ||
					props["Name"]?.title?.[0]?.text?.content ||
					"Untitled";
				const status = props["Status"]?.status?.name || "Unknown";
				const category =
					props["Category"]?.select?.name || props["Tier"]?.select?.name || "";
				console.log(
					`     ${i + 1}. ${name} [${status}] ${category ? `(${category})` : ""}`,
				);
			});
			console.log("");
		}

		// 4. Fetch Inbox Database
		console.log("4. Fetching Inbox Database...");
		const inboxDb = await fetchDatabase(DATABASES.INBOX);
		console.log(`   ✓ Found ${inboxDb.results.length} inbox items\n`);

		// 5. Fetch Roadmap
		console.log("5. Fetching Technical Roadmap...");
		const _roadmapPage = await fetchPage(KEY_PAGES.ROADMAP);
		const roadmapContent = await fetchPageContent(KEY_PAGES.ROADMAP);
		console.log(
			`   ✓ Roadmap loaded (${roadmapContent.results.length} blocks)\n`,
		);

		// 6. Fetch Architecture
		console.log("6. Fetching System Architecture...");
		const _archPage = await fetchPage(KEY_PAGES.ARCHITECTURE);
		const archContent = await fetchPageContent(KEY_PAGES.ARCHITECTURE);
		console.log(
			`   ✓ Architecture loaded (${archContent.results.length} blocks)\n`,
		);

		// Save findings
		const findings = {
			brandVision: brandText.substring(0, 2000),
			projects: projectsDb.results.map((p) => ({
				name:
					p.properties["Project Name"]?.title?.[0]?.text?.content ||
					p.properties["Name"]?.title?.[0]?.text?.content ||
					"Untitled",
				status: p.properties["Status"]?.status?.name,
				category:
					p.properties["Category"]?.select?.name ||
					p.properties["Tier"]?.select?.name,
				id: p.id,
			})),
			inboxCount: inboxDb.results.length,
			roadmapBlocks: roadmapContent.results.length,
			archBlocks: archContent.results.length,
		};

		require("fs").writeFileSync(
			"./notion-vision-findings.json",
			JSON.stringify(findings, null, 2),
		);

		console.log("========================================");
		console.log("  ✓ Exploration Complete!             ");
		console.log("========================================");
		console.log("\nFindings saved to: notion-vision-findings.json\n");
	} catch (error) {
		console.error("\n✗ Error:", error);
		if (error.statusCode) {
			console.error(`  Status: ${error.statusCode}`);
			console.error(`  Body: ${error.body}`);
		}
		process.exit(1);
	}
}

explore();
