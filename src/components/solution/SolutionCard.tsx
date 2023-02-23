import { useRouter } from "next/router";
import { IoIosArrowForward } from "react-icons/io";

import { getTimeFromX } from "../../server/utils/dates";
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
    router.push(`${router.asPath}/${solution.id}`);
  };

  return (
    <div
      className="flex items-center  bg-surface-default p-3 hover:cursor-pointer hover:bg-surface-light"
      onClick={onSolutionCardClick}
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-md font-bold">From {title}</h1>
          <p className="text-sm text-gray-400">
            Posted{" "}
            <span className="text-gray-300">
              {getTimeFromX({ toDate: new Date(solution.createdAt) })}
            </span>
          </p>
          <VoteInfo voteCount={solution.votes} />
        </div>
        <IoIosArrowForward />
        {/* <DifficultyLevelChip score={solution.difficultyRating.value} /> */}
      </div>
    </div>
  );
};

export default SolutionCard;
