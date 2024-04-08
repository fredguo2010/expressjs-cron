const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const config = require('../../src/config/config');

const setupTestDB = () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    // Clear the data in your Prisma tables (replace 'YourModelName' with the actual model name)
    await prisma.yourModelName.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
};

module.exports = setupTestDB;
