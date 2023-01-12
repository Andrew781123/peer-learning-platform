export const getAverageDifficultyRatingScore = (
  solutions: { difficultyRating: { value: number } }[]
): number => {
  return (
    solutions.reduce(
      (sum, solution) => (sum += solution.difficultyRating?.value ?? 0),
      0
    ) / (solutions.length || 1)
  );
};
