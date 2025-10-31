// routes/review.js
const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET /api/review/:destinationId
router.get('/:destinationId', async (req, res) => {
  const destinationId = Number(req.params.destinationId);
  const items = await prisma.review.findMany({
    where: { destinationId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(items);
});

// GET /api/review/user/:id
router.get('/user/:id', async (req, res) => {
  const userId = Number(req.params.id);
  const items = await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(items);
});

module.exports = router;