import { PrismaClient } from "@prisma/client";

export const getAllBySubject = async (
  repo: PrismaClient["pastPaper"],
  { subjectId }: { subjectId: string }
) => {
  const pastPapers = await repo.findMany({
    where: { subjectId },
    include: {
      _count: {
        select: { questions: true },
      },
    },
    orderBy: [
      {
        academicYear: "desc",
      },
    ],
  });

  return pastPapers.map(({ _count, ...rest }) => ({
    ...rest,
    questionsCount: _count?.questions,
  }));
};
