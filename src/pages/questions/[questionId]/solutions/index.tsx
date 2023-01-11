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

  const params = context.params;

  if (params === undefined) return { notFound: true };

  await ssg.solution.getAllByQuestion.prefetch({
    questionId: params.questionId,
  });

  return {
    props: {
      questionId: params.questionId,
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type SolutionPageProps = {
  questionId: string;
};

const SolutionPage: NextPage<SolutionPageProps> = (props) => {
  const { questionId } = props;

  const { data: getAllSubjectResponse, isSuccess } =
    trpc.solution.getAllByQuestion.useQuery({
      questionId,
    });

  console.log(getAllSubjectResponse);

  return (
    <List>
      {isSuccess &&
        getAllSubjectResponse.map((solution) => (
          <div key={solution.id}>{solution.id}</div>
        ))}
    </List>
  );
};

export default SolutionPage;
