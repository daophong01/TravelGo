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

// Helpers for paging/sorting
function parsePagingSort(req, map = {}) {
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 10);
  const sortBy = (req.query.sortBy || 'createdAt').toString();
  const order = (req.query.order || 'desc').toString().toLowerCase() === 'asc' ? 'asc' : 'desc';
  const orderBy = map[sortBy] || { [sortBy]: order };
  return { page, pageSize, orderBy };
}

// GET /api/admin/bookings?page=&pageSize=&sortBy=createdAt|status&order=asc|desc
router.get('/bookings', async (req, res) => {
  const { page, pageSize, orderBy } = parsePagingSort(req, { createdAt: { createdAt: 'desc' } });
  const total = await prisma.booking.count();
  const items = await prisma.booking.findMany({
    orderBy,
    include: { user: true, destination: true, payment: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  res.json({ items, total, page, pageSize });
});

// GET /api/admin/reviews?page=&pageSize=&sortBy=createdAt|rating&order=asc|desc
router.get('/reviews', async (req, res) => {
  const { page, pageSize, orderBy } = parsePagingSort(req);
  const total = await prisma.review.count();
  const items = await prisma.review.findMany({
    orderBy,
    include: { user: true, destination: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  res.json({ items, total, page, pageSize });
});

// GET /api/admin/payments?page=&pageSize=&sortBy=createdAt|amount|status&order=asc|desc
router.get('/payments', async (req, res) => {
  const { page, pageSize, orderBy } = parsePagingSort(req);
  const total = await prisma.payment.count();
  const items = await prisma.payment.findMany({
    orderBy,
    include: { booking: { include: { user: true, destination: true } } },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  res.json({ items, total, page, pageSize });
});

// Admin settings stub
router.get('/settings', (req, res) => {
  res.json({ currency: 'VND', locale: 'vi-VN' });
});

module.exports = router;