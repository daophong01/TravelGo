// routes/destination.js
const express = require('express');
const prisma = require('../lib/prisma');
const { authRequired, isAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/destination
// Supports optional pagination with ?page=1&pageSize=10
router.get('/', async (req, res) => {
  const page = Number(req.query.page || 0);
  const pageSize = Number(req.query.pageSize || 0);

  if (page > 0 && pageSize > 0) {
    const total = await prisma.destination.count();
    const items = await prisma.destination.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return res.json({ items, total, page, pageSize });
  }

  const items = await prisma.destination.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });
  res.json(items);
});

// GET /api/destination/featured
router.get('/featured', async (req, res) => {
  const items = await prisma.destination.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
  res.json(items);
});

// GET /api/destination/:slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const dest = await prisma.destination.findUnique({ where: { slug } });
  if (!dest) return res.status(404).json({ message: 'Destination not found' });
  res.json(dest);
});

// Admin CRUD
router.post('/', authRequired, isAdmin, async (req, res) => {
  const { name, slug, description, featured = false, categoryId = null } = req.body || {};
  if (!name || !slug) return res.status(400).json({ message: 'Missing fields' });
  const created = await prisma.destination.create({
    data: { name, slug, description, featured, categoryId },
  });
  res.status(201).json(created);
});

router.put('/:id', authRequired, isAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const updated = await prisma.destination.update({ where: { id }, data: req.body || {} });
  res.json(updated);
});

router.delete('/:id', authRequired, isAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.destination.delete({ where: { id } });
  res.status(204).send();
});

module.exports = router;