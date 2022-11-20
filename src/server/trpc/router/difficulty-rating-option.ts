import { publicProcedure, router } from "../trpc";

export const difficultyRatingOptionRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.difficultyRatingOption.findMany();
  }),
});
