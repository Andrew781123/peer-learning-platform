import { publicProcedure, router } from "../trpc";

export const subjectRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return [
      {
        id: "EIE3123",
        title: "Introduction to Computer Networks",
      },
      {
        id: "EIE3124",
        title: "Introduction to Computer Networks",
      },
      {
        id: "EIE3125",
        title: "Introduction to Computer Networks",
      },
    ];
    // return ctx.prisma.subject.findMany();
  }),
});
