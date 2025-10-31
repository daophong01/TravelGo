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
  const rows = [['Mã', 'Người dùng', 'Điểm đến', 'Trạng thái', 'Tổng tiền', 'Ngày tạo']];
  for (const b of items) {
    rows.push([b.id, b.user?.email || '', b.destination?.name || '', b.status, b.totalAmount, b.createdAt.toISOString()]);
  }
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  csvResponse(res, 'bookings.csv', csv);
});

// Bulk update status for bookings
router.post('/bookings/bulk-status', async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number).filter(Boolean) : [];
  const status = req.body?.status?.toString();
  if (!ids.length || !status) return res.status(400).json({ message: 'Missing ids or status' });
  const result = await prisma.booking.updateMany({ where: { id: { in: ids } }, data: { status } });
  res.json({ updated: result.count });
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
  const rows = [['Mã', 'Người dùng', 'Điểm đến', 'Điểm', 'Bình luận', 'Ngày tạo']];
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
  const rows = [['Mã', 'Người dùng', 'Điểm đến', 'Số tiền', 'Trạng thái', 'Nhà cung cấp', 'Ngày tạo']];
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

// Bulk update status for payments
router.post('/payments/bulk-status', async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number).filter(Boolean) : [];
  const status = req.body?.status?.toString();
  if (!ids.length || !status) return res.status(400).json({ message: 'Missing ids or status' });
  const result = await prisma.payment.updateMany({ where: { id: { in: ids } }, data: { status } });
  res.json({ updated: result.count });
});

// Destinations export CSV (admin) with filters
router.get('/destinations/export', async (req, res) => {
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  const featured = typeof req.query.featured !== 'undefined' ? req.query.featured === 'true' : undefined;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const q = (req.query.q || '').toString().trim();

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(typeof featured === 'boolean' ? { featured } : {}),
    ...(typeof minPrice === 'number' ? { price: { gte: minPrice } } : {}),
    ...(typeof maxPrice === 'number' ? { price: { lte: maxPrice } } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}),
  };

  const items = await prisma.destination.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    include: { category: true },
  });

  const rows = [['Mã', 'Tên', 'Slug', 'Danh mục', 'Nổi bật', 'Giá', 'Ngày tạo']];
  for (const d of items) {
    rows.push([d.id, d.name, d.slug, d.category?.name || '', d.featured ? 'Có' : 'Không', d.price ?? 0, d.createdAt.toISOString()]);
  }
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  csvResponse(res, 'destinations.csv', csv);
});

// Admin settings stub
router.get('/settings', (req, res) => {
  res.json({ currency: 'VND', locale: 'vi-VN' });
});

module.exports = router;