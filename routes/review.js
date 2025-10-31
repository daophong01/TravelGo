// routes/review.js
const express = require('express');
const router = express.Router();

// GET /api/review/:destinationId
router.get('/:destinationId', (req, res) => {
  res.json([
    { id: 1, destinationId: req.params.destinationId, rating: 5, comment: 'Tuyệt vời!' },
    { id: 2, destinationId: req.params.destinationId, rating: 4, comment: 'Rất tốt' },
  ]);
});

// GET /api/review/user/:id
router.get('/user/:id', (req, res) => {
  res.json([{ id: 1, userId: req.params.id, rating: 5, comment: 'Great trip!' }]);
});

module.exports = router;