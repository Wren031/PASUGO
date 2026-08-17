const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

prisma.$executeRaw('ALTER TABLE "users" DROP COLUMN "name"')
  .then(() => {
    console.log('Dropped name column from users table');
    return prisma.$disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    return prisma.$disconnect().then(() => process.exit(1));
  });