import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "../trpc";
import { SummaryStage } from ".prisma/client";

export const summaryRouter = createTRPCRouter({
  getSummaryById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.db.summary.findFirst({
        where: {
          id: input.id,
          user: {
            id: ctx.auth.userId,
          },
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
  getSummaryRequests: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.summaryRequest.findMany({
      where: {
        user_id: ctx.auth.userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }),
  getSummaryRequestByUrl: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.db.summaryRequest.findFirst({
        where: {
          video_url: input.url,
          user_id: ctx.auth.userId,
        },
      });
    }),
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
          user: {
            id: ctx.auth.userId,
          },
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
  requestSummary: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        src: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const summaryRequest = await ctx.db.summaryRequest.create({
        data: {
          name: `Summary request for video ${input.src}`,
          stage: SummaryStage.DOWNLOADING,
          video_url: input.src,
          user_id: ctx.auth.userId,
        },
      });
      return ctx.inngest.send({
        name: "app/transcribe-video",
        data: {
          src: input.src,
          videoId: input.videoId,
          userId: ctx.auth.userId,
          summaryRequestId: summaryRequest.id,
        },
      });
    }),
  cancelSummary: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.inngest.send({
        name: "app/cancel-transcription",
        data: {
          requestId: input.requestId,
          userId: ctx.auth.userId,
        },
      });
      return await ctx.db.summaryRequest.delete({
        where: {
          id: input.requestId,
        },
      });
    }),
  deleteSummary: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.$transaction([
        ctx.db.summary.deleteMany({
          where: {
            video_url: input.url,
            user: {
              id: ctx.auth.userId,
            },
          },
        }),
        ctx.db.summaryRequest.deleteMany({
          where: {
            video_url: input.url,
            user_id: ctx.auth.userId,
          },
        }),
      ]);
    }),
  getLatest: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        page: z.number().default(1),
      })
    )
    .query(({ input, ctx }) => {
      const userId = ctx.auth.userId;
      return ctx.db.summary.findMany({
        where: {
          user: {
            id: userId,
          },
        },
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
