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

// GET/DELETE /api/admin/users
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

router.delete('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.status(204).send();
});

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  const items = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, destination: true },
  });
  res.json(items);
});

// GET /api/admin/reviews
router.get('/reviews', async (req, res) => {
  const items = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, destination: true },
  });
  res.json(items);
});

// GET /api/admin/payments
router.get('/payments', async (req, res) => {
  const items = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { booking: true },
  });
  res.json(items);
});

// Admin settings stub
router.get('/settings', (req, res) => {
  res.json({ currency: 'VND', locale: 'vi-VN' });
});

module.exports = router;