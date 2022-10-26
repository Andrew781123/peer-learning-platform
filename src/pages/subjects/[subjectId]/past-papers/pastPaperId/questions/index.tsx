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
import PageHeader from "../../../../../../components/ui/PageHeader";
import { createContextInner } from "../../../../../../server/trpc/context";
import { appRouter } from "../../../../../../server/trpc/router/_app";

interface IParams extends ParsedUrlQuery {
  pastPaperId: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prisma = new PrismaClient();

  const questions = await prisma.question.findMany();

  const paths = questions.map((question) => ({
    params: { questionId: question.id.toString() },
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

  await ssg.question.getAllByPastPaper.prefetch({
    pastPaperId: +params.pastPaperId,
  });

  return {
    props: {
      pastPaperId: params.pastPaperId,
      trpcState: ssg.dehydrate(),
    },
  };
};

type QuestionPageProps = {};

const QuestionPage: NextPage<QuestionPageProps> = (props) => {
  return (
    <div>
      <PageHeader title="Questions" />
    </div>
  );
};

export default QuestionPage;
