import { z } from "zod";
import { getVoteOfUser, vote } from "../../../services/solution-vote-service";
import { protectedProcedure, publicProcedure, router } from "../trpc";

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
        console.log(234, ctx.session);
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

  getVoteOfUser: protectedProcedure
    .input(
      z.object({
        solutionId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const voteOfUser = await getVoteOfUser(ctx.prisma.solutionVote, {
          userId: ctx.session.user.id,
          solutionId: input.solutionId,
        });

        return voteOfUser;
      } catch (err) {
        throw err;
      }
    }),
});
