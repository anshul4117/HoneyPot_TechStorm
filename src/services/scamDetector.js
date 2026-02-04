const { generateText } = require('./geminiService');
const { SCAM_DETECTION_PROMPT } = require('./agentPersona');

/**
 * Detects if a message is a scam.
 * Uses a heuristic first (keyword check) -> then AI check if needed.
 * For Hackathon speed, we might just rely on AI or keywords.
 * @param {string} text 
 * @returns {Promise<boolean>}
 */
async function detectScam(text) {
  // 1. Simple Keyword Fail-fast
  const lower = text.toLowerCase();
  const suspicious = ['blocked', 'verify', 'kyc', 'suspension', 'pan', 'upi', 'lottery', 'winner'];
  const hasKeyword = suspicious.some(word => lower.includes(word));

  // If extremely obvious, flag it (optional optimization)

  // 2. AI Verification
  const prompt = `${SCAM_DETECTION_PROMPT}\n"${text}"`;
  const response = await generateText(prompt);
  console.log(`[ScamDetector] Gemini Response: "${response}"`);

  // Logic: True if AI says SCAM.
  // Fallback: If AI error but Keyword found -> Assume SCAM (for demo reliability)
  let isScam = response.trim().toUpperCase().includes('SCAM');

  // Fallback: If AI error but Keyword found -> Assume SCAM (for demo reliability)
  // Check if it's any of our fallback responses (they ask questions about the scam topic)
  const fallbackPatterns = [
    "I don't understand",
    "What documents do I need",
    "What do I need to do",
    "What information do you need",
    "Should I share them",
    "Can you please guide",
    "please help me",
    "Please help me understand",
    "I want to cooperate"
  ];
  const isFallback = fallbackPatterns.some(pattern => response.includes(pattern));

  if (!isScam && (response.includes('Error') || isFallback) && hasKeyword) {
    console.log('[ScamDetector] Keyword-based scam detected. Flagging as SCAM.');
    isScam = true;
  }

  console.log(`Scam Detection result for "${text.substring(0, 20)}...": ${isScam}`);

  return isScam;
}

module.exports = { detectScam };
