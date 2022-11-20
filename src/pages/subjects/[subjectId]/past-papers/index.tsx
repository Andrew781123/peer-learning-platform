import { PrismaClient } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react/ssg";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { ParsedUrlQuery } from "querystring";
import superjson from "superjson";
import PastPaperCard from "../../../../components/past-paper/PastPaperCard";
import List from "../../../../components/ui/List";
import PageHeader from "../../../../components/ui/PageHeader";
import { createContextInner } from "../../../../server/trpc/context";
import { appRouter } from "../../../../server/trpc/router/_app";
import { GetAllPastPapersBySubjectResponse } from "../../../../types/past-paper";

interface IParams extends ParsedUrlQuery {
  subjectId: string;
}

export const getStaticPaths: GetStaticPaths<IParams> = async () => {
  const prisma = new PrismaClient();

  const subjects = await prisma.subject.findMany();

  const paths = subjects.map((subject) => ({
    params: { subjectId: subject.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  PastPaperPageProps,
  IParams
> = async (context: GetStaticPropsContext<IParams>) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  const params = context.params;

  if (params === undefined) return { notFound: true };

  const getAllPastPaperBySubjectResponse =
    await ssg.pastPaper.getAllBySubject.fetch({ subjectId: params.subjectId });

  return {
    props: {
      getAllPastPaperBySubjectResponse,
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type PastPaperPageProps = {
  getAllPastPaperBySubjectResponse: GetAllPastPapersBySubjectResponse;
};

const PastPaperPage: NextPage<PastPaperPageProps> = (props) => {
  const { getAllPastPaperBySubjectResponse } = props;

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Past Papers" />
      </div>

      <List>
        {getAllPastPaperBySubjectResponse.map((pastPaper) => (
          <PastPaperCard key={pastPaper.id} pastPaper={pastPaper} />
        ))}
      </List>
    </div>
  );
};

export default PastPaperPage;
