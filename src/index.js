require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Key Authentication Middleware
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY || 'secret-honey-pot-key-123';

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid or missing x-api-key header'
    });
  }
  next();
};

// Routes (with API key protection)
app.use('/api', apiKeyAuth, apiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Agentic Honey-Pot Backend is Running 🛡️');
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
