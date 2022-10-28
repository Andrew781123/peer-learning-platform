import { DifficultyLevel } from "../../constants/difficultyRating";

export default function getDifficultyLevel(score: number): DifficultyLevel {
  if (score < 3) return DifficultyLevel.EASY;
  if (score < 5) return DifficultyLevel.MEDIUM;
  return DifficultyLevel.HARD;
}
