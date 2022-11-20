import { z } from "zod";
import getDifficultyLevel from "../../utils/getDifficultyRating";
import { publicProcedure, router } from "../trpc";

const MIN_TAG_COUNT = 0;

export const questionRouter = router({
  getAllByPastPaper: publicProcedure
    .input(
      z.object({
        pastPaperId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const questions = await ctx.prisma.question.findMany({
        where: {
          pastPaperId: input.pastPaperId,
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

      const getAverageDifficultyRatingScore = (
        question: typeof questions[0]
      ): number => {
        return (
          question.solutions.reduce(
            (sum, solution) => (sum += solution.difficultyRating?.value ?? 0),
            0
          ) / (question.solutions.length || 1)
        );
      };

      const response = questions.map((question) => ({
        ...question,
        topics: Object.entries(
          question.topics.reduce((acc, topic) => {
            if (topic.topic.name in acc) return acc;
            if (topic.topic._count.questions < MIN_TAG_COUNT) return acc;
            return {
              ...acc,
              [topic.topic.name]: topic.topic._count.questions,
            };
          }, {} as { [key: string]: number })
        )
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .map((topic) => topic.name),
        solutionCount: question._count.solutions,
        difficultyLevel: getDifficultyLevel(
          getAverageDifficultyRatingScore(question)
        ),
      }));

      return response;
    }),
});
