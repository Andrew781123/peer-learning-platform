import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const MIN_TAG_COUNT = 2;

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
        },
      });

      const response = questions.map((question) => ({
        ...question,
        topics: question.topics
          .filter((topic) => topic.topic._count.questions >= MIN_TAG_COUNT)
          .sort((a, b) => b.topic._count.questions - a.topic._count.questions)
          .map((topic) => topic.topic.name),
      }));

      return response;
    }),
});
