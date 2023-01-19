export type SolutionVoteValue = "up-voted" | "down-voted" | "not-voted";

export const SOLUTION_VOTE_VALUE_TO_COUNT_MAP: Record<
  SolutionVoteValue,
  number
> = {
  "up-voted": 1,
  "down-voted": -1,
  "not-voted": 0,
} as const;
