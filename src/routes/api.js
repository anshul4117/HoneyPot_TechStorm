const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Main Chat Endpoint
router.post('/chat', chatController.handleChat);

// Health Check
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Version Check
router.get('/version', (req, res) => {
    res.json({ version: '1.0.0' });
});

module.exports = router;
