import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const subjectTopicRouter = router({
  getAllBySubject: publicProcedure
    .input(z.object({ subjectId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.subjectTopic.findMany({
        where: {
          subjectId: input.subjectId,
        },
      });
    }),
});
