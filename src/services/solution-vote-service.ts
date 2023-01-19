import { PrismaClient } from "@prisma/client";
import { SolutionVoteValue } from "../types/solution-vote";

export const vote = (
  repo: PrismaClient["solutionVote"],
  newVoteData: {
    value: SolutionVoteValue;
    userId: number;
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
