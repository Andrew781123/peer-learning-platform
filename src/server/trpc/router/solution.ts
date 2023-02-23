import { TRPCError } from "@trpc/server";
import cuid from "cuid";
import { z } from "zod";

import {
  getAllSolutionsByQuestion,
  getOneById,
} from "../../../services/solution-service";
import { publicProcedure, router } from "../trpc";

export const solutionRouter = router({
  createMany: publicProcedure
    .input(
      z.object({
        pastPaperId: z.number(),
        solutions: z.array(
          z.object({
            questionNumber: z.number(),
            markdown: z.string(),
            difficultyRatingId: z.number(),
            topicIds: z.array(z.number()),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.session?.user)
          return new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not logged in",
          });

        const userId = ctx.session.user.id;

        const { pastPaperId, solutions } = input;

        const questionIdToSolutionMap = new Map<
          [string, string],
          {
            isNewQuestion: boolean;
            number: number;
            markdown: string;
            difficultyRatingId: number;
            topicIds: number[];
          }
        >();

        const existingQuestions = await ctx.prisma.question.findMany({
          where: {
            pastPaperId,
          },
        });

        for (const solution of solutions) {
          const isNewQuestion = !existingQuestions.some(
            (question) => question.number === solution.questionNumber
          );

          const solutionId = cuid();

          const questionId = isNewQuestion
            ? cuid()
            : existingQuestions.find(
                (question) => question.number === solution.questionNumber
              )!.id;

          questionIdToSolutionMap.set([questionId, solutionId], {
            isNewQuestion,
            number: solution.questionNumber,
            markdown: solution.markdown,
            difficultyRatingId: solution.difficultyRatingId,
            topicIds: solution.topicIds,
          });
        }

        const createQuestions = ctx.prisma.question.createMany({
          data: Array.from(questionIdToSolutionMap.entries())
            .filter(([_, solution]) => solution.isNewQuestion)
            .map(([[questionId, _], solution]) => ({
              id: questionId,
              number: solution.number,
              pastPaperId,
            })),
        });

        const addTopicsToQuestions = ctx.prisma.questionTopic.createMany({
          data: Array.from(questionIdToSolutionMap.entries()).flatMap(
            ([[questionId, _], solution]) =>
              solution.topicIds.map((topicId) => ({
                questionId,
                topicId,
              }))
          ),
        });

        const createSolutions = ctx.prisma.solution.createMany({
          data: Array.from(questionIdToSolutionMap.entries()).map(
            ([[_, solutionId], solution]) => ({
              id: solutionId,
              userId,
              markdown: solution.markdown,
              difficultyRatingId: solution.difficultyRatingId,
            })
          ),
        });

        const createQuestionSolution = ctx.prisma.questionSolution.createMany({
          data: Array.from(questionIdToSolutionMap.entries()).map(
            ([[questionId, solutionId], _]) => ({
              questionId,
              solutionId,
            })
          ),
        });

        return await ctx.prisma.$transaction([
          createQuestions,
          addTopicsToQuestions,
          createSolutions,
          createQuestionSolution,
        ]);
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  getAllByQuestion: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await getAllSolutionsByQuestion(
        ctx.prisma.solution,
        input.questionId
      );

      return response;
    }),
  getOneById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const response = await getOneById(ctx.prisma.solution, {
          solutionId: input.id,
        });

        if (!response) {
          throw new Error("Solution not found");
        }

        return response;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
