const { generateText } = require('./geminiService');

/**
 * Extracts intelligence from the conversation history or latest message.
 * Uses Regex for deterministic patterns and AI for contextual extraction.
 * @param {Array} history - Full conversation
 * @param {string} latestText 
 * @returns {Promise<Object>} - The extracted JSON
 */
async function extractIntelligence(history, latestText) {
    // Initialize result structure
    const intelligence = {
        bankAccounts: [],
        upiIds: [],
        phishingLinks: [],
        phoneNumbers: [],
        suspiciousKeywords: []
    };

    const fullText = history.map(h => h.text).join(' ') + ' ' + latestText;

    // 1. Regex Extraction (Fast & Accurate)

    // UPI Regex (Simple generic one)
    const upiRegex = /[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}/g;
    const foundUpis = fullText.match(upiRegex);
    if (foundUpis) intelligence.upiIds = [...new Set(foundUpis)];

    // Phone Regex (Indian context 10 digits)
    const phoneRegex = /[6-9]\d{9}/g;
    const foundPhones = fullText.match(phoneRegex);
    if (foundPhones) intelligence.phoneNumbers = [...new Set(foundPhones)];

    // Link Regex
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const foundLinks = fullText.match(linkRegex);
    if (foundLinks) intelligence.phishingLinks = [...new Set(foundLinks)];

    // 2. AI Extraction for keywords or complex entities (Bank Accounts hidden in text)
    // We perform this periodically or on the latest message if it looks like it has data.
    // For simplicity, we skip expensive AI call here unless needed, or just run it.

    // TODO: Add AI-based extraction if Regex fails or for Bank Account Numbers (often spaces)

    // Explicit Bank Account Search (Digits 9-18)
    const bankAccountRegex = /\b\d{9,18}\b/g;
    // Filter out phone numbers from bank accounts
    const potentialBanks = fullText.match(bankAccountRegex);
    if (potentialBanks) {
        intelligence.bankAccounts = potentialBanks.filter(n => !intelligence.phoneNumbers.includes(n));
    }

    return intelligence;
}

module.exports = { extractIntelligence };
