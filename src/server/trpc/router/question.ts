import { z } from "zod";
import getDifficultyRating from "../../utils/getDifficultyRating";
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
        topics: question.topics
          .filter((topic) => topic.topic._count.questions >= MIN_TAG_COUNT)
          .sort((a, b) => b.topic._count.questions - a.topic._count.questions)
          .map((topic) => topic.topic.name),
        solutionCount: question._count.solutions,
        difficultyRating: getDifficultyRating(
          getAverageDifficultyRatingScore(question)
        ),
      }));

      return response;
    }),
});
