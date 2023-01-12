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
