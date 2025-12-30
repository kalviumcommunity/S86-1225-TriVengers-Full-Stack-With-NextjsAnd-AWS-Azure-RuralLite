// Prisma Client Singleton for Next.js API routes
// Reads DATABASE_URL from .env.local (local or cloud PostgreSQL)
// For cloud DB, set DATABASE_URL to your RDS/Azure connection string

import { PrismaClient } from "@prisma/client";

const prismaClientConfig = {
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
};

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(prismaClientConfig);
} else {
  // Prevent multiple instances in dev (hot reload safe)
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient(prismaClientConfig);
  }
  prisma = globalThis.__prisma;
}

// Usage:
// 1. Set DATABASE_URL in .env.local (local or cloud)
// 2. Import prisma from this file in your API routes
// 3. All queries use the configured DB

export { prisma };
export default prisma;
