import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getVoteOfUser, vote } from "../../../services/solution-vote-service";
import { SOLUTION_VOTE_VALUE } from "../../../types/solution-vote";
import { publicProcedure, router } from "../trpc";

export const solutionVoteRouter = router({
  vote: publicProcedure
    .input(
      z.object({
        solutionId: z.string(),
        voteValue: z.union([
          z.literal(SOLUTION_VOTE_VALUE.downVoted),
          z.literal(SOLUTION_VOTE_VALUE.upVoted),
          z.literal(SOLUTION_VOTE_VALUE.notVoted),
        ]),
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),

  getVoteOfUser: publicProcedure
    .input(
      z.object({
        solutionId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        if (!ctx.session?.user) return SOLUTION_VOTE_VALUE.notVoted;

        const voteOfUser = await getVoteOfUser(ctx.prisma.solutionVote, {
          userId: ctx.session.user.id,
          solutionId: input.solutionId,
        });

        return voteOfUser;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
