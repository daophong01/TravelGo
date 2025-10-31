// routes/payment.js
const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// POST /api/payment/create (stub for now)
router.post('/create', async (req, res) => {
  // In real flow, create payment intent with provider and return redirect/clientSecret.
  res.status(201).json({ paymentId: 'PMT-001', status: 'pending', provider: req.body.provider || 'mock' });
});

// GET /api/payment/user/:id - list payments by user via Booking relation
router.get('/user/:id', async (req, res) => {
  const userId = Number(req.params.id);
  const payments = await prisma.payment.findMany({
    where: { booking: { userId } },
    include: { booking: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(payments);
});

// GET /api/payment/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const payment = await prisma.payment.findUnique({ where: { id }, include: { booking: true } });
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  res.json(payment);
});

module.exports = router;