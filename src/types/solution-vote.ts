export type SolutionVoteValue =
  typeof SOLUTION_VOTE_VALUE[keyof typeof SOLUTION_VOTE_VALUE];

export const SOLUTION_VOTE_VALUE = {
  upVoted: 1,
  downVoted: -1,
  notVoted: 0,
} as const;
