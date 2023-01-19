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
import VoteIcon from "../../components/vote/VoteIcon";
import { createContextInner } from "../../server/trpc/context";
import { appRouter } from "../../server/trpc/router/_app";
import { SolutionVoteValue } from "../../types/solution-vote";
import generateSolutionTitle from "../../utils/solution/generate-solution-title";
import { trpc } from "../../utils/trpc";

interface IParams extends ParsedUrlQuery {
  solutionId: string;
}

export const getStaticPaths: GetStaticPaths<IParams> = async () => {
  const prisma = new PrismaClient();

  const subjects = await prisma.questionSolution.findMany();

  const paths = subjects.map((subject) => ({
    params: { solutionId: subject.id },
  }));

  return {
    paths,
    fallback: "blocking",
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

  const solution = await ssg.solution.getOneById.fetch({
    id: params.solutionId,
  });

  if (!solution) return { notFound: true };

  return {
    props: {
      solutionId: params.solutionId,
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type PastPaperPageProps = {
  solutionId: string;
};

const PastPaperPage: NextPage<PastPaperPageProps> = (props) => {
  const { solutionId } = props;

  const solution = trpc.solution.getOneById.useQuery({
    id: solutionId,
  });

  const voteOfUser = trpc.solutionVote.getVoteOfUser.useQuery({
    solutionId,
  });

  const voteMutation = trpc.solutionVote.vote.useMutation();

  const title = generateSolutionTitle(solutionId);

  const onVoteClick = (voteValue: SolutionVoteValue) => {
    // TODO: Show error message
    if (voteOfUser.data === 0) return;

    voteMutation.mutate({
      solutionId,
      voteValue,
    });
  };

  if (!solution.isSuccess) return null;

  return (
    <div className="divide-y divide-gray-400">
      <h1 className="mb-2">{title}</h1>

      <div className="w-full">
        <div className="mt-2 flex w-fit flex-col items-center">
          <button onClick={() => onVoteClick(1)}>
            <VoteIcon
              type="upVote"
              size="medium"
              voted={voteOfUser.data === 1}
            />
          </button>

          <p className="cursor-default">{solution.data.votes}</p>

          <button onClick={() => onVoteClick(-1)}>
            <VoteIcon
              type="downVote"
              size="medium"
              voted={voteOfUser.data === -1}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PastPaperPage;
