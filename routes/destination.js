// routes/destination.js
const express = require('express');
const prisma = require('../lib/prisma');
const { authRequired, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// uploads for destination images
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || '') || '.jpg';
    cb(null, `dest_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// GET /api/destination
// Supports pagination, multi-category filter, price range, search, featured filter and sort
// ?page=1&pageSize=10&categoryId=1&categoryIds=1,2&q=beach&minPrice=0&maxPrice=10000000&featured=true|false&sort=name_asc|name_desc|created_desc|created_asc|featured_first
router.get('/', async (req, res) => {
  const page = Number(req.query.page || 0);
  const pageSize = Number(req.query.pageSize || 0);
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  const categoryIds = req.query.categoryIds
    ? req.query.categoryIds.toString().split(',').map((v) => Number(v)).filter(Boolean)
    : undefined;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const featured = typeof req.query.featured !== 'undefined'
    ? (req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined)
    : undefined;
  const q = (req.query.q || '').toString().trim();
  const sort = (req.query.sort || 'created_desc').toString();

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(categoryIds && categoryIds.length ? { categoryId: { in: categoryIds } } : {}),
    ...(typeof minPrice === 'number' ? { price: { gte: minPrice } } : {}),
    ...(typeof maxPrice === 'number' ? { price: { lte: maxPrice } } : {}),
    ...(typeof featured === 'boolean' ? { featured } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}),
  };

  let orderBy;
  if (sort === 'name_asc') orderBy = { name: 'asc' };
  else if (sort === 'name_desc') orderBy = { name: 'desc' };
  else if (sort === 'created_asc') orderBy = { createdAt: 'asc' };
  else if (sort === 'featured_first') orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
  else orderBy = { createdAt: 'desc' };

  if (page > 0 && pageSize > 0) {
    const total = await prisma.destination.count({ where });
    const items = await prisma.destination.findMany({
      where,
      orderBy,
      include: { category: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return res.json({ items, total, page, pageSize });
  }

  const items = await prisma.destination.findMany({
    where,
    orderBy,
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

// Images
// GET /api/destination/:id/images
router.get('/:id/images', async (req, res) => {
  const id = Number(req.params.id);
  const images = await prisma.destinationImage.findMany({ where: { destinationId: id }, orderBy: { createdAt: 'desc' } });
  res.json(images);
});

// POST /api/destination/:id/images
router.post('/:id/images', authRequired, isAdmin, upload.array('files', 10), async (req, res) => {
  const id = Number(req.params.id);
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const created = await prisma.$transaction(
    req.files.map((f) => prisma.destinationImage.create({ data: { destinationId: id, url: `/uploads/${f.filename}` } }))
  );
  res.status(201).json(created);
});

// DELETE /api/destination/images/:imageId
router.delete('/images/:imageId', authRequired, isAdmin, async (req, res) => {
  const imageId = Number(req.params.imageId);
  await prisma.destinationImage.delete({ where: { id: imageId } });
  res.status(204).send();
});

// Admin CRUD
router.post('/', authRequired, isAdmin, async (req, res) => {
  const { name, slug, description, featured = false, categoryId = null, price = 0, lat = 0, lng = 0 } = req.body || {};
  if (!name || !slug) return res.status(400).json({ message: 'Missing fields' });
  const created = await prisma.destination.create({
    data: { name, slug, description, featured, categoryId, price, lat, lng },
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

// Bulk delete
router.post('/bulk-delete', authRequired, isAdmin, async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map((v) => Number(v)).filter(Boolean) : [];
  if (!ids.length) return res.status(400).json({ message: 'No ids provided' });
  await prisma.destination.deleteMany({ where: { id: { in: ids } } });
  res.json({ deleted: ids.length });
});

module.exports = router;