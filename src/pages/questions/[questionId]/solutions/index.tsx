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
import { createContextInner } from "../../../../server/trpc/context";
import { appRouter } from "../../../../server/trpc/router/_app";
import { trpc } from "../../../../utils/trpc";

interface IParams extends ParsedUrlQuery {
  questionId: string;
}

export const getStaticPaths: GetStaticPaths<IParams> = async () => {
  const prisma = new PrismaClient();

  const questions = await prisma.question.findMany();

  const paths = questions.map((question) => ({
    params: { questionId: question.id },
  }));

  console.log(paths);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  SolutionPageProps,
  IParams
> = async (context: GetStaticPropsContext<IParams>) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });

  await ssg.subject.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type SolutionPageProps = {};

const SolutionPage: NextPage<SolutionPageProps> = (props) => {
  const { data: getAllSubjectResponse, isSuccess } =
    trpc.subject.getAll.useQuery();

  return <div>Solution Page</div>;
};

export default SolutionPage;
