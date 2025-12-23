import * as dotenv from "dotenv";
import { expand } from "dotenv-expand";
import fs from "fs/promises";
import path from "path";
import { processDocument } from "../src/lib/rag/document-indexer";

// Load environment variables
const envLocal = dotenv.config({
	path: path.resolve(process.cwd(), ".env.local"),
});
expand(envLocal);

async function seedDocs() {
	console.log("🌱 Starting Document Seeding...");

	// Ensure API Key Check for script safety
	if (!process.env.GEMINI_API_KEY) {
		console.error("❌ GEMINI_API_KEY is missing in .env.local");
		process.exit(1);
	}

	const docsDir = path.join(process.cwd(), "docs");
	try {
		const files = await fs.readdir(docsDir);
		let count = 0;

		for (const file of files) {
			if (file.endsWith(".md")) {
				const filePath = path.join(docsDir, file);
				console.log(`Processing ${file}...`);
				const content = await fs.readFile(filePath, "utf-8");

				try {
					const result = await processDocument(file, content, "text/markdown");
					if (result) {
						console.log(`✅ Indexed: ${file}`);
						count++;
					} else {
						console.log(`⚠️ Skipped: ${file}`);
					}
				} catch (err) {
					console.error(`❌ Failed to index ${file}:`, err);
				}
			}
		}
		console.log(`\n🎉 Seeding Complete! Indexed ${count} documents.`);
	} catch (error) {
		console.error("Fatal Error:", error);
		process.exit(1);
	}
}

seedDocs();
