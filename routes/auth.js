// routes/auth.js
const express = require('express');
const router = express.Router();

// Mock handlers
router.post('/login', (req, res) => {
  res.json({ message: 'Logged in', token: 'mock-jwt-token' });
});

router.post('/register', (req, res) => {
  res.status(201).json({ message: 'User registered' });
});

router.post('/forgot-password', (req, res) => {
  res.json({ message: 'Password reset email sent' });
});

router.post('/reset-password', (req, res) => {
  res.json({ message: 'Password has been reset' });
});

router.get('/callback/:provider', (req, res) => {
  const { provider } = req.params;
  res.json({ message: `OAuth callback for ${provider}` });
});

module.exports = router;