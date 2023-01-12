import { PrismaClient } from "@prisma/client";
import { DifficultyLevel } from "../constants/difficultyRating";
import getDifficultyLevel from "../server/utils/getDifficultyRating";
import { getAverageDifficultyRatingScore } from "../utils/question";

export const getAllByPastPaper = async (
  repo: PrismaClient["question"],
  pastPaperId: number
): Promise<
  {
    topics: {
      name: string;
      count: number;
    }[];
    solutionCount: number;
    difficultyLevel: DifficultyLevel;
  }[]
> => {
  const questions = await repo.findMany({
    where: {
      pastPaperId: pastPaperId,
    },
    select: {
      id: true,
      number: true,
      topics: {
        select: {
          topic: {
            select: {
              name: true,
              _count: {
                select: {
                  questions: true,
                },
              },
            },
          },
        },
      },
      solutions: {
        select: {
          difficultyRating: {
            select: {
              value: true,
            },
          },
        },
      },
      _count: {
        select: {
          solutions: true,
        },
      },
    },
  });

  const formattedQuestions = questions.map((question) => ({
    ...questions,
    topics: Object.entries(
      question.topics.reduce((acc, topic) => {
        if (topic.topic.name in acc) return acc;
        return {
          ...acc,
          [topic.topic.name]: topic.topic._count.questions,
        };
      }, {} as { [key: string]: number })
    )
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    solutionCount: question._count.solutions,
    difficultyLevel: getDifficultyLevel(
      getAverageDifficultyRatingScore(question.solutions)
    ),
  }));

  return formattedQuestions;
};
