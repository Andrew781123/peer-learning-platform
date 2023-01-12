import { z } from "zod";
import {
  getAllQuestionsByPastPaper,
  getOneQuestion,
} from "../../../services/question-service";
import { getValidTopics } from "../../../utils/question";
import { publicProcedure, router } from "../trpc";

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
        topics: getValidTopics(question.topics)
          .sort((a, b) => b.count - a.count)
          .map((topic) => topic.name),
      }));

      return response;
    }),

  getOne: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const question = await getOneQuestion(
          ctx.prisma.question,
          input.questionId
        );

        if (!question) throw new Error("Question not found");

        const response = {
          ...question,
          topics: getValidTopics(question.topics)
            .sort((a, b) => b.count - a.count)
            .map((topic) => topic.name),
        };

        return response;
      } catch (err) {
        throw err;
      }
    }),
});
