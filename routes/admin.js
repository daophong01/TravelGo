// routes/admin.js
const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET /api/admin/summary
router.get('/summary', async (req, res) => {
  const [totalUsers, totalDestinations, totalBookings, paymentsSuccess] = await Promise.all([
    prisma.user.count(),
    prisma.destination.count(),
    prisma.booking.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCESS' },
    }),
  ]);

  res.json({
    revenue: paymentsSuccess._sum.amount || 0,
    totalBookings,
    totalUsers,
    totalDestinations,
  });
});

// Users
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

router.put('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, role, email } = req.body || {};
  const updated = await prisma.user.update({
    where: { id },
    data: { ...(name ? { name } : {}), ...(role ? { role } : {}), ...(email ? { email } : {}) },
    select: { id: true, email: true, name: true, role: true },
  });
  res.json(updated);
});

router.post('/users/bulk-delete', async (req, res) => {
  const ids = (req.body?.ids || []).map(Number).filter(Boolean);
  if (!ids.length) return res.status(400).json({ message: 'No ids provided' });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  res.json({ deleted: ids.length });
});

router.delete('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.status(204).send();
});

// Bookings
router.get('/bookings', async (req, res) => {
  const items = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, destination: true },
  });
  res.json(items);
});

router.delete('/bookings/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.booking.delete({ where: { id } });
  res.status(204).send();
});

// Reviews
router.get('/reviews', async (req, res) => {
  const items = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, destination: true },
  });
  res.json(items);
});

router.delete('/reviews/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.review.delete({ where: { id } });
  res.status(204).send();
});

// Payments
router.get('/payments', async (req, res) => {
  const items = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { booking: true },
  });
  res.json(items);
});

router.delete('/payments/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.payment.delete({ where: { id } });
  res.status(204).send();
});

// Admin settings stub
router.get('/settings', (req, res) => {
  res.json({ currency: 'VND', locale: 'vi-VN' });
});

module.exports = router;