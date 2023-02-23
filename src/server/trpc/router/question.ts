import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  getAllQuestionsByPastPaper,
  getNumberOfSolutionOfQuestionByMe,
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
      try {
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
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),

  getNumberOfSolutionOfQuestionByMe: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const { questionId } = input;

        const userId = ctx?.session?.user?.id;
        if (!userId) return 0;

        const count = await getNumberOfSolutionOfQuestionByMe(
          ctx.prisma.questionSolution,
          {
            questionId,
            userId,
          }
        );

        return count;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
