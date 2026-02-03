const axios = require('axios');

const API_URL = 'http://localhost:3000/api/chat';
const SESSION_ID = 'test-session-' + Date.now();

async function runTest() {
    console.log('--- Starting Honey-Pot Simulation ---');
    console.log('Target:', API_URL);

    const payload1 = {
        sessionId: SESSION_ID,
        message: {
            sender: "scammer",
            text: "Your bank account 8829 will be blocked today. Verify immediately at http://fake-bank-verify.com or send UPI to scam@upi.",
            timestamp: Date.now()
        },
        conversationHistory: [],
        metadata: { channel: "SMS", language: "English", locale: "IN" }
    };

    console.log('\n[1] Sending First Message...');
    try {
        const res1 = await axios.post(API_URL, payload1, { timeout: 10000 });
        console.log('Response Status:', res1.status);
        console.log('Response Data:', JSON.stringify(res1.data, null, 2));
    } catch (err) {
        logError(err);
    }
}

function logError(err) {
    if (err.response) {
        console.error('❌ Server Responded with Error:');
        console.error('Status:', err.response.status);
        console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else if (err.request) {
        console.error('❌ No Response Received (Server might be down or unreachable):');
        console.error('Code:', err.code);
        console.error('Message:', err.message);
    } else {
        console.error('❌ Request Setup Error:', err.message);
    }
}

runTest();
