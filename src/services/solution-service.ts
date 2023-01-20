import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { calculateVoteCount } from "../utils/solution/calculate-votes";

export const getAllSolutionsByQuestion = async (
  repo: PrismaClient["questionSolution"],
  questionId: string
) => {
  const solutions = await repo.findMany({
    where: { questionId: questionId },
    include: {
      solution: {
        include: {
          difficultyRating: true,
          votes: true,
        },
      },
    },
  });

  return solutions.map((solution) => ({
    ...solution,
    votes: calculateVoteCount(solution.solution.votes),
  }));
};

export const getOneById = async (
  repo: PrismaClient["solution"],
  { solutionId }: { solutionId: string }
) => {
  try {
    const solution = await repo.findUnique({
      where: { id: solutionId },
      include: {
        difficultyRating: true,
        votes: true,
      },
    });

    if (!solution)
      throw new TRPCError({
        message: "Solution not found",
        code: "NOT_FOUND",
      });

    const votes = calculateVoteCount(solution.votes);

    return {
      ...solution,
      votes,
    };
  } catch (err) {
    throw err;
  }
};
