// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const router = express.Router();

function signToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role: 'USER' },
    select: { id: true, email: true, name: true, role: true },
  });

  const token = signToken(user);
  return res.status(201).json({ user, token });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const { passwordHash, ...safe } = user;
  const token = signToken(user);
  return res.json({ user: safe, token });
});

// Stubs
router.post('/forgot-password', (req, res) => {
  res.json({ message: 'Password reset email sent' });
});

router.post('/reset-password', (req, res) => {
  res.json({ message: 'Password has been reset' });
});

router.get('/callback/:provider', (req, res) => {
  const { provider } = req.params;
  res.json({ message: `OAuth callback for ${provider}` });
});

module.exports = router;