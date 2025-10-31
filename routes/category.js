// routes/category.js
const express = require('express');
const router = express.Router();

// GET /api/category
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Beach' },
    { id: 2, name: 'Adventure' },
    { id: 3, name: 'Culture' },
  ]);
});

module.exports = router;