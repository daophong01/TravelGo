// routes/notification.js
const express = require('express');
const router = express.Router();

// GET /api/notification/user/:id
router.get('/user/:id', (req, res) => {
  res.json([
    { id: 1, userId: req.params.id, type: 'booking', message: 'Your booking BK-001 is confirmed.' },
  ]);
});

module.exports = router;