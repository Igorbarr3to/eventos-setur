// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || createPrismaInstance();

function createPrismaInstance() {
  console.log('✅ [PRISMA] Nova instância do PrismaClient criada.'); // Mensagem de criação
  return new PrismaClient({
    log: ['query'], // Descomente para ver as queries no console
  });
}

if (process.env.NODE_ENV !== 'production') {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
  } else {
    console.log('🔄 [PRISMA] Reutilizando instância existente do PrismaClient (Hot Reload).'); // Mensagem de reutilização
  }
}