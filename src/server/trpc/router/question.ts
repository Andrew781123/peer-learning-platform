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
        where: { pastPaperId: input.pastPaperId },
        select: {
          id: true,
          number: true,
          topics: {
            where: {
              tagCount: {
                gt: MIN_TAG_COUNT,
              },
            },
            select: {
              id: true,
              topic: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      const response = questions.map((question) => ({
        ...question,
        topics: question.topics.map((topic) => topic.topic.name),
      }));

      return response;
    }),
});
