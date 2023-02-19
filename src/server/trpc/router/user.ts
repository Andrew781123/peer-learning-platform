import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
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
