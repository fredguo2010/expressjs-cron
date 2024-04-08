const { PrismaClient } = require('@prisma/client');

class PrismaSingleton {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.prisma = new PrismaClient();
    } else {
      if (!global.prisma) {
        global.prisma = new PrismaClient();
      }
      this.prisma = global.prisma;
    }
  }

  getInstance() {
    return this.prisma;
  }
}

const prismaSingleton = new PrismaSingleton();
module.exports = prismaSingleton.getInstance();
