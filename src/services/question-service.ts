import { PrismaClient, Question } from "@prisma/client";
import { getAverageDifficultyRatingScore } from "../utils/question";

type FormattedQuestion = {
  topics: {
    name: string;
    count: number;
  }[];
  solutionCount: number;
  averageDifficultyScore: number;
} & Omit<Question, "pastPaperId">;
export const getAllQuestionsByPastPaper = async (
  repo: PrismaClient["question"],
  pastPaperId: number
): Promise<FormattedQuestion[]> => {
  try {
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
            solution: {
              select: {
                difficultyRating: {
                  select: {
                    value: true,
                  },
                },
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
  } catch (err) {
    throw err;
  }
};

export const getOneQuestion = async (
  repo: PrismaClient["question"],
  questionId: string
): Promise<FormattedQuestion | null> => {
  try {
    const question = await repo.findUnique({
      where: {
        id: questionId,
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
            solution: {
              select: {
                difficultyRating: {
                  select: {
                    value: true,
                  },
                },
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

    if (!question) return null;

    const formattedQuestion = formatQuestion(question!);

    return formattedQuestion;
  } catch (err) {
    throw err;
  }
};

const formatQuestion = (question: {
  number: number;
  id: string;
  solutions: {
    solution: {
      difficultyRating: {
        value: number;
      };
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
  averageDifficultyScore: getAverageDifficultyRatingScore(question.solutions),
});
