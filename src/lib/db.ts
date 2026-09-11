import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  // Fallback to local SQLite DB for environments without .env (e.g., Vercel preview)
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

// Preserve Prisma client across HMR in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

