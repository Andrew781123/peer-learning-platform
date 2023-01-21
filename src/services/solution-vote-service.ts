import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { SolutionVoteValue } from "../types/solution-vote";

export const vote = (
  repo: PrismaClient["solutionQuestionVote"],
  newVoteData: {
    value: SolutionVoteValue;
    userId: string;
    solutionId: string;
    questionId: string;
  }
) => {
  try {
    const vote = repo.create({
      data: newVoteData,
    });

    return vote;
  } catch (err) {
    console.error(`Error vote service: ${err}`);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
};

export const getVoteOfUser = async (
  repo: PrismaClient["solutionQuestionVote"],
  { userId, solutionId }: { userId: string; solutionId: string }
): Promise<SolutionVoteValue> => {
  try {
    const votes = await repo.findFirst({
      where: {
        solutionId,
        userId,
      },
    });

    return (votes?.value as SolutionVoteValue) ?? 0;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
};
