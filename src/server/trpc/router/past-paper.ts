import { TRPCError } from "@trpc/server";
import { string, z } from "zod";

import { getAllBySubject } from "../../../services/past-paper-service";
import { publicProcedure, router } from "../trpc";

export const pastPaperRouter = router({
  getAllBySubject: publicProcedure
    .input(
      z.object({
        subjectId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const pastPapers = await getAllBySubject(ctx.prisma.pastPaper, {
        subjectId: input.subjectId,
      });

      const questions = await ctx.prisma.question.findMany({
        include: {
          _count: {
            select: {
              solutions: true,
            },
          },
        },
      });

      const pastPaperIdToSolutionsCount = questions.reduce((map, question) => {
        return {
          ...map,
          [question.pastPaperId]:
            (map[question.pastPaperId] ?? 0) + question._count.solutions,
        };
      }, {} as { [key: string]: number });

      return pastPapers.map((pastPaper) => ({
        ...pastPaper,
        solutionsCount: pastPaperIdToSolutionsCount[pastPaper.id] ?? 0,
      }));
    }),
  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.pastPaper.findFirst({
        where: { id: input.id },
      });
    }),

  getMySubmissionsCount: publicProcedure
    .input(
      z.object({
        pastPaperId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const userId = ctx.session?.user?.id;
        if (!userId) return 0;

        const count = await ctx.prisma.questionSolution.count({
          where: {
            solution: {
              userId,
            },
            question: {
              pastPaperId: input.pastPaperId,
            },
          },
        });

        return count;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
