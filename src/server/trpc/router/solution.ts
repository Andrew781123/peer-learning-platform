import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const solutionRouter = router({
  createMany: publicProcedure
    .input(
      z.object({
        pastPaperId: z.number(),
        solutions: z.array(
          z.object({
            number: z.number(),
            pastPaperId: z.number(),
            questionId: z.number(),
            markdown: z.string(),
            difficultyRatingId: z.number(),
          })
        ),
      })
    )
    .mutation(({ input, ctx }) => {
      const { pastPaperId, solutions } = input;

      ctx.prisma.question.createMany({
        data: solutions.map((solution) => ({
          number: solution.number,
          pastPaperId,
        })),
      });
    }),
});
