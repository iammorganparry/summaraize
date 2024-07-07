import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "../trpc";

export const summaryRouter = createTRPCRouter({
  requestSummary: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
      })
    )
    .mutation(({ input }) => {
      return input.videoId;
    }),
  getLatest: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        page: z.number().default(1),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.db.summary.findMany({
        take: input.limit,
        skip: (input.page - 1) * input.limit,
        orderBy: {
          created_at: "desc",
        },
        include: {
          video: {
            include: {
              authors: true,
            },
          },
        },
      });
    }),
});
