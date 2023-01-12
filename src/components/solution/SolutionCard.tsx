import { GetAllSolutionsResponse } from "../../types/solution";
import DifficultyLevelChip from "../ui/DifficultyLevelChip";
import VoteInfo from "../vote/VoteInfo";

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
      <div className="flex w-full justify-between ">
        <VoteInfo voteCount={solution.votes} />
        <DifficultyLevelChip score={solution.difficultyRating.value} />
      </div>
    </div>
  );
};

export default SolutionCard;
