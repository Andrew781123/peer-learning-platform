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
import SolutionCard from "../../../../components/solution/SolutionCard";
import TopicBadge from "../../../../components/topic/TopicBadge";
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

  await ssg.question.getOne.prefetch({
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

  const { data: getAllSolutionsResponse, isSuccess } =
    trpc.solution.getAllByQuestion.useQuery({
      questionId,
    });

  const { data: getOneQuestionResponse, isSuccess: isQuestionSuccess } =
    trpc.question.getOne.useQuery({
      questionId,
    });

  return (
    <div>
      {isQuestionSuccess && (
        <div>
          <h2>{`Question ${getOneQuestionResponse.number} Submissions`}</h2>
          <div className="mt-1  flex flex-wrap gap-2">
            {getOneQuestionResponse.topics.map((topic) => (
              <TopicBadge key={topic} topic={topic} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-2">
        <List>
          {isSuccess &&
            getAllSolutionsResponse.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
        </List>
      </div>
    </div>
  );
};

export default SolutionPage;
