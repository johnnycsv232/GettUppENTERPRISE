import dotenv from "dotenv";
import path from "path";

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Then import modules
import { processDocument } from "../src/lib/rag/document-indexer";
import { queryEngine } from "../src/lib/rag/query-engine";

async function verifyRAG() {
    console.log("--- Testing Managed RAG Upgrade ---");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("× GEMINI_API_KEY not found in .env.local");
        return;
    }
    console.log(`Using API Key: ${apiKey.substring(0, 5)}...`);

    const testFile = "enterprise-policy-v5.txt";
    const testContent = "The GettUpp Enterprise policy v5 states that all employees are entitled to 45 days of annual leave and a monthly wellness stipend of $500.";

    console.log(`1. Indexing test document: ${testFile}...`);
    try {
        const indexResult = await processDocument(testFile, testContent);
        console.log("   ✓ processDocument returned:", indexResult ? "Success" : "Null");
    } catch (err: any) {
        console.log("   ! Indexing step error (likely Firestore):", err.message || err);
    }

    console.log("2. Querying for information...");
    try {
        const query = "How many days of annual leave do employees get in policy v5?";
        console.log(`   Executing query: "${query}"`);
        const result = await queryEngine.process(query);

        console.log("   Full Result Object:", JSON.stringify(result, null, 2));

        if (result.answer.includes("45") || result.answer.includes("annual leave")) {
            console.log("   ✓ Query successful and grounded via Gemini File Search.");
        } else if (result.error) {
            console.error("   × Query returned an error result.");
        } else {
            console.warn("   ? Query returned unexpected answer. Check model output.");
        }
    } catch (err: any) {
        console.error("   × Unexpected error during query:", err);
    }

    console.log("--- Verification Complete ---");
}

verifyRAG().catch(console.error);
