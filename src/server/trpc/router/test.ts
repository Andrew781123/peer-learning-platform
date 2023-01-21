import { publicProcedure, router } from "../trpc";

export const testRouter = router({
  hello: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.solution.findUnique({
      where: {
        id: "",
      },
      include: {
        votes: true,
      },
    });
  }),
});
