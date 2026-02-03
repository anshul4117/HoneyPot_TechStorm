const { detectScam } = require('../services/scamDetector');
const { generateText } = require('../services/geminiService');
const { extractIntelligence } = require('../services/intelligenceExtractor');
const { sendFinalReport } = require('../utils/callbackHandler');
const { HONEYPOT_PERSONA } = require('../services/agentPersona');

// In-Memory Session Store
// Map<sessionId, { scamDetected: boolean, extractedIntelligence: Object, messageCount: number }>
const sessions = new Map();

exports.handleChat = async (req, res) => {
  const { sessionId, message, conversationHistory = [], metadata } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ status: 'error', message: 'Invalid Request Format' });
  }

  try {
    // 1. Initialize or Retrieve Session State
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        scamDetected: false,
        extractedIntelligence: {
          bankAccounts: [], upiIds: [], phishingLinks: [], phoneNumbers: [], suspiciousKeywords: []
        },
        messageCount: 0
      };
      sessions.set(sessionId, session);
    }

    // Update message count (history + current)
    // Note: conversationHistory might be empty on first turn
    const currentTurnCount = conversationHistory.length + 1;
    session.messageCount = currentTurnCount;

    // 2. Scam Detection (If not already detected)
    // We check the FIRST message or Early messages
    if (!session.scamDetected) {
      const isScam = await detectScam(message.text);
      if (isScam) {
        session.scamDetected = true;
        console.log(`[Session ${sessionId}] Scam DETECTED.`);
      } else {
        console.log(`[Session ${sessionId}] Message appears SAFE.`);
        // If not a scam, we can either ignore or just reply typically.
        // For Honey-Pot, if safe, we might just not engage or say "Who is this?".
        // But if the user KEEPS talking, maybe it becomes scammy later.
        // For now, if NOT scam, we optionally don't activate the persona fully or just plain echo.
        // Let's assume we proceed cautiously.
      }
    }

    // 3. Agent Engagement (Only if Scam Detected OR we suspect it)
    // If we want to be aggressive, we treat EVERYTHING as potential scam for the hackathon? 
    // Spec says "If scam intent is detected, the AI Agent is activated".

    let replyText = null;

    if (session.scamDetected) {
      // Construct AI Prompt
      // combine system prompt + history + current message
      const prompt = `${HONEYPOT_PERSONA}\nThe user said: "${message.text}"`;

      // Pass history to Gemini
      replyText = await generateText(prompt, conversationHistory);

      // 4. Intelligence Extraction
      const newIntel = await extractIntelligence(conversationHistory, message.text);

      // Merge new intel into session state
      mergeIntelligence(session.extractedIntelligence, newIntel);

      // 5. Callback Reporting
      // We report if we have found something OR if the conversation is getting long
      // Reporting every turn after detection ensures we capture the latest state.
      // To avoid spam, maybe report only if intel changes or typical turns.

      // Construct Payload
      const callbackPayload = {
        sessionId: sessionId,
        scamDetected: session.scamDetected,
        totalMessagesExchanged: currentTurnCount,
        extractedIntelligence: session.extractedIntelligence,
        agentNotes: "Scam detected. Agent engaging to extract info."
      };

      // Fire and Forget Callback
      sendFinalReport(callbackPayload).catch(err => console.error("Callback failed", err.message));
    }

    // 6. Return Response
    if (replyText) {
      res.json({
        status: 'success',
        reply: replyText
      });
    } else {
      // FORCE A REPLY even if safe (Hackathon Requirement: "Detects scam OR activates agent")
      // If we are here, it means it was deemed SAFE or AI failed before engaging.
      // Let's pretend we are engaging anyway for the demo.
      res.json({
        status: 'success',
        reply: "I received your message. Is there anything else? (Automated Response)"
      });
    }

  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

/**
 * Helper to merge new intelligence into existing state (avoiding duplicates)
 */
function mergeIntelligence(existing, required) {
  const fields = ['bankAccounts', 'upiIds', 'phishingLinks', 'phoneNumbers', 'suspiciousKeywords'];

  fields.forEach(field => {
    if (required[field] && required[field].length > 0) {
      // Combine and Set (Unique)
      const combined = [...existing[field], ...required[field]];
      existing[field] = [...new Set(combined)];
    }
  });
}
