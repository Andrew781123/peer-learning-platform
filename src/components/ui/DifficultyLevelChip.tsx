import { Badge } from "@mantine/core";

import { DifficultyLevel } from "../../constants/difficultyRating";
import getDifficultyLevel from "../../utils/getDifficultyRating";

type DifficultyChipProps = {
  score: number;
};

const ChipUIMap = {
  [DifficultyLevel.EASY]: {
    color: "green",
    displayText: DifficultyLevel.EASY,
  },
  [DifficultyLevel.MEDIUM]: {
    color: "yellow",
    displayText: DifficultyLevel.MEDIUM,
  },
  [DifficultyLevel.HARD]: {
    color: "red",
    displayText: DifficultyLevel.HARD,
  },
} as const;

const DifficultyLevelChip = (props: DifficultyChipProps) => {
  const { score } = props;

  const level = getDifficultyLevel(score);

  return (
    <Badge color={ChipUIMap[level].color} size="lg" variant="filled">
      {ChipUIMap[level].displayText}
    </Badge>
  );
};

export default DifficultyLevelChip;
