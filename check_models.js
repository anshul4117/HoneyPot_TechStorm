const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // For older versions of the SDK or different key types, we might not have listModels exposed directly in the simplified client.
        // However, the error message literally told us: "Call ListModels to see the list..."
        // Let's try to access the model list if possible, or just test a known list.

        // Actually, the SDK doesn't always expose listModels easily on the client instance in some versions.
        // Let's blindly try the 3 most common ones in a loop.

        const candidates = ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'];

        console.log('--- Testing Models ---');
        for (const modelName of candidates) {
            process.stdout.write(`Testing ${modelName}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log('✅ SUCCESS');
                process.exit(0); // Exit on first success
            } catch (err) {
                console.log('❌ FAILED (' + err.message.split('[')[0].trim() + ')');
            }
        }
    } catch (error) {
        console.error('Fatal Error:', error);
    }
}

listModels();
