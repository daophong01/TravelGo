// routes/admin.js
const express = require('express');
const router = express.Router();

// GET /api/admin/summary
router.get('/summary', (req, res) => {
  res.json({
    revenue: 125000000,
    totalBookings: 342,
    totalUsers: 1287,
    totalDestinations: 68,
  });
});

// GET/DELETE /api/admin/users
router.get('/users', (req, res) => {
  res.json([{ id: 1, email: 'user@example.com' }]);
});
router.delete('/users/:id', (req, res) => {
  res.status(204).send();
});

// GET /api/admin/bookings
router.get('/bookings', (req, res) => {
  res.json([{ id: 'BK-001', status: 'confirmed' }]);
});

// GET /api/admin/reviews
router.get('/reviews', (req, res) => {
  res.json([{ id: 1, rating: 5 }]);
});

// GET /api/admin/payments
router.get('/payments', (req, res) => {
  res.json([{ id: 'PMT-001', status: 'success' }]);
});

// Admin settings stub
router.get('/settings', (req, res) => {
  res.json({ currency: 'VND', locale: 'vi-VN' });
});

module.exports = router;