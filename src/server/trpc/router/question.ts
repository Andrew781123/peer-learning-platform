import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const questionRouter = router({
  getAllByPastPaper: publicProcedure
    .input(
      z.object({
        pastPaperId: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.question.findMany({
        where: { pastPaperId: input.pastPaperId },
      });
    }),
});
