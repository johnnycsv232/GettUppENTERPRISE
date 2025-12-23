import dotenv from "dotenv";
import path from "path";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testGeminiDirectly() {
    console.log("--- Direct Gemini SDK Test ---");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found");
        return;
    }

    const genAI = new GoogleGenAI({ apiKey });

    try {
        console.log("1. Listing File Search Stores...");
        const stores = await genAI.fileSearchStores.list();
        console.log("   Stores:", JSON.stringify(stores, null, 2));

        console.log("2. Testing Model Generation...");
        const result = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: "Hello" }] }]
        });
        console.log("   Response:", JSON.stringify(result, null, 2));
    } catch (err: any) {
        console.error("!!! SDK Error:", err.message || err);
        if (err.stack) console.error(err.stack);
    }
}

testGeminiDirectly().catch(console.error);
