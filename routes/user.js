// routes/user.js
const express = require('express');
const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const { authRequired } = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// ensure uploads dir
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || '') || '.jpg';
    cb(null, `avatar_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// GET /api/user/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, createdAt: true, avatarUrl: true, settings: true },
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// PUT /api/user/:id
router.put('/:id', authRequired, async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, avatarUrl, settings } = req.body || {};
  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      ...(settings !== undefined ? { settings } : {}),
    },
    select: { id: true, email: true, name: true, role: true, avatarUrl: true, settings: true },
  });
  res.json(updated);
});

// PUT /api/user/:id/settings
router.put('/:id/settings', authRequired, async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, avatarUrl, settings } = req.body || {};
  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      ...(settings !== undefined ? { settings } : {}),
    },
    select: { id: true, email: true, name: true, role: true, avatarUrl: true, settings: true },
  });
  res.json({ message: 'Settings updated', user: updated });
});

// PUT /api/user/:id/password
router.put('/:id/password', authRequired, async (req, res) => {
  const id = Number(req.params.id);
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ message: 'Missing password' });
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id }, data: { passwordHash } });
  res.json({ message: 'Password changed' });
});

// POST /api/user/:id/avatar (multipart form-data)
router.post('/:id/avatar', authRequired, upload.single('file'), async (req, res) => {
  const id = Number(req.params.id);
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  await prisma.user.update({ where: { id }, data: { avatarUrl: url } });
  res.json({ message: 'Avatar uploaded', url });
});

module.exports = router;