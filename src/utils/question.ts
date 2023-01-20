import { MIN_TAG_COUNT } from "../constants/question";

export const getAverageDifficultyRatingScore = (
  solutions: { solution: { difficultyRating: { value: number } } }[]
): number => {
  return (
    solutions.reduce(
      (sum, solution) =>
        (sum += solution.solution.difficultyRating?.value ?? 0),
      0
    ) / (solutions.length || 1)
  );
};

type Topics = {
  name: string;
  count: number;
};
export const getValidTopics = (topics: Topics[]): Topics[] => {
  return topics.filter((topic) => topic.count > MIN_TAG_COUNT);
};
