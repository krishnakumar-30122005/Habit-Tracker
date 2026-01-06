const apiKey = process.env.HUGGINGFACE_API_KEY;

async function listModels() {
    console.log(`Listing Available Models...`);

    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/models",
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
                method: "GET"
            }
        );

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Status: ${response.status} \nBody: ${text}`);
        }

        const result = await response.json();
        console.log("✅ SUCCESS!");

        const models = result.data || result; // Handle structure
        const chatModels = models
            .filter(m => {
                const id = m.id.toLowerCase();
                return id.includes('mistral') || id.includes('llama') || id.includes('qwen') || id.includes('zephyr');
            })
            .map(m => m.id);

        console.log("Available Chat Models:", JSON.stringify(chatModels, null, 2));
    } catch (error) {
        console.error("❌ ERROR:");
        console.error(error.message);
    }
}

listModels();
