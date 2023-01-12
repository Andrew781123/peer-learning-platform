import { PrismaClient, Question } from "@prisma/client";
import { DifficultyLevel } from "../constants/difficultyRating";
import getDifficultyLevel from "../server/utils/getDifficultyRating";
import { getAverageDifficultyRatingScore } from "../utils/question";

type FormattedQuestion = {
  topics: {
    name: string;
    count: number;
  }[];
  solutionCount: number;
  difficultyLevel: DifficultyLevel;
} & Omit<Question, "pastPaperId">;
export const getAllQuestionsByPastPaper = async (
  repo: PrismaClient["question"],
  pastPaperId: number
): Promise<FormattedQuestion[]> => {
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

  const formattedQuestions = questions.map(formatQuestion);

  return formattedQuestions;
};

const formatQuestion = (question: {
  number: number;
  id: string;
  solutions: {
    difficultyRating: {
      value: number;
    };
  }[];
  topics: {
    topic: {
      name: string;
      _count: {
        questions: number;
      };
    };
  }[];
  _count: {
    solutions: number;
  };
}): FormattedQuestion => ({
  ...question,
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
});
