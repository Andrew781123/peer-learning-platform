import { GetAllSolutionsResponse } from "../../types/solution";
import DifficultyLevelChip from "../ui/DifficultyLevelChip";

type SolutionCardProps = {
  solution: GetAllSolutionsResponse[number];
};

const SolutionCard = (props: SolutionCardProps) => {
  const { solution } = props;

  const onSolutionCardClick = () => {};

  return (
    <div
      className="flex items-center  bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light"
      onClick={onSolutionCardClick}
    >
      <div>
        <p>{solution.votes}</p>
      </div>

      <DifficultyLevelChip score={solution.difficultyRating.value} />
    </div>
  );
};

export default SolutionCard;
