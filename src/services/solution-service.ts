import { PrismaClient } from "@prisma/client";
import { calculateVoteCount } from "../utils/solution/calculate-votes";

type SolutionResponse = {};
export const getAllSolutionsByQuestion = async (
  repo: PrismaClient["questionSolution"],
  questionId: string
) => {
  const solutions = await repo.findMany({
    where: { questionId: questionId },
    include: {
      difficultyRating: true,
      votes: true,
    },
  });

  return solutions.map((solution) => ({
    ...solution,
    votes: calculateVoteCount(solution.votes),
  }));
};

export const getOneById = async (
  repo: PrismaClient["questionSolution"],
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

    if (!solution) throw new Error("Solution not found");

    const votes = calculateVoteCount(solution.votes);

    return {
      ...solution,
      votes,
    };
  } catch (err) {
    throw err;
  }
};
