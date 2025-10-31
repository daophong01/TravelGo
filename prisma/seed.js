/* prisma/seed.js */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  // Categories
  const beach = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Beach' },
  });
  const adventure = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Adventure' },
  });

  // Destinations
  await prisma.destination.upsert({
    where: { slug: 'bali' },
    update: {},
    create: {
      name: 'Bali',
      slug: 'bali',
      description: 'Island of the Gods',
      featured: true,
      categoryId: beach.id,
    },
  });
  await prisma.destination.upsert({
    where: { slug: 'phu-quoc' },
    update: {},
    create: {
      name: 'Phu Quoc',
      slug: 'phu-quoc',
      description: 'Pearl Island of Vietnam',
      featured: true,
      categoryId: beach.id,
    },
  });
  await prisma.destination.upsert({
    where: { slug: 'sapa' },
    update: {},
    create: {
      name: 'Sa Pa',
      slug: 'sapa',
      description: 'Mountainous town with terraced fields',
      featured: false,
      categoryId: adventure.id,
    },
  });

  // Admin user (password: admin123)
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@travelgo.dev' },
    update: {},
    create: {
      email: 'admin@travelgo.dev',
      passwordHash: hash,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log('Seed completed.');
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });