const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { authRequired, isAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Basic health route
app.get('/', (req, res) => {
  res.send('TravelGo API is running');
});

// API routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const destinationRoutes = require('./routes/destination');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');
const reviewRoutes = require('./routes/review');
const notificationRoutes = require('./routes/notification');
const adminRoutes = require('./routes/admin');
const supportRoutes = require('./routes/support');
const categoryRoutes = require('./routes/category');
const wishlistRoutes = require('./routes/wishlist');
const loyaltyRoutes = require('./routes/loyalty');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/destination', destinationRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/notification', notificationRoutes);
// Protect all admin endpoints
app.use('/api/admin', authRequired, isAdmin, adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/loyalty', loyaltyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`TravelGo API server is running on port ${PORT}`);
});
