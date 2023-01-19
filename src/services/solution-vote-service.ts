import { PrismaClient } from "@prisma/client";
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
    throw err;
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
    throw err;
  }
};
