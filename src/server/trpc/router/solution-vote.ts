import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getOneById as getOneSolutionById } from "../../../services/solution-service";
import { getVoteOfUser, vote } from "../../../services/solution-vote-service";
import { SOLUTION_VOTE_VALUE } from "../../../types/solution-vote";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const solutionVoteRouter = router({
  vote: protectedProcedure
    .input(
      z.object({
        solutionId: z.string(),
        questionId: z.string(),
        voteValue: z.union([
          z.literal(SOLUTION_VOTE_VALUE.downVoted),
          z.literal(SOLUTION_VOTE_VALUE.upVoted),
          z.literal(SOLUTION_VOTE_VALUE.notVoted),
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await vote(ctx.prisma.solutionQuestionVote, {
          value: input.voteValue,
          userId: ctx.session.user.id,
          solutionId: input.solutionId,
          questionId: input.questionId,
        });

        return response;
      } catch (err) {
        console.error(`Error voting: ${err}`);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),

  getVoteInfo: publicProcedure
    .input(
      z.object({
        solutionId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const solution = await getOneSolutionById(ctx.prisma.solution, {
          solutionId: input.solutionId,
        });

        if (!ctx.session?.user)
          return {
            voteOfUser: SOLUTION_VOTE_VALUE.notVoted,
            votes: solution.votes,
          };

        const voteOfUser = await getVoteOfUser(
          ctx.prisma.solutionQuestionVote,
          {
            userId: ctx.session.user.id,
            solutionId: input.solutionId,
          }
        );

        return {
          voteOfUser,
          votes: solution.votes,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
