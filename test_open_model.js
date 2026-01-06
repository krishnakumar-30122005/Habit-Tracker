const apiKey = process.env.HUGGINGFACE_API_KEY || "PASTE_TOKEN_HERE";
require('dotenv').config();

async function verifyOpenModel() {
    console.log(`Testing Public Model (Flan-T5)...`);

    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    model: "Qwen/Qwen2.5-7B-Instruct",
                    messages: [
                        { role: "user", content: "Say 'Hello'!" }
                    ],
                    max_tokens: 100
                }),
            }
        );

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Status: ${response.status} \nBody: ${text}`);
        }

        const result = await response.json();
        console.log("✅ SUCCESS! This model works.");
        console.log("Response:", JSON.stringify(result));
    } catch (error) {
        console.error("❌ ERROR:");
        console.error(error.message);
    }
}

verifyOpenModel();
