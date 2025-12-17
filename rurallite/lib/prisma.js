import { PrismaClient } from '@prisma/client';

const prismaClientConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
};

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaClientConfig);
} else {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient(prismaClientConfig);
  }
  prisma = globalThis.__prisma;
}

export { prisma };
export default prisma;
