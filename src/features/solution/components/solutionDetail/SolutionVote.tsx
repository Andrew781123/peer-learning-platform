import { captureException } from "@sentry/nextjs";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import VoteIcon from "@/components/vote/VoteIcon";
import { SOLUTION_VOTE_VALUE, SolutionVoteValue } from "@/types/solution-vote";
import { trpc } from "@/utils/trpc";

type SolutionVoteProps = {
  solutionId: string;
  fallbackVoteCount: number;
  questionId: string;
};

export const SolutionVote = ({
  solutionId,
  questionId,
  fallbackVoteCount,
}: SolutionVoteProps) => {
  const trpcUtils = trpc.useContext();
  const { status: authStatus } = useSession();

  const voteInfo = trpc.solutionVote.getVoteInfo.useQuery({
    solutionId,
  });

  const voteMutation = trpc.solutionVote.vote.useMutation({
    onMutate: async ({ voteValue }) => {
      await trpcUtils.solutionVote.getVoteInfo.cancel();

      const previousVoteInfo = trpcUtils.solutionVote.getVoteInfo.getData();

      trpcUtils.solutionVote.getVoteInfo.setData(
        {
          voteOfUser: voteValue,
          votes: previousVoteInfo?.votes ?? fallbackVoteCount + voteValue,
        },
        {
          solutionId,
        }
      );

      return { previousVoteInfo };
    },

    onError: (err, _, context) => {
      captureException(err);

      if (context?.previousVoteInfo) {
        trpcUtils.solutionVote.getVoteInfo.setData(context.previousVoteInfo);
      }
    },

    onSettled: () => {
      trpcUtils.solutionVote.getVoteInfo.refetch();
    },
  });

  const onVoteClick = (voteValue: SolutionVoteValue) => {
    if (authStatus !== "authenticated") {
      toast.error("You must be logged in to vote");
      return;
    }

    const isUserVoted =
      voteInfo.data?.voteOfUser !== SOLUTION_VOTE_VALUE.notVoted;
    if (isUserVoted) {
      toast.error("You have already voted");
      return;
    }

    voteMutation.mutate({
      solutionId,
      questionId,
      voteValue,
    });
  };

  return (
    <div className="flex w-fit flex-col items-center">
      <button
        onClick={() => onVoteClick(SOLUTION_VOTE_VALUE.upVoted)}
        disabled={!voteInfo.data}
      >
        <VoteIcon
          type="upVote"
          size="medium"
          voted={voteInfo.data?.voteOfUser === SOLUTION_VOTE_VALUE.upVoted}
        />
      </button>

      <p className="cursor-default">
        {voteInfo.data?.votes ?? fallbackVoteCount}
      </p>

      <button
        onClick={() => onVoteClick(SOLUTION_VOTE_VALUE.downVoted)}
        disabled={!voteInfo.data}
      >
        <VoteIcon
          type="downVote"
          size="medium"
          voted={voteInfo.data?.voteOfUser === SOLUTION_VOTE_VALUE.downVoted}
        />
      </button>
    </div>
  );
};
