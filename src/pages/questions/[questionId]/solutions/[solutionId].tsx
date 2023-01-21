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
import VoteIcon from "../../../../components/vote/VoteIcon";
import { createContextInner } from "../../../../server/trpc/context";
import { appRouter } from "../../../../server/trpc/router/_app";
import {
  SolutionVoteValue,
  SOLUTION_VOTE_VALUE,
} from "../../../../types/solution-vote";
import generateSolutionTitle from "../../../../utils/solution/generate-solution-title";
import { trpc } from "../../../../utils/trpc";

interface IParams extends ParsedUrlQuery {
  solutionId: string;
  questionId: string;
}

export const getStaticPaths: GetStaticPaths<IParams> = async () => {
  const prisma = new PrismaClient();

  const questionSolutions = await prisma.questionSolution.findMany();

  const paths = questionSolutions.map(({ questionId, solutionId }) => ({
    params: { solutionId, questionId },
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
      questionId: params.questionId,
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type PastPaperPageProps = {
  solutionId: string;
  questionId: string;
};

const PastPaperPage: NextPage<PastPaperPageProps> = (props) => {
  const { solutionId, questionId } = props;

  const trpcUtils = trpc.useContext();

  const solution = trpc.solution.getOneById.useQuery({
    id: solutionId,
  });

  const voteOfUser = trpc.solutionVote.getVoteInfo.useQuery({
    solutionId,
  });

  const voteMutation = trpc.solutionVote.vote.useMutation({
    onMutate: async ({ voteValue }) => {
      await trpcUtils.solutionVote.getVoteInfo.cancel();

      const previousVoteOfUser = trpcUtils.solutionVote.getVoteInfo.getData();

      trpcUtils.solutionVote.getVoteInfo.setData(voteValue);

      return { previousVoteOfUser };
    },

    onError: (err, _, context) => {
      if (context?.previousVoteOfUser) {
        trpcUtils.solutionVote.getVoteInfo.setData(context.previousVoteOfUser);
      }
    },

    onSettled: () => {
      trpcUtils.solutionVote.getVoteInfo.refetch();
    },
  });

  const title = generateSolutionTitle(solutionId);

  const onVoteClick = (voteValue: SolutionVoteValue) => {
    // TODO: Show error message
    if (voteOfUser.data !== SOLUTION_VOTE_VALUE.notVoted) return;

    voteMutation.mutate({
      solutionId,
      questionId,
      voteValue,
    });
  };

  if (!solution.isSuccess) return null;

  return (
    <div className="divide-y divide-gray-400">
      <h1 className="mb-2 text-xl font-bold">{title}</h1>

      <div className="flex w-full gap-4">
        <div className="mt-2 flex w-fit flex-col items-center">
          <button onClick={() => onVoteClick(SOLUTION_VOTE_VALUE.upVoted)}>
            <VoteIcon
              type="upVote"
              size="medium"
              voted={voteOfUser.data === SOLUTION_VOTE_VALUE.upVoted}
            />
          </button>

          <p className="cursor-default">{solution.data.votes}</p>

          <button onClick={() => onVoteClick(SOLUTION_VOTE_VALUE.downVoted)}>
            <VoteIcon
              type="downVote"
              size="medium"
              voted={voteOfUser.data === SOLUTION_VOTE_VALUE.downVoted}
            />
          </button>
        </div>

        <div
          className="unreset mt-3"
          dangerouslySetInnerHTML={{ __html: solution.data.markdown }}
        ></div>
      </div>

      <ol>
        <li>jjojioj</li>
      </ol>
    </div>
  );
};

export default PastPaperPage;
