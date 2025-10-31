// routes/booking.js
const express = require('express');
const router = express.Router();

// POST /api/booking
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Booking created', bookingId: 'BK-001', data: req.body });
});

// GET /api/booking/user/:id
router.get('/user/:id', (req, res) => {
  res.json([{ id: 'BK-001', userId: req.params.id, destination: 'Bali', status: 'confirmed' }]);
});

// Admin listing could be under /api/admin/bookings
module.exports = router;