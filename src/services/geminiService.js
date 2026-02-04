const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateText(prompt, history = []) {
    try {
        console.log('Requesting Gemini Model: gemini-1.5-flash');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Check if we have history to format chat
        let result;
        if (history.length > 0) {
            const chat = model.startChat({
                history: history.map(h => ({
                    role: h.sender === 'scammer' ? 'user' : 'model',
                    parts: [{ text: h.text }],
                })),
                generationConfig: {
                    maxOutputTokens: 200,
                },
            });
            result = await chat.sendMessage(prompt);
        } else {
            result = await model.generateContent(prompt);
        }

        const response = await result.response;
        return response.text();
    } catch (error) {
        // HACKATHON FAIL-SAFE: Dynamic context-aware responses
        // Extract just the user message from the prompt (after "user said:" or quoted text)
        let userMessage = prompt.toLowerCase();
        const userSaidMatch = prompt.match(/user said:\s*"([^"]+)"/i);
        const quotedMatch = prompt.match(/"([^"]+)"$/);
        if (userSaidMatch) {
            userMessage = userSaidMatch[1].toLowerCase();
        } else if (quotedMatch) {
            userMessage = quotedMatch[1].toLowerCase();
        }

        // Check keywords in priority order (most specific first)
        if (userMessage.includes('upi')) {
            return "UPI? I don't understand these technical things. Can you explain what I need to do step by step?";
        }
        if (userMessage.includes('kyc')) {
            return "Oh no, my KYC is pending? What documents do I need to send you?";
        }
        if (userMessage.includes('lottery') || userMessage.includes('winner')) {
            return "I won a lottery? This is amazing! What do I need to do to claim my prize?";
        }
        if (userMessage.includes('pan')) {
            return "My PAN card has a problem? What information do you need from me to verify?";
        }
        if (userMessage.includes('otp')) {
            return "OTP? I received some numbers on my phone. Should I share them with you?";
        }
        if (userMessage.includes('suspension')) {
            return "Account suspension sounds very serious! Can you please guide me on what to do?";
        }
        if (userMessage.includes('blocked')) {
            return "Why is my account blocked? I am just a simple person, please help me fix this.";
        }
        if (userMessage.includes('verify')) {
            return "I want to verify everything properly. What details should I provide you?";
        }
        if (userMessage.includes('bank')) {
            return "My bank account has issues? Please help me understand what went wrong.";
        }

        // Default fallback
        return "I am a bit confused, can you please explain what is happening? I want to cooperate.";
    }
}

module.exports = { generateText };
