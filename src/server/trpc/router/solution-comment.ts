import { z } from "zod";

import {
  protectedProcedure,
  publicProcedure,
  router,
} from "@/server/trpc/trpc";

export const solutionCommentRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        solutionId: z.string(),
        markdown: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { solutionId, markdown } = input;

      const response = await ctx.prisma.solutionComment.create({
        data: {
          solutionId,
          markdown,
          userId: ctx.session.user.id,
        },
      });

      return response;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        where: z.object({
          solutionId: z.string(),
        }),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.solutionComment.findMany({
        where: input.where,
        include: {
          user: true,
        },
      });

      return response;
    }),
});
