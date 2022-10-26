import { publicProcedure, router } from "../trpc";

export const subjectRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subject.findMany();
  }),
});
