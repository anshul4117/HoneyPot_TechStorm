# Project Documentation: Agentic Honeypot for Scam Detection & Intelligence Extraction

## 1. Introduction
The digital landscape has seen an alarming rise in sophisticated financial scams, ranging from UPI fraud and phishing to complex bank impersonation threats. Traditional security systems often rely on static rules or pattern matching, which scammers quickly bypass by constantly adapting their tactics and language. To counter this, we introduce the **Agentic Honeypot**, a proactive defense system designed to not just detect threats, but to autonomously engage with them to gather actionable intelligence.

## 2. Problem Statement
Detecting scam intent is only the first step. The real challenge lies in understanding the scammer's methodology and gathering the specific details needed to stop them—such as payment addresses, phishing URLs, or contact numbers. Current systems effectively block known threats but fail to extract intelligence from new or evolving campaigns. There is a critical need for a system that can safely occupy a scammer's time and extract these vital details without putting real users at risk.

## 3. Proposed Solution Overview
We propose an AI-powered **Agentic Honeypot** that acts as a secure, autonomous barrier between scammers and potential victims. When a suspicious message is detected, instead of simply blocking it, the system activates a believable AI persona. This persona engages the scammer in a natural, multi-turn conversation, simulating a naive or cautious user. The goal is to prolong the interaction to extract valuable forensic data while wasting the scammer's time, all within a safe and controlled environment.

## 4. System Architecture
The system is built as a robust middleware solution designed for high scalability and seamless integration.

*   **Mock Scammer API**: A simulation layer that generates or relays realistic scam messages to test the system's responsiveness.
*   **Scam Detection Module**: The first line of defense that analyzes incoming text to determine the likelihood of malicious intent.
*   **Decision Engine**: A logic layer that routes clean traffic normally while diverting suspicious traffic to the Honeypot Agent.
*   **Honeypot AI Agent**: The core of the system—a persona-based AI capable of maintaining context, simulating human hesitation, and asking relevant questions.
*   **Conversation Manager**: Tracks the state of the dialogue, ensuring the agent remembers previous details and responds coherently over time.
*   **Intelligence Extraction Module**: A specialized analyzer that monitors the conversation in real-time to identify and tag specific data points like banking details or malicious links.
*   **Structured Output Generator**: Converts the extracted intelligence into a standardized machine-readable format for reporting.

## 5. Architecture Diagram
```text
Incoming Message
      ↓
Scam Detection Module
      ↓
[Is it a Scam?]
  No  →  Pass to User/Ignore
  Yes →  Activate Decision Engine
               ↓
      Honeypot AI Agent (Persona Active)
      (Maintains Conversation History)
               ↓
      Engagement & Dialogue Loop
               ↓
      Intelligence Extraction Module
               ↓
      Final Callback (Structured Report)
```

## 6. Detailed Process Flow
1.  **Intake**: The system receives a message text along with session metadata.
2.  **Analysis**: The Detection Module evaluates the content. If safe, the process ends. If suspicious, the session is flagged.
3.  **Activation**: The Decision Engine wakes up the appropriate AI Agent persona (e.g., "Elderly User" or "Confused Customer").
4.  **Engagement**: The Agent generates a text response. It is instructed to be non-committal and inquisitive, encouraging the scammer to reveal more information.
5.  ** extraction**: As the conversation proceeds, the Intelligence Extraction Module scans every message. If a payment address or link is shared, it is logged.
6.  **Reporting**: Once the conversation concludes or sufficient intelligence is gathered, the system triggers a callback to the central server with all findings.

## 7. API Design
The system exposes a clean, RESTful interface designed for ease of integration.

*   **Authentication**: Secured via a standard API Key header (`x-api-key`).
*   **Request Structure**: The main endpoint accepts a JSON object containing:
    *   **Session ID**: Unique identifier for tracking the conversation thread.
    *   **Message Content**: The actual text received from the potential scammer.
    *   **History**: An array of previous message exchanges for context.
    *   **Metadata**: Timestamps and source identifiers.
*   **Response Format**: The API returns a JSON object containing the Agent's next reply and a status flag indicating if the conversation should continue.
*   **Callback Mechanism**: A mandatory endpoint is configured to receive the final intelligence report asynchronously, decoupled from the real-time chat flow.

## 8. Intelligence Extraction
The system is tuned to identify and isolate specific entities valuable for fraud prevention:

*   **Financial Identifiers**: UPI IDs, Bank Account Numbers, IFSC codes, and Crypto Wallet addresses.
*   **Communication Channels**: Phone numbers, WhatsApp business links, and Telegram handles.
*   **Digital Footprints**: Phishing URLs, domain names, and suspicious IP addresses.
*   **Keywords**: Specific phrases related to urgency, threats, or known fraud scripts (e.g., "KYC update", "Lottery winner").

## 9. Ethics, Safety & Compliance
We prioritize responsible AI deployment.

*   **No Impersonation of Authority**: The Agent never poses as law enforcement, government officials, or bank staff.
*   **Passive Defense**: The system is reactive. It only engages when solicited by a suspected scammer.
*   **Safety Rails**: Strict guidelines prevent the Agent from using profanity, threats, or engaging in illegal propositions.
*   **Data Privacy**: No real PII (Personally Identifiable Information) is ever used. The Agent uses synthetic, generated data for the persona.

## 10. Evaluation Criteria Alignment
*   **Scam Detection Accuracy**: High precision in filtering authentic messages from fraudulent ones.
*   **Engagement Quality**: The ability of the Agent to maintain a coherent, multi-turn conversation that feels human to the scammer.
*   **Intelligence Quality**: The accuracy and completeness of the extracted data (correctly identifying a UPI ID vs. a phone number).
*   **API Stability**: consistently handling concurrent sessions with low latency.

## 11. Use Cases & Impact
*   **Banks & Fintech**: To identify mule accounts and block fraudulent UPI handles proactively.
*   **Telecom Providers**: To detect and blacklist SMS sender IDs or phone numbers used for vishing.
*   **Social Platforms**: To automatically shadow-ban accounts attempting to scam users via DM.
*   **Law Enforcement**: To automate the initial data gathering phase, providing police with ready-to-use evidence dossiers.

## 12. Conclusion
The Agentic Honeypot represents a paradigm shift from static defense to active intelligence gathering. By wasting scammers' resources and harvesting their operational data, we not only protect individual users but also degrade the effectiveness of organized fraud networks. This scalable, ethical, and intelligent solution is ready to be a crucial layer in modern cybersecurity infrastructure.
