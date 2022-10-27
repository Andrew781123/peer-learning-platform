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
import List from "../../../../components/ui/List";
import PageHeader from "../../../../components/ui/PageHeader";
import { createContextInner } from "../../../../server/trpc/context";
import { appRouter } from "../../../../server/trpc/router/_app";
import { trpc } from "../../../../utils/trpc";
import PastPaperCard from "./PastPaperCard";

interface IParams extends ParsedUrlQuery {
  subjectId: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
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

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  const params = context.params as IParams;

  await ssg.pastPaper.getAllBySubject.prefetch({ subjectId: params.subjectId });

  return {
    props: {
      subjectId: params.subjectId,
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type PastPaperPageProps = {
  subjectId: string;
};

const PastPaperPage: NextPage<PastPaperPageProps> = (props) => {
  const { subjectId } = props;

  const pastPapers = trpc.pastPaper.getAllBySubject.useQuery(
    {
      subjectId,
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  return (
    <div>
      <div className="mb-3">
        <PageHeader title="Past Papers" />
      </div>

      <List>
        {pastPapers.data?.map((pastPaper) => (
          <PastPaperCard key={pastPaper.id} pastPaper={pastPaper} />
        ))}
      </List>
    </div>
  );
};

export default PastPaperPage;
