import { DifficultyRating } from "../constants/difficultyRating";

export default function getDifficultyRating(score: number): DifficultyRating {
  if (score < 3) return DifficultyRating.EASY;
  if (score < 5) return DifficultyRating.MEDIUM;
  return DifficultyRating.HARD;
}
