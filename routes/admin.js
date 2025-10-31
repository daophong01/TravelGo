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

// Helpers
function parsePagingSort(req, map = {}) {
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 10);
  const sortBy = (req.query.sortBy || 'createdAt').toString();
  const order = (req.query.order || 'desc').toString().toLowerCase() === 'asc' ? 'asc' : 'desc';
  const orderBy = map[sortBy] || { [sortBy]: order };
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;
  return { page, pageSize, orderBy, from, to };
}

function csvResponse(res, filename, content) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(content);
}

// Bookings: list with filters and CSV export
function buildBookingWhere(from, to, status) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = from;
    if (to) where.createdAt.lte = to;
  }
  if (status) where.status = status.toString();
  return where;
}

// GET /api/admin/bookings?page=&pageSize=&sortBy=createdAt|status&order=&status=&from=&to=
router.get('/bookings', async (req, res) => {
  const { page, pageSize, orderBy, from, to } = parsePagingSort(req, { createdAt: { createdAt: 'desc' } });
  const status = req.query.status;
  const where = buildBookingWhere(from, to, status);

  const total = await prisma.booking.count({ where });
  const items = await prisma.booking.findMany({
    where,
    orderBy,
    include: { user: true, destination: true, payment: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  res.json({ items, total, page, pageSize });
});

router.get('/bookings/export', async (req, res) => {
  const { from, to } = parsePagingSort(req);
  const status = req.query.status;
  const where = buildBookingWhere(from, to, status);
  const items = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: true, destination: true, payment: true },
  });
  const rows = [['id', 'user', 'destination', 'status', 'totalAmount', 'createdAt']];
  for (const b of items) {
    rows.push([b.id, b.user?.email || '', b.destination?.name || '', b.status, b.totalAmount, b.createdAt.toISOString()]);
  }
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  csvResponse(res, 'bookings.csv', csv);
});

// Reviews: list with filters and CSV export (date range)
function buildReviewWhere(from, to) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = from;
    if (to) where.createdAt.lte = to;
  }
  return where;
}

// GET /api/admin/reviews?page=&pageSize=&sortBy=createdAt|rating&order=&from=&to=
router.get('/reviews', async (req, res) => {
  const { page, pageSize, orderBy, from, to } = parsePagingSort(req);
  const where = buildReviewWhere(from, to);
  const total = await prisma.review.count({ where });
  const items = await prisma.review.findMany({
    where,
    orderBy,
    include: { user: true, destination: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  res.json({ items, total, page, pageSize });
});

router.get('/reviews/export', async (req, res) => {
  const { from, to } = parsePagingSort(req);
  const where = buildReviewWhere(from, to);
  const items = await prisma.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: true, destination: true },
  });
  const rows = [['id', 'user', 'destination', 'rating', 'comment', 'createdAt']];
  for (const r of items) {
    rows.push([r.id, r.user?.email || '', r.destination?.name || '', r.rating, r.comment || '', r.createdAt.toISOString()]);
  }
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  csvResponse(res, 'reviews.csv', csv);
});

// Payments: list with filters and CSV export
function buildPaymentWhere(from, to, status) {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = from;
    if (to) where.createdAt.lte = to;
  }
  if (status) where.status = status.toString();
  return where;
}

// GET /api/admin/payments?page=&pageSize=&sortBy=createdAt|amount|status&order=&status=&from=&to=
router.get('/payments', async (req, res) => {
  const { page, pageSize, orderBy, from, to } = parsePagingSort(req);
  const status = req.query.status;
  const where = buildPaymentWhere(from, to, status);
  const total = await prisma.payment.count({ where });
  const items = await prisma.payment.findMany({
    where,
    orderBy,
    include: { booking: { include: { user: true, destination: true } } },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  res.json({ items, total, page, pageSize });
});

router.get('/payments/export', async (req, res) => {
  const { from, to } = parsePagingSort(req);
  const status = req.query.status;
  const where = buildPaymentWhere(from, to, status);
  const items = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { booking: { include: { user: true, destination: true } } },
  });
  const rows = [['id', 'user', 'destination', 'amount', 'status', 'provider', 'createdAt']];
  for (const p of items) {
    rows.push([
      p.id,
      p.booking?.user?.email || '',
      p.booking?.destination?.name || '',
      p.amount,
      p.status,
      p.provider,
      p.createdAt.toISOString(),
    ]);
  }
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  csvResponse(res, 'payments.csv', csv);
});

// Admin settings stub
router.get('/settings', (req, res) => {
  res.json({ currency: 'VND', locale: 'vi-VN' });
});

module.exports = router;