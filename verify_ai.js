import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function verifyAI() {
    console.log("1. Checking Environment Variable...");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file");
        return;
    }
    // Mask key for log safety
    const masked = apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4);
    console.log(`✅ Key found: ${masked}`);

    console.log("2. Testing Gemini API Connectivity...");
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent("Reply with exactly: 'System Operational'");
        const response = await result.response;
        const text = response.text();

        console.log("✅ API Response Received:", text.trim());
        console.log("🎉 SUCCESS: AI Service is fully configured and working!");
    } catch (error) {
        console.error("❌ API Call Failed:");
        console.error(error.message);
    }
}

verifyAI();
