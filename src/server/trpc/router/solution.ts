import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const solutionRouter = router({
  createMany: publicProcedure
    .input(
      z.array(
        z.object({
          subjectId: z.string(),
          questionId: z.number(),
          markdown: z.string(),
          difficultyRatingId: z.number(),
        })
      )
    )
    .mutation(({ input, ctx }) => {}),
});
