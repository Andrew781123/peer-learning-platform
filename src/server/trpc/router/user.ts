import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          name: true,
        },
      });

      return user;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
  }),
  patchNewUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(({ ctx, input }) => {
      const studentId = input.email.split("@")[0]!;
      const newUserName = `${studentId.slice(-5, -1)}${input.userId.slice(-4)}`;

      return ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          name: newUserName,
        },
      });
    }),
});
