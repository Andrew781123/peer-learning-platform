import { z } from "zod";
import { vote } from "../../../services/solution-vote-service";
import { publicProcedure, router } from "../trpc";

export const solutionVoteRouter = router({
  vote: publicProcedure
    .input(
      z.object({
        solutionId: z.string(),
        voteValue: z.union([z.literal(1), z.literal(-1)]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = 1;

        const response = await vote(ctx.prisma.solutionVote, {
          value: input.voteValue,
          userId,
          solutionId: input.solutionId,
        });

        return response;
      } catch (err) {
        throw err;
      }
    }),
});
