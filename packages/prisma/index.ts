import { PrismaClient as InternalPrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export * from "@prisma/client";

const getPrismaSingleton = () => {
  return new InternalPrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends({
    model: {
      user: {
        async requestsRemaining(id: string) {
          const count = await db.summaryRequest.count({
            where: {
              user_id: id,
              created_at: {
                gte: dayjs().subtract(1, "day").toDate(),
              },
            },
          });
          return Math.max(0, 20 - count);
        },
      },
    },
  });
};

export type PrismaClient = ReturnType<typeof getPrismaSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = (globalForPrisma.prisma ??= getPrismaSingleton());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
