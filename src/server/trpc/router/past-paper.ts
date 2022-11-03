import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const pastPaperRouter = router({
  getAllBySubject: publicProcedure
    .input(
      z.object({
        subjectId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.pastPaper.findMany({
        where: { subjectId: input.subjectId },
      });
    }),
  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.pastPaper.findFirst({
        where: { id: input.id },
      });
    }),
});
