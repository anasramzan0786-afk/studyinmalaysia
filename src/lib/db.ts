import { PrismaClient } from '@prisma/client';
import { getRequiredEnv } from '@/lib/runtime-config';

if (!process.env.DATABASE_URL) {
  const envValue = getRequiredEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/postgres');
  process.env.DATABASE_URL = envValue;
}

if (!process.env.DIRECT_URL && process.env.NODE_ENV !== 'production') {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

// Preserve Prisma client across HMR in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

