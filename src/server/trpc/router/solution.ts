import cuid from "cuid";
import { z } from "zod";
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
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { pastPaperId, solutions } = input;

      const questionIdToSolutionMap = new Map<
        string,
        {
          isNewQuestion: boolean;
          number: number;
          markdown: string;
          difficultyRatingId: number;
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

        const questionId = isNewQuestion
          ? cuid()
          : existingQuestions.find(
              (question) => question.number === solution.questionNumber
            )!.id;

        questionIdToSolutionMap.set(questionId, {
          isNewQuestion,
          number: solution.questionNumber,
          markdown: solution.markdown,
          difficultyRatingId: solution.difficultyRatingId,
        });
      }

      const createQuestions = ctx.prisma.question.createMany({
        data: Array.from(questionIdToSolutionMap.entries())
          .filter(([_, solution]) => solution.isNewQuestion)
          .map(([questionId, solution]) => ({
            id: questionId,
            number: solution.number,
            pastPaperId,
          })),
      });

      const createSolutions = ctx.prisma.questionSolution.createMany({
        data: Array.from(questionIdToSolutionMap.entries()).map(
          ([questionId, solution]) => ({
            questionId,
            userId: 11,
            markdown: solution.markdown,
            difficultyRatingId: solution.difficultyRatingId,
          })
        ),
      });

      return await ctx.prisma.$transaction([createQuestions, createSolutions]);
    }),
});
