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
        if (!ctx.session?.user) throw new Error("User not logged in");

        const response = await vote(ctx.prisma.solutionVote, {
          value: input.voteValue,
          userId: ctx.session.user.id,
          solutionId: input.solutionId,
        });

        return response;
      } catch (err) {
        throw err;
      }
    }),
});
