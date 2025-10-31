const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
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

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/destination', destinationRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/category', categoryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`TravelGo API server is running on port ${PORT}`);
});
