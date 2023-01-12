import { z } from "zod";
import { getAllQuestionsByPastPaper } from "../../../services/question-service";
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
      const questions = await getAllQuestionsByPastPaper(
        ctx.prisma.question,
        input.pastPaperId
      );

      const response = questions.map((question) => ({
        ...question,
        topics: question.topics
          .filter((topic) => topic.count > MIN_TAG_COUNT)
          .sort((a, b) => b.count - a.count)
          .map((topic) => topic.name),
      }));

      return response;
    }),
});
