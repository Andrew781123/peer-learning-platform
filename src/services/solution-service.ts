import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { calculateVoteCount } from "../utils/solution/calculate-votes";

export const getAllSolutionsByQuestion = async (
  repo: PrismaClient["solution"],
  questionId: string
) => {
  const solutions = await repo.findMany({
    where: {
      questions: {
        some: {
          question: {
            id: questionId,
          },
        },
      },
    },
    include: {
      difficultyRating: true,
      votes: true,
      user: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  return solutions.map((solution) => ({
    ...solution,
    votes: calculateVoteCount(solution.votes),
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
        user: true,
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
    console.error(err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
};
