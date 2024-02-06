import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.ENVIRONMENT === "dev"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.ENVIRONMENT !== "prod") globalForPrisma.prisma = db;
