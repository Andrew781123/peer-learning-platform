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
  const prisma = new PrismaClient();

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

  const question = await prisma.question.findUnique({
    where: { id: params.questionId },
  });

  if (!question) return { notFound: true };

  return {
    props: {
      solutionId: params.solutionId,
      questionId: params.questionId,
      questionNumber: question.number,
      trpcState: ssg.dehydrate(),
    },
    // No need to revalidate, we don't have any dynamic data
  };
};

type PastPaperPageProps = {
  solutionId: string;
  questionId: string;
  questionNumber: number;
};

const PastPaperPage: NextPage<PastPaperPageProps> = (props) => {
  const { solutionId, questionId, questionNumber } = props;

  const trpcUtils = trpc.useContext();

  const solution = trpc.solution.getOneById.useQuery({
    id: solutionId,
  });

  const voteInfo = trpc.solutionVote.getVoteInfo.useQuery({
    solutionId,
  });

  const voteMutation = trpc.solutionVote.vote.useMutation({
    onMutate: async ({ voteValue }) => {
      await trpcUtils.solutionVote.getVoteInfo.cancel();

      const previousVoteInfo = trpcUtils.solutionVote.getVoteInfo.getData();

      trpcUtils.solutionVote.getVoteInfo.setData({
        voteOfUser: voteValue,
        votes: previousVoteInfo?.votes ?? solution.data!.votes + voteValue,
      });

      return { previousVoteInfo };
    },

    onError: (err, _, context) => {
      if (context?.previousVoteInfo) {
        trpcUtils.solutionVote.getVoteInfo.setData(context.previousVoteInfo);
      }
    },

    onSettled: () => {
      trpcUtils.solutionVote.getVoteInfo.refetch();
    },
  });

  const title = generateSolutionTitle(solutionId);

  const onVoteClick = (voteValue: SolutionVoteValue) => {
    const isUserVoted =
      voteInfo.data?.voteOfUser !== SOLUTION_VOTE_VALUE.notVoted;
    // TODO: Show error message
    if (isUserVoted) return;

    voteMutation.mutate({
      solutionId,
      questionId,
      voteValue,
    });
  };

  if (!solution.isSuccess) return null;

  return (
    <div className="divide-y divide-gray-400">
      <h1 className="mb-2">
        <p className="text-xl font-bold">{`Solution of Question ${questionNumber}`}</p>
        <p className="text-gray-400">
          from <span className="text-gray-300">{title}</span>
        </p>
        <p className="text-gray-400">
          posted{" "}
          <span className="text-gray-300">{solution.data.createdAt}</span>
        </p>
      </h1>

      <div className="flex w-full gap-4">
        <div className="mt-2 flex w-fit flex-col items-center">
          <button onClick={() => onVoteClick(SOLUTION_VOTE_VALUE.upVoted)}>
            <VoteIcon
              type="upVote"
              size="medium"
              voted={voteInfo.data?.voteOfUser === SOLUTION_VOTE_VALUE.upVoted}
            />
          </button>

          <p className="cursor-default">
            {voteInfo.data?.votes ?? solution.data.votes}
          </p>

          <button onClick={() => onVoteClick(SOLUTION_VOTE_VALUE.downVoted)}>
            <VoteIcon
              type="downVote"
              size="medium"
              voted={
                voteInfo.data?.voteOfUser === SOLUTION_VOTE_VALUE.downVoted
              }
            />
          </button>
        </div>

        <div
          className="unreset mt-3"
          dangerouslySetInnerHTML={{ __html: solution.data.markdown }}
        ></div>
      </div>

      {/* <ol>
        <li>jjojioj</li>
      </ol> */}
    </div>
  );
};

export default PastPaperPage;
