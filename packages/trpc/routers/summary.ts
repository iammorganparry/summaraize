import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "../trpc";

export const summaryRouter = createTRPCRouter({
  getSummaryByVideoUrl: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.db.summary.findFirst({
        where: {
          video_url: input.url,
        },
      });
    }),
  requestSummary: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        src: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      console.log("requestSummary", input);
      return ctx.inngest.send({
        name: "app/transcribe-video",
        data: {
          src: input.src,
          videoId: input.videoId,
          userId: ctx.auth.userId,
        },
      });
    }),
  cancelSummary: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        src: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.inngest.send({
        name: "app/cancel-transcription",
        data: {
          src: input.src,
          videoId: input.videoId,
          userId: ctx.auth.userId,
        },
      });
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
