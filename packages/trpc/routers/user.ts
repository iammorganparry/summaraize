import { protectedProcedure, createTRPCRouter } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const [user, requestsRemaining] = await Promise.all([
      ctx.db.user.findUnique({
        where: {
          id: ctx.auth.userId,
        },
      }),
      ctx.db.user.requestsRemaining(ctx.auth.userId),
    ]);
    return {
      ...user,
      requestsRemaining,
    };
  }),
});
