import { DifficultyLevel } from "../../constants/difficultyRating";
import getDifficultyLevel from "../../utils/getDifficultyRating";

type DifficultyChipProps = {
  score: number;
};

const ChipUIMap = {
  [DifficultyLevel.EASY]: {
    color: "bg-green-500",
    displayText: DifficultyLevel.EASY,
  },
  [DifficultyLevel.MEDIUM]: {
    color: "bg-yellow-500",
    displayText: DifficultyLevel.MEDIUM,
  },
  [DifficultyLevel.HARD]: {
    color: "bg-red-500",
    displayText: DifficultyLevel.HARD,
  },
} as const;

const DifficultyLevelChip = (props: DifficultyChipProps) => {
  const { score } = props;

  const level = getDifficultyLevel(score);

  return (
    <div
      className={`flex items-center justify-center rounded-full ${ChipUIMap[level].color} px-3 py-1 text-xs font-bold text-white`}
    >
      {ChipUIMap[level].displayText}
    </div>
  );
};

export default DifficultyLevelChip;
