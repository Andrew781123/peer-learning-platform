import { PrismaClient } from "@prisma/client";

type SolutionResponse = {};
export const getAllSolutionsByQuestion = async (
  repo: PrismaClient["questionSolution"],
  questionId: string
) => {
  const solutions = await repo.findMany({
    where: { questionId: questionId },
    include: {
      difficultyRating: true,
    },
  });

  return solutions;
};

export const getOneById = async (
  repo: PrismaClient["questionSolution"],
  id: string
) => {
  const solution = await repo.findUnique({
    where: { id },
    include: {
      difficultyRating: true,
    },
  });

  return solution;
};
