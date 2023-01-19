export const calculateVoteCount = (
  votes: {
    value: number;
    [key: string]: any;
  }[]
) => {
  const voteCount = votes.reduce(
    (voteCount, { value }) => (voteCount += value),
    0
  );

  return voteCount;
};
