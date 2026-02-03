const axios = require('axios');

const CALLBACK_URL = 'https://hackathon.guvi.in/api/updateHoneyPotFinalResult';

/**
 * Sends the final intelligence report to the Guvi endpoint.
 * @param {Object} payload 
 */
async function sendFinalReport(payload) {
    try {
        console.log('Sending Final Report to Guvi:', JSON.stringify(payload, null, 2));
        const response = await axios.post(CALLBACK_URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });
        console.log('Callback Response:', response.data);
    } catch (error) {
        console.error('Error sending callback:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
    }
}

module.exports = { sendFinalReport };
