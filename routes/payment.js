// routes/payment.js
const express = require('express');
const router = express.Router();

// POST /api/payment/create
router.post('/create', (req, res) => {
  res.status(201).json({ paymentId: 'PMT-001', status: 'pending', provider: req.body.provider || 'mock' });
});

// GET /api/payment/:id
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, status: 'success', amount: 1000000 });
});

module.exports = router;