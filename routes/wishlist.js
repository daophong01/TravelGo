// routes/wishlist.js
const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// GET /api/wishlist/user/:id
router.get('/user/:id', async (req, res) => {
  const userId = Number(req.params.id);
  const items = await prisma.wishlist.findMany({
    where: { userId },
    include: { destination: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(items);
});

module.exports = router;