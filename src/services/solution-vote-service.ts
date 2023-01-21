import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { SolutionVoteValue } from "../types/solution-vote";

export const vote = (
  repo: PrismaClient["solutionVote"],
  newVoteData: {
    value: SolutionVoteValue;
    userId: string;
    solutionId: string;
  }
) => {
  try {
    const vote = repo.create({
      data: newVoteData,
    });

    return vote;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
};

export const getVoteOfUser = async (
  repo: PrismaClient["solutionVote"],
  { userId, solutionId }: { userId: string; solutionId: string }
): Promise<SolutionVoteValue | 0> => {
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
