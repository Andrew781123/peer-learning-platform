import {
  SolutionVoteValue,
  SOLUTION_VOTE_VALUE_TO_COUNT_MAP,
} from "../../types/solution-vote";

export const calculateVoteCount = (
  votes: {
    value: string;
    [key: string]: any;
  }[]
) => {
  const voteCount = votes.reduce(
    (voteCount, { value }) =>
      (voteCount +=
        SOLUTION_VOTE_VALUE_TO_COUNT_MAP[value as SolutionVoteValue]),
    0
  );

  return voteCount;
};
