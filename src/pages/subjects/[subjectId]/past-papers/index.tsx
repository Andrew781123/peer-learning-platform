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
import Divider from "../../../../components/ui/Divider";
import List from "../../../../components/ui/List";
import PageHeader from "../../../../components/ui/PageHeader";
import { createContextInner } from "../../../../server/trpc/context";
import { appRouter } from "../../../../server/trpc/router/_app";
import { trpc } from "../../../../utils/trpc";

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

  const { data: getAllPastPaperBySubjectResponse, isSuccess } =
    trpc.pastPaper.getAllBySubject.useQuery({ subjectId });

  return (
    <div className="">
      <div>
        <PageHeader title="Past Papers" />
        <Divider />
      </div>

      <List
        emptyMessage="No past exam papers for this subject"
        className="pt-4"
      >
        {isSuccess &&
          getAllPastPaperBySubjectResponse!.map((pastPaper) => (
            <PastPaperCard key={pastPaper.id} pastPaper={pastPaper} />
          ))}
      </List>
    </div>
  );
};

export default PastPaperPage;
