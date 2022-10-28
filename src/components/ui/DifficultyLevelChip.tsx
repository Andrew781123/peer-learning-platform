import { DifficultyLevel } from "../../constants/difficultyRating";

type DifficultyChipProps = {
  level: DifficultyLevel;
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
  const { level } = props;

  return (
    <div
      className={`flex items-center justify-center rounded-full ${ChipUIMap[level].color} px-2 py-1 text-xs font-bold text-white`}
    >
      {ChipUIMap[level].displayText}
    </div>
  );
};

export default DifficultyLevelChip;
