// routes/destination.js
const express = require('express');
const router = express.Router();

// GET /api/destination
router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Bali', slug: 'bali' }, { id: 2, name: 'Phu Quoc', slug: 'phu-quoc' }]);
});

// GET /api/destination/featured
router.get('/featured', (req, res) => {
  res.json([{ id: 1, name: 'Bali', slug: 'bali', featured: true }]);
});

// GET /api/destination/:slug
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  res.json({ id: 1, slug, name: slug.replace('-', ' ').toUpperCase(), description: 'Mock destination detail' });
});

// CRUD (admin usage typically)
// POST /api/destination
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Destination created', data: req.body });
});

// PUT /api/destination/:id
router.put('/:id', (req, res) => {
  res.json({ message: 'Destination updated', id: req.params.id, data: req.body });
});

// DELETE /api/destination/:id
router.delete('/:id', (req, res) => {
  res.status(204).send();
});

module.exports = router;