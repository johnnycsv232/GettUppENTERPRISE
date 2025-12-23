import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
    const genAI = new GoogleGenerativeAI("test");
    // @ts-ignore
    console.log("fileSearchStores exists:", typeof genAI.fileSearchStores !== 'undefined');
    // @ts-ignore
    console.log("genAI properties:", Object.keys(genAI));
}

test();
