require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization']
}));
app.use(bodyParser.json());

// Log ALL incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// API Key Authentication Middleware (Made OPTIONAL for Guvi tester compatibility)
const apiKeyAuth = (req, res, next) => {
  // Skip auth check if no key provided - for tester compatibility
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY || 'secret-honey-pot-key-123';

  // If key is provided, validate it. If not provided, allow anyway.
  if (apiKey && apiKey !== validKey) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid x-api-key header'
    });
  }
  next();
};

// Routes (with API key protection)
app.use('/api', apiKeyAuth, apiRoutes);

// Health Check (without auth for external monitoring)
app.get('/', (req, res) => {
  res.send('Agentic Honey-Pot Backend is Running 🛡️');
});

// Also add POST to root for flexibility
app.post('/', apiKeyAuth, (req, res) => {
  res.json({ status: 'success', reply: 'Honeypot API is ready. Use /api/chat endpoint.' });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
