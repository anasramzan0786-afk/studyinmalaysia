import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  // Fallback for build environments before DATABASE_URL environment variable is set
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/postgres';
}

// Preserve Prisma client across HMR in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

