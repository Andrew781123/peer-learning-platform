import { IoIosArrowForward } from "react-icons/io";
import { GetAllSolutionsResponse } from "../../types/solution";
import VoteInfo from "../vote/VoteInfo";

type SolutionCardProps = {
  solution: GetAllSolutionsResponse[number];
};

const SolutionCard = (props: SolutionCardProps) => {
  const { solution } = props;

  const title = `Solution #${solution.id.toString().slice(-7)}`;

  const onSolutionCardClick = () => {};

  return (
    <div
      className="flex items-center  bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light"
      onClick={onSolutionCardClick}
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <p>{title}</p>
          <VoteInfo voteCount={solution.votes} />
        </div>
        <IoIosArrowForward />
        {/* <DifficultyLevelChip score={solution.difficultyRating.value} /> */}
      </div>
    </div>
  );
};

export default SolutionCard;
