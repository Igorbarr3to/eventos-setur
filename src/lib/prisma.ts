// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || createPrismaInstance();

function createPrismaInstance() {
  return new PrismaClient({
    log: ['query'],
  });
}

if (process.env.NODE_ENV !== 'production') {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
  } else {
    
  }
}