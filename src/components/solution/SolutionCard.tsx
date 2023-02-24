import clsx from "clsx";
import { useRouter } from "next/router";
import { FaUserCheck } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

import VoteInfo from "@/components/vote/VoteInfo";
import { useUser } from "@/hooks/useUser";
import { getTimeFromX } from "@/server/utils/dates";
import { GetAllSolutionsResponse } from "@/types/solution";
import generateSolutionTitle from "@/utils/solution/generate-solution-title";

type SolutionCardProps = {
  solution: GetAllSolutionsResponse[number];
};

const SolutionCard = (props: SolutionCardProps) => {
  const { solution } = props;

  const router = useRouter();
  const { user } = useUser();

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
          <h1 className="text-lg font-bold">From {title}</h1>

          <div
            className={clsx(
              user?.id !== solution.userId && "hidden",
              "flex items-center space-x-1"
            )}
          >
            <FaUserCheck />
            <span className="text-yellow-300 text-sm">By you</span>
          </div>

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
