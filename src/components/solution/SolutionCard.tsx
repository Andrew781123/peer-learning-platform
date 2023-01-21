import { useRouter } from "next/router";
import { IoIosArrowForward } from "react-icons/io";
import { GetAllSolutionsResponse } from "../../types/solution";
import generateSolutionTitle from "../../utils/solution/generate-solution-title";
import VoteInfo from "../vote/VoteInfo";

type SolutionCardProps = {
  solution: GetAllSolutionsResponse[number];
};

const SolutionCard = (props: SolutionCardProps) => {
  const { solution } = props;

  const router = useRouter();

  const title = generateSolutionTitle(solution.id);

  const onSolutionCardClick = () => {
    router.push(`/solutions/${solution.id}`);
  };

  return (
    <div
      className="flex items-center  bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light"
      onClick={onSolutionCardClick}
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{title}</h1>
          <VoteInfo voteCount={solution.votes} />
        </div>
        <IoIosArrowForward />
        {/* <DifficultyLevelChip score={solution.difficultyRating.value} /> */}
      </div>
    </div>
  );
};

export default SolutionCard;
