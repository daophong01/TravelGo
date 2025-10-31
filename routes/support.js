// routes/support.js
const express = require('express');
const router = express.Router();

// POST /api/support
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Support ticket created', ticketId: 'SUP-001', data: req.body });
});

module.exports = router;