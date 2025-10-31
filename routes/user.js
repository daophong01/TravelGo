// routes/user.js
const express = require('express');
const router = express.Router();

// GET/PUT /api/user/:id
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Mock User', email: 'user@example.com' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'User updated', data: req.body });
});

// PUT /api/user/:id/settings
router.put('/:id/settings', (req, res) => {
  res.json({ message: 'Settings updated', settings: req.body });
});

// PUT /api/user/:id/password
router.put('/:id/password', (req, res) => {
  res.json({ message: 'Password changed' });
});

module.exports = router;