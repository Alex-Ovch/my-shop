import { PrismaClient } from "@prisma/client";

// Создаем глобальный экземпляр Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Используем существующий экземпляр или создаем новый
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// В режиме разработки сохраняем экземпляр глобально
// чтобы избежать создания множественных подключений
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
